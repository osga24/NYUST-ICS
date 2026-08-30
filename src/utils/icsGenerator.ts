// src/utils/icsGenerator.ts
import { CourseInfo, SemesterConfig, DateRange } from './types';
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

const isNationalHoliday = (date: Date, holidays: HolidayList): boolean => {
  const dateString =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');
  const h = holidays.find(d => d.date === dateString);
  return !!(h?.isHoliday && h?.description);
};

const isSchoolHoliday = (date: Date, schoolHolidays: string[]): boolean => {
  const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return schoolHolidays.includes(dateString);
};

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

export const generateICS = async (
  courses: CourseInfo[],
  semesterConfig: SemesterConfig = defaultSemesterConfig
): Promise<string> => {
  const now = new Date();
  const currentYear = now.getFullYear();

  // fetch both current and next year to cover fall semester spanning Jan of next year
  const [currentYearHolidays, nextYearHolidays] = await Promise.allSettled([
    fetchHolidays(currentYear),
    fetchHolidays(currentYear + 1),
  ]);
  const holidays = [
    ...(currentYearHolidays.status === 'fulfilled' ? currentYearHolidays.value : []),
    ...(nextYearHolidays.status === 'fulfilled' ? nextYearHolidays.value : []),
  ];

  const exportTimestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const exportMs = now.getTime();

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//YunTech//Course Calendar//TW',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:雲科大課表',
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

  for (let courseIndex = 0; courseIndex < courses.length; courseIndex++) {
    const course = courses[courseIndex];
    const timeRange = parseTimeSlot(course.timeSlot);
    if (!timeRange) continue;

    const dayNumber = getDayNumber(course.day);
    if (dayNumber < 0) continue;

    const schoolHolidays = semesterConfig.schoolHolidays ?? [];
    const allDates = [
      ...getClassDatesInRange(semesterConfig.spring, dayNumber, holidays, schoolHolidays),
      ...getClassDatesInRange(semesterConfig.fall, dayNumber, holidays, schoolHolidays),
    ].sort((a, b) => a.getTime() - b.getTime());

    const location = course.location.trim();
    const summary = location ? `[${location}] ${course.event || '課程'}` : (course.event || '課程');
    const description = location
      ? `雲科大課表 - ${course.event}\n地點: ${location}`
      : `雲科大課表 - ${course.event}`;

    allDates.forEach((date, dateIndex) => {
      const uid = `course-${courseIndex}-${dateIndex}-${exportMs}@yuntech.edu.tw`;
      const dtstart = formatICSDate(date, timeRange.start);
      const dtend = formatICSDate(date, timeRange.end);

      icsContent += '\r\n' + [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTART;TZID=Asia/Taipei:${dtstart}`,
        `DTEND;TZID=Asia/Taipei:${dtend}`,
        `SUMMARY:${summary}`,
        `LOCATION:${location || '未指定地點'}`,
        'TRANSP:OPAQUE',
        `DESCRIPTION:${description}`,
        'COLOR:black',
        'X-APPLE-CALENDAR-COLOR:#000000',
        'X-MICROSOFT-CDO-BUSYSTATUS:BUSY',
        'X-MICROSOFT-CDO-IMPORTANCE:1',
        `CREATED:${exportTimestamp}`,
        'END:VEVENT',
      ].join('\r\n');
    });
  }

  icsContent += '\r\nEND:VCALENDAR';
  return icsContent;
};

export const downloadICS = async (
  courses: CourseInfo[],
  semesterConfig: SemesterConfig = defaultSemesterConfig
): Promise<void> => {
  if (!courses || courses.length === 0) throw new Error('沒有課程數據可導出');

  const icsContent = await generateICS(courses, semesterConfig);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'yuntech_courses.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
