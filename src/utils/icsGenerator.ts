// src/utils/icsGenerator.ts
import {
  CourseInfo,
  SemesterConfig,
  DateRange,
  ExportSettings,
  CustomScheduleEvent,
  defaultExportSettings,
} from './types';
import { parseTimeSlot, getDayNumber, defaultSemesterConfig } from './courseProcessor';
import { fetchHolidays } from './holidayAPI';

type HolidayList = Awaited<ReturnType<typeof fetchHolidays>>;

const formatICSDate = (date: Date, time: string): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const [hours, minutes] = time.split(':');
  return `${year}${month}${day}T${hours.padStart(2, '0')}${minutes.padStart(2, '0')}00`;
};

const toDateStr = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const isNationalHoliday = (date: Date, holidays: HolidayList): boolean => {
  const s = date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');
  const h = holidays.find(d => d.date === s);
  return !!(h?.isHoliday && h?.description);
};

const isSchoolHoliday = (date: Date, schoolHolidays: string[]): boolean =>
  schoolHolidays.includes(toDateStr(date));

const getClassDatesInRange = (
  range: DateRange,
  dayNumber: number,
  holidays: HolidayList,
  schoolHolidays: string[]
): Date[] => {
  if (!range.start || !range.end) return [];

  const dates: Date[] = [];
  const current = new Date(range.start);
  current.setHours(0, 0, 0, 0);
  const end = new Date(range.end);
  end.setHours(23, 59, 59, 999);

  while (current <= end) {
    if (
      current.getDay() === dayNumber &&
      !isNationalHoliday(current, holidays) &&
      !isSchoolHoliday(current, schoolHolidays)
    ) {
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const getCustomEventDates = (
  event: CustomScheduleEvent,
  semesterConfig: SemesterConfig,
  holidays: HolidayList,
  schoolHolidays: string[]
): Date[] => {
  const dates: Date[] = [];

  for (const range of [semesterConfig.spring, semesterConfig.fall]) {
    if (!range.start || !range.end) continue;

    const end = new Date(range.end);
    end.setHours(23, 59, 59, 999);

    for (const day of event.days) {
      // find first occurrence of this weekday in the range
      const first = new Date(range.start);
      first.setHours(0, 0, 0, 0);
      while (first.getDay() !== day) first.setDate(first.getDate() + 1);

      const interval = event.repeat === 'biweekly' ? 14 : 7;
      const cur = new Date(first);
      while (cur <= end) {
        if (!isNationalHoliday(cur, holidays) && !isSchoolHoliday(cur, schoolHolidays)) {
          dates.push(new Date(cur));
        }
        cur.setDate(cur.getDate() + interval);
      }
    }
  }

  return dates.sort((a, b) => a.getTime() - b.getTime());
};

const buildVEvent = (
  uid: string,
  dtstart: string,
  dtend: string,
  summary: string,
  location: string,
  description: string,
  exportTimestamp: string,
  settings: ExportSettings
): string => {
  const lines = [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART;TZID=Asia/Taipei:${dtstart}`,
    `DTEND;TZID=Asia/Taipei:${dtend}`,
    `SUMMARY:${summary}`,
    `LOCATION:${location || '未指定地點'}`,
    'TRANSP:OPAQUE',
    `DESCRIPTION:${description}`,
    `X-APPLE-CALENDAR-COLOR:${settings.eventColor}`,
    'X-MICROSOFT-CDO-BUSYSTATUS:BUSY',
    `CREATED:${exportTimestamp}`,
  ];

  if (settings.alarmMinutes !== null) {
    lines.push(
      'BEGIN:VALARM',
      `TRIGGER:-PT${settings.alarmMinutes}M`,
      'ACTION:DISPLAY',
      'DESCRIPTION:課程提醒',
      'END:VALARM'
    );
  }

  lines.push('END:VEVENT');
  return lines.join('\r\n');
};

const buildTitle = (course: CourseInfo, settings: ExportSettings): string => {
  const parts: string[] = [];
  for (const { field, enabled } of settings.titleFields) {
    if (!enabled) continue;
    const value = field === 'location' ? course.location
      : field === 'courseName' ? course.courseName
      : field === 'className' ? course.className
      : field === 'teacher' ? course.teacher
      : '';
    if (!value) continue;
    parts.push(field === 'location' ? `[${value}]` : value);
  }
  return parts.join(' ') || course.event || '課程';
};

export const generateICS = async (
  courses: CourseInfo[],
  semesterConfig: SemesterConfig = defaultSemesterConfig,
  exportSettings: ExportSettings = defaultExportSettings,
  customEvents: CustomScheduleEvent[] = []
): Promise<string> => {
  const now = new Date();
  const currentYear = now.getFullYear();

  const [cur, next] = await Promise.allSettled([
    fetchHolidays(currentYear),
    fetchHolidays(currentYear + 1),
  ]);
  const holidays = [
    ...(cur.status === 'fulfilled' ? cur.value : []),
    ...(next.status === 'fulfilled' ? next.value : []),
  ];

  const exportTimestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const exportMs = now.getTime();
  const schoolHolidays = semesterConfig.schoolHolidays ?? [];

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//YunTech//Course Calendar//TW',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${exportSettings.calendarName}`,
    'X-WR-TIMEZONE:Asia/Taipei',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Taipei',
    'X-LIC-LOCATION:Asia/Taipei',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0800',
    'TZOFFSETTO:+0800',
    'TZNAME:CST',
    'DTSTART:19700101T000000',
    'END:STANDARD',
    'END:VTIMEZONE',
  ].join('\r\n');

  // Course events
  for (let courseIndex = 0; courseIndex < courses.length; courseIndex++) {
    const course = courses[courseIndex];
    const timeRange = parseTimeSlot(course.timeSlot);
    if (!timeRange) continue;

    const dayNumber = getDayNumber(course.day);
    if (dayNumber < 0) continue;

    const allDates = [
      ...getClassDatesInRange(semesterConfig.spring, dayNumber, holidays, schoolHolidays),
      ...getClassDatesInRange(semesterConfig.fall, dayNumber, holidays, schoolHolidays),
    ].sort((a, b) => a.getTime() - b.getTime());

    const location = course.location.trim();
    const summary = buildTitle(course, exportSettings);
    const description = location
      ? `雲科大課表 - ${course.event}\n地點: ${location}`
      : `雲科大課表 - ${course.event}`;

    allDates.forEach((date, dateIndex) => {
      const uid = `course-${courseIndex}-${dateIndex}-${exportMs}@yuntech.edu.tw`;
      icsContent += '\r\n' + buildVEvent(
        uid,
        formatICSDate(date, timeRange.start),
        formatICSDate(date, timeRange.end),
        summary, location, description,
        exportTimestamp, exportSettings
      );
    });
  }

  // Custom events
  for (let evIndex = 0; evIndex < customEvents.length; evIndex++) {
    const ev = customEvents[evIndex];
    const allDates = getCustomEventDates(ev, semesterConfig, holidays, schoolHolidays);
    const location = ev.location.trim();
    const locationEnabled = exportSettings.titleFields.find(f => f.field === 'location')?.enabled ?? true;
    const summary = locationEnabled && location ? `[${location}] ${ev.title}` : ev.title;

    allDates.forEach((date, dateIndex) => {
      const uid = `custom-${evIndex}-${dateIndex}-${exportMs}@yuntech.edu.tw`;
      icsContent += '\r\n' + buildVEvent(
        uid,
        formatICSDate(date, ev.startTime),
        formatICSDate(date, ev.endTime),
        summary, location, ev.title,
        exportTimestamp, exportSettings
      );
    });
  }

  icsContent += '\r\nEND:VCALENDAR';
  return icsContent;
};

export const downloadICS = async (
  courses: CourseInfo[],
  semesterConfig: SemesterConfig = defaultSemesterConfig,
  exportSettings: ExportSettings = defaultExportSettings,
  customEvents: CustomScheduleEvent[] = []
): Promise<void> => {
  if (!courses || courses.length === 0) throw new Error('沒有課程數據可導出');

  const icsContent = await generateICS(courses, semesterConfig, exportSettings, customEvents);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${exportSettings.calendarName}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
