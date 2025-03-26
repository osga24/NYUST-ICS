// src/utils/types.ts

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
