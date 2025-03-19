// src/utils/types.ts

export interface CourseInfo {
  event: string;       // 課程名稱
  day: string;         // 星期幾
  timeSlot: string;    // 時間槽
  location: string;    // 上課地點
}

export interface TimeRange {
  start: string;       // 開始時間 (HH:MM)
  end: string;         // 結束時間 (HH:MM)
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface SemesterConfig {
  fall: DateRange;     // 學期日期範圍
}

// 簡化的 JSON 配置格式 (僅用於類型檢查)
export interface SimplifiedSemesterConfigJSON {
  spring: {
    start: string;
    end: string;
  };
  fall?: {
    start: string;
    end: string;
  };
}
