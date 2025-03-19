"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseDocxFile } from '../utils/docxParser';
import { downloadICS } from '../utils/icsGenerator';
import { generateExcel } from '../utils/excelGenerator';
import { CourseInfo, SemesterConfig } from '../utils/types';
import { mergeContinuousCourses, defaultSemesterConfig } from '../utils/courseProcessor';
import CourseTable from '../components/CourseTable';
import CourseList from '../components/CourseList';
import SemesterPicker from '../components/SemesterPicker';
import { FileText, Calendar, FileSpreadsheet, Upload, Info, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tableData, setTableData] = useState<string[][] | null>(null);
  const [courses, setCourses] = useState<CourseInfo[] | null>(null);
  const [semesterConfig] = useState<SemesterConfig>(defaultSemesterConfig);
  const [activeTab, setActiveTab] = useState<'table' | 'list'>('table');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // 清除成功消息的計時器
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  // 處理拖放功能
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer?.files.length) {
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.docx')) {
          processFile(file);
        } else {
          setError('請選擇有效的 DOCX 文件');
        }
      }
    };

    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);

    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, []);

  /**
   * 處理文件上傳
   */
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file || !file.name.endsWith('.docx')) {
      setError('請選擇有效的 DOCX 文件');
      return;
    }

    processFile(file);
  };

  /**
   * 處理文件
   */
  const processFile = async (file: File): Promise<void> => {
    try {
      setIsProcessing(true);
      setError(null);

      // 解析 DOCX 文件
      const parsedData = await parseDocxFile(file);

      // 設置解析結果
      setTableData(parsedData.tableData);

      // 確保課程數據已經過合併處理
      const mergedCourses = mergeContinuousCourses(parsedData.structuredData);
      setCourses(mergedCourses);

      console.log("原始課程數量:", parsedData.structuredData.length);
      console.log("合併後課程數量:", mergedCourses.length);

      // 輸出範例時間段，檢查合併是否成功
      if (mergedCourses.length > 0) {
        console.log("合併後的課程時間範例:");
        mergedCourses.slice(0, 5).forEach(course => {
          console.log(`${course.day} ${course.timeSlot} - ${course.event} (${course.location})`);
        });
      }

      setSuccess('文件解析成功！');
      setIsProcessing(false);
    } catch (err) {
      console.error('處理文件時出錯:', err);
      setError(err instanceof Error ? err.message : '處理文件時發生錯誤');
      setIsProcessing(false);
    }
  };

  /**
   * 導出 ICS 文件
   */
  const handleExportICS = (): void => {
    if (!courses || courses.length === 0) {
      setError('沒有課程數據可導出');
      return;
    }

    try {
      // 確保導出前數據已合併，並傳入學期設定
      const mergedCourses = mergeContinuousCourses(courses);
      downloadICS(mergedCourses, semesterConfig);
      setSuccess('ICS 行事曆匯出成功！');
    } catch (err) {
      console.error('導出ICS時出錯:', err);
      setError(err instanceof Error ? err.message : '導出ICS失敗，請重試');
    }
  };

  /**
   * 導出 Excel 文件
   */
  const handleExportExcel = (): void => {
    if (!tableData || !courses) {
      setError('沒有課程數據可導出');
      return;
    }

    try {
      // 確保導出前數據已合併
      const mergedCourses = mergeContinuousCourses(courses);
      generateExcel(tableData, mergedCourses);
      setSuccess('Excel 匯出成功！');
    } catch (err) {
      console.error('導出Excel時出錯:', err);
      setError(err instanceof Error ? err.message : '導出Excel失敗，請重試');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          雲科大課表轉換工具
        </h1>
        <p className="mt-2 text-gray-600">輕鬆將 DOCX 課表轉換為 ICS 行事曆或 Excel 表格</p>
      </motion.div>

      {/* 上傳區域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div
          ref={dropAreaRef}
          className={`w-full bg-white rounded-xl shadow-md transition-all ${
            isDragging ? 'border-2 border-dashed border-blue-400 bg-blue-50' : 'border border-gray-200 hover:shadow-lg hover:border-blue-200'
          }`}
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FileText className="text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">上傳課表文件</h2>
            </div>

            <div className="text-center py-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <input
                  type="file"
                  accept=".docx"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  選擇 DOCX 文件
                </button>
              </motion.div>
              <p className="text-gray-500 text-sm mt-2">
                或將檔案拖放至此區域
              </p>
            </div>

            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-center mt-4"
                >
                  <div className="flex items-center text-blue-500">
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    處理中，請稍候...
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{success}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {courses && (
            <div className="px-6 pb-6">
              <div className="border-t border-gray-200 pt-5">
                <div className="flex flex-wrap gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleExportICS}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium px-4 py-2 rounded-lg flex items-center shadow-sm"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    匯出 ICS 行事曆
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleExportExcel}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center shadow-sm"
                  >
                    <FileSpreadsheet className="w-5 h-5 mr-2" />
                    匯出 Excel
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* 學期資訊 */}
      {courses && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <SemesterPicker initialConfig={semesterConfig} />
        </motion.div>
      )}

      {/* 課程資訊顯示區 */}
      {(tableData || courses) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-3 px-4 font-medium text-center transition-colors ${
                activeTab === 'table'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('table')}
            >
              課表預覽
            </button>
            <button
              className={`flex-1 py-3 px-4 font-medium text-center transition-colors ${
                activeTab === 'list'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('list')}
            >
              課程列表
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'table' && tableData && (
              <CourseTable tableData={tableData} />
            )}

            {activeTab === 'list' && courses && (
              <CourseList courses={courses} />
            )}
          </div>
        </motion.div>
      )}

      {/* 使用說明連結 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center mb-8"
      >
        <Link href="/guide" className="inline-flex items-center text-blue-600 hover:text-purple-600 font-medium transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-blue-50">
          <Info className="w-5 h-5 mr-1" />
          查看詳細使用說明
        </Link>
      </motion.div>
    </div>
  );
}
