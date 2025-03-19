// src/utils/excelGenerator.ts
import { utils, writeFile } from 'xlsx';
import { CourseInfo } from './types';

/**
 * 生成並下載Excel文件
 */
export const generateExcel = (tableData: string[][], courses: CourseInfo[]): void => {
  if (!tableData || !courses) {
    throw new Error('無效的課表數據');
  }

  try {
    // 創建標準版課程表
    const ws = utils.aoa_to_sheet(tableData);

    // 設置標準版的列寬
    const wscols = [
      { wch: 10 }, // 時間欄
      { wch: 30 }, // 星期一
      { wch: 30 }, // 星期二
      { wch: 30 }, // 星期三
      { wch: 30 }, // 星期四
      { wch: 30 }, // 星期五
      { wch: 30 }, // 星期六
      { wch: 30 }  // 星期日
    ];
    ws['!cols'] = wscols;

    // 為每個單元格設置自動換行
    const range = utils.decode_range(ws['!ref'] || 'A1:H20');
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = utils.encode_cell({ r: row, c: col });
        const cell = ws[cellAddress];
        if (cell && typeof cell === 'object') {
          if (!cell.s) cell.s = {};
          cell.s.alignment = { wrapText: true, vertical: 'top' };
        }
      }
    }

    // 創建一個新的工作簿
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, '課程表');

    // 創建第二個工作表 - 結構化數據
    const structuredData = [
      ['時間', '星期', '地點', '行程'] // 表頭
    ];

    // 添加課程數據
    courses.forEach(course => {
      structuredData.push([
        course.timeSlot,
        course.day,
        course.location,
        course.event
      ]);
    });

    // 創建結構化數據工作表
    const wsStructured = utils.aoa_to_sheet(structuredData);

    // 設置結構化數據的列寬
    const wsStructuredCols = [
      { wch: 10 }, // 時間欄
      { wch: 8 },  // 星期欄
      { wch: 10 }, // 地點欄
      { wch: 40 }  // 行程欄
    ];
    wsStructured['!cols'] = wsStructuredCols;

    // 添加結構化數據工作表
    utils.book_append_sheet(wb, wsStructured, '課程詳細資料');

    // 寫入檔案並下載
    writeFile(wb, 'course_schedule.xlsx');
  } catch (err) {
    console.error('導出Excel時出錯:', err);
    throw new Error('導出Excel失敗，請重試');
  }
};
