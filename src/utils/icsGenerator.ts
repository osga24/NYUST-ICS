// src/utils/icsGenerator.ts
import { CourseInfo, SemesterConfig } from './types';
import { parseTimeSlot, getDayNumber, defaultSemesterConfig} from './courseProcessor';

/**
 * 生成 ICS 文件內容
 */
export const generateICS = (courses: CourseInfo[], semesterConfig: SemesterConfig = defaultSemesterConfig): string => {
  // ICS 文件的基本頭部
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
    'END:VTIMEZONE'
  ].join('\r\n');

  // 為每個課程創建事件
  courses.forEach((course, index) => {
    // 解析時間槽
    const timeRange = parseTimeSlot(course.timeSlot);
    if (!timeRange) {
      console.warn(`無法解析時間槽: ${course.timeSlot}`);
      return;
    }

    // 獲取星期幾的數字
    const dayNumber = getDayNumber(course.day);
    if (dayNumber < 0) {
      console.warn(`無法解析星期: ${course.day}`);
      return;
    }

    // 格式化日期和時間 (YYYYMMDDTHHMMSS)
    const formatDate = (date: Date, time: string): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const [hours, minutes] = time.split(':');
      return `${year}${month}${day}T${hours.padStart(2, '0')}${minutes.padStart(2, '0')}00`;
    };

    // 計算上學期中符合條件的上課日期
    const springDates: Date[] = [];
    if (semesterConfig.spring.start && semesterConfig.spring.end) {
      // 從學期開始循環到學期結束
      const currentDate = new Date(semesterConfig.spring.start);
      currentDate.setHours(0, 0, 0, 0); // 重置時間部分以確保正確比較

      const endDate = new Date(semesterConfig.spring.end);
      endDate.setHours(23, 59, 59, 999); // 設置為當天結束以確保包含結束日期

      while (currentDate <= endDate) {
        // 檢查是否是指定星期幾
        if (currentDate.getDay() === dayNumber) {
          // 添加上課日期
          springDates.push(new Date(currentDate));
        }
        // 增加一天
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // 計算下學期中符合條件的上課日期
    const fallDates: Date[] = [];
    if (semesterConfig.fall.start && semesterConfig.fall.end) {
      // 從學期開始循環到學期結束
      const currentDate = new Date(semesterConfig.fall.start);
      currentDate.setHours(0, 0, 0, 0); // 重置時間部分以確保正確比較

      const endDate = new Date(semesterConfig.fall.end);
      endDate.setHours(23, 59, 59, 999); // 設置為當天結束以確保包含結束日期

      while (currentDate <= endDate) {
        // 檢查是否是指定星期幾
        if (currentDate.getDay() === dayNumber) {
          // 添加上課日期
          fallDates.push(new Date(currentDate));
        }
        // 增加一天
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // 合併所有上課日期
    const allDates = [...springDates, ...fallDates].sort((a, b) => a.getTime() - b.getTime());

    // 為每個上課日期創建單獨的事件（不使用重複規則）
    allDates.forEach((date, dateIndex) => {
      // 準備地點信息
      const location = course.location.trim();

      // 處理課程標題 - 包含地點信息
      let summary = course.event || '課程';
      if (location) {
        // 在課程標題中添加地點信息
        summary = `[${location}] ${summary}`;
      }

      // 準備詳細描述，加入地點信息
      let description = `雲科大課表 - ${course.event}`;
      if (location) {
        description += `\n地點: ${location}`;
      }

      // 生成唯一ID
      const uid = `course-${index}-${dateIndex}-${new Date().getTime()}@yuntech.edu.tw`;

      // 當日的課程開始和結束時間
      const dtstart = formatDate(date, timeRange.start);
      const dtend = formatDate(date, timeRange.end);

      // 添加事件到ICS內容，設置黑色作為事件顏色
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
        `CREATED:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        'END:VEVENT'
      ].join('\r\n');
    });
  });

  // 添加ICS尾部
  icsContent += '\r\nEND:VCALENDAR';

  return icsContent;
};

/**
 * 下載ICS文件
 */
export const downloadICS = async (courses: CourseInfo[], semesterConfig: SemesterConfig = defaultSemesterConfig): Promise<void> => {
  if (!courses || courses.length === 0) {
    throw new Error('沒有課程數據可導出');
  }

  // 生成ICS內容
  const icsContent = generateICS(courses, semesterConfig);

  // 創建下載
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  // 創建下載鏈接並觸發下載
  const link = document.createElement('a');
  link.href = url;
  link.download = 'yuntech_courses.ics';
  document.body.appendChild(link);
  link.click();

  // 清理
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
