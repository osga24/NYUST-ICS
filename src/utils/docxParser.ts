"use client";

import { CourseInfo } from './types';
import { processScheduleData, convertToStructuredData, mergeContinuousCourses } from './courseProcessor';

// 在檔案內定義 ParsedTableData 介面
export interface ParsedTableData {
  tableData: string[][];
  structuredData?: CourseInfo[];
  error?: string;
}

/**
 * 從DOCX文件解析課程表數據
 */
export const parseDocxFile = async (file: File): Promise<ParsedTableData> => {
  try {
    // 動態導入 mammoth 以避免 SSR 問題
    const mammoth = await import('mammoth');

    // 讀取docx文件
		const arrayBuffer = await file.arrayBuffer();

		const result = await mammoth.convertToHtml({
			arrayBuffer
		});
		const htmlContent = result.value;

    console.log("Mammoth轉換結果長度:", htmlContent.length);

    // 創建臨時DOM元素解析HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // 查找文檔中的所有表格
    const tables = doc.querySelectorAll('table');

    if (tables.length === 0) {
      return {
        tableData: [],
        error: '沒有找到表格，請確認文件格式'
      };
    }

    console.log(`找到 ${tables.length} 個表格`);

    // 嘗試找到最可能是課表的表格
    let scheduleTable = tables[tables.length - 1]; // 預設使用最後一個表格
    let maxCells = 0;

    // 遍歷所有表格，找到包含最多單元格的表格
    tables.forEach((table, index) => {
      const cellCount = table.querySelectorAll('td, th').length;
      console.log(`表格 ${index + 1} 包含 ${cellCount} 個單元格`);
      if (cellCount > maxCells) {
        maxCells = cellCount;
        scheduleTable = table;
      }
    });

    // 處理表格數據
    const extractedData = extractTableData(scheduleTable);

    // 將表格數據轉換為結構化課程數據
    const rawStructuredData = convertToStructuredData(extractedData);

    // 確保課程數據經過合併處理
    const structuredData = mergeContinuousCourses(rawStructuredData);

    console.log(`原始課程數: ${rawStructuredData.length}, 合併後課程數: ${structuredData.length}`);

    return {
      tableData: extractedData,
      structuredData
    };
  } catch (error) {
    console.error('解析 DOCX 文件時出錯:', error);
    return {
      tableData: [],
      error: `解析文件時出錯: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * 從HTML表格中提取課程表數據
 */
export const extractTableData = (table: HTMLTableElement): string[][] => {
  const rows = table.querySelectorAll('tr');
  const data: string[][] = [];

  console.log(`處理表格，共 ${rows.length} 行`);

  // 處理每一行
  rows.forEach((row, rowIndex) => {
    const rowData: string[] = [];
    const cells = row.querySelectorAll('td, th');

    // 處理每個單元格
    cells.forEach((cell) => {
      // 清理文本內容
      let cellText = cell.textContent?.trim() || '';
      // 處理多行內容但保留重要的換行符
      cellText = cellText.replace(/\s+/g, ' ');

      // 檢查合併的單元格
      const colspan = cell.getAttribute('colspan');
      if (colspan && parseInt(colspan) > 1) {
        // 對合併的單元格添加多次內容
        for (let i = 0; i < parseInt(colspan); i++) {
          rowData.push(cellText);
        }
      } else {
        rowData.push(cellText);
      }
    });

    if (rowData.length > 0) {
      // 檢查是否包含有用的信息
      const hasContent = rowData.some(cell => cell.trim() !== '');
      if (hasContent) {
        data.push(rowData);
        console.log(`行 ${rowIndex+1}: ${rowData.join(' | ')}`);
      }
    }
  });

  // 處理數據來識別時間段、星期和課程
  return processScheduleData(data);
};
