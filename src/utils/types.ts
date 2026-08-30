// src/utils/types.ts

export interface SchoolHoliday {
  date: string; // YYYY-MM-DD
  name: string;
}

export interface SemesterConfigJSON {
  spring: {
    start: string;
    end: string;
  };
  fall?: {
    start: string;
    end: string;
  };
  holidays?: Array<{
    name: string;
    date?: string;
    range?: {
      start: string;
      end: string;
    };
  }>;
  schoolHolidays?: SchoolHoliday[];
}

export interface ExportSettings {
  calendarName: string;
  eventColor: string;
  includeLocationInTitle: boolean;
  alarmMinutes: number | null;
}

export const defaultExportSettings: ExportSettings = {
  calendarName: '雲科大課表',
  eventColor: '#009393',
  includeLocationInTitle: true,
  alarmMinutes: null,
};

export interface CustomScheduleEvent {
  id: string;
  title: string;
  location: string;
  days: number[]; // 0=Sun 1=Mon ... 6=Sat，對應 Date.getDay()
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  repeat: 'weekly' | 'biweekly';
}

export interface TimeRange {
  start: string;
  end: string;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface SemesterConfig {
  spring: DateRange;
  fall: DateRange;
  holidays?: Holiday[];
  schoolHolidays?: string[]; // YYYY-MM-DD dates for filtering
}

export interface CourseInfo {
  timeSlot: string;
  day: string;
  location: string;
  event: string;
}

export interface ParsedTableData {
  tableData: string[][];
  structuredData?: CourseInfo[];
  error?: string;
}

export interface Holiday {
  name: string;
  date?: string;
  range?: {
    start: string;
    end: string;
  };
  isHoliday?: boolean;
  description?: string;
}
