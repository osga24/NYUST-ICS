"use client";

import { ParsedTableData } from './types';
import { processScheduleData, convertToStructuredData } from './courseProcessor';

export const parseDocxFile = async (file: File): Promise<ParsedTableData> => {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });

    const parser = new DOMParser();
    const doc = parser.parseFromString(result.value, 'text/html');
    const tables = doc.querySelectorAll('table');

    if (tables.length === 0) {
      return { tableData: [], error: '沒有找到表格，請確認文件格式' };
    }

    // pick the table with the most cells
    let scheduleTable = tables[tables.length - 1];
    let maxCells = 0;
    tables.forEach(table => {
      const count = table.querySelectorAll('td, th').length;
      if (count > maxCells) {
        maxCells = count;
        scheduleTable = table;
      }
    });

    const extractedData = extractTableData(scheduleTable);
    const structuredData = convertToStructuredData(extractedData);

    return { tableData: extractedData, structuredData };
  } catch (error) {
    return {
      tableData: [],
      error: `解析文件時出錯: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

export const extractTableData = (table: HTMLTableElement): string[][] => {
  const rows = table.querySelectorAll('tr');
  const data: string[][] = [];

  rows.forEach(row => {
    const rowData: string[] = [];
    row.querySelectorAll('td, th').forEach(cell => {
      const cellText = (cell.textContent?.trim() || '').replace(/\s+/g, ' ');
      const colspan = parseInt(cell.getAttribute('colspan') || '1', 10);
      for (let i = 0; i < colspan; i++) {
        rowData.push(cellText);
      }
    });

    if (rowData.some(cell => cell.trim() !== '')) {
      data.push(rowData);
    }
  });

  return processScheduleData(data);
};
