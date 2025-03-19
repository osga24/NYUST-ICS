"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText,
  Calendar,
  ChevronRight,
  FileSpreadsheet,
  ArrowLeft,
  Bookmark,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Settings
} from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* 頁面標題 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          使用說明
        </h1>
        <p className="mt-2 text-gray-600">瞭解如何使用雲科大課表轉換工具</p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回首頁
        </Link>
      </motion.div>

      {/* 目錄導航 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 bg-blue-50 rounded-lg p-4"
      >
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <Bookmark className="mr-2 text-blue-500" />
          目錄
        </h2>
        <ul className="space-y-2">
          <li>
            <a href="#overview" className="flex items-center text-blue-600 hover:text-blue-800">
              <ChevronRight className="w-4 h-4" />
              <span>概述</span>
            </a>
          </li>
          <li>
            <a href="#requirements" className="flex items-center text-blue-600 hover:text-blue-800">
              <ChevronRight className="w-4 h-4" />
              <span>系統需求</span>
            </a>
          </li>
          <li>
            <a href="#how-to-use" className="flex items-center text-blue-600 hover:text-blue-800">
              <ChevronRight className="w-4 h-4" />
              <span>使用步驟</span>
            </a>
          </li>
          <li>
            <a href="#ics-export" className="flex items-center text-blue-600 hover:text-blue-800">
              <ChevronRight className="w-4 h-4" />
              <span>匯出 ICS 行事曆</span>
            </a>
          </li>
          <li>
            <a href="#excel-export" className="flex items-center text-blue-600 hover:text-blue-800">
              <ChevronRight className="w-4 h-4" />
              <span>匯出 Excel</span>
            </a>
          </li>
          <li>
            <a href="#faq" className="flex items-center text-blue-600 hover:text-blue-800">
              <ChevronRight className="w-4 h-4" />
              <span>常見問題</span>
            </a>
          </li>
        </ul>
      </motion.div>

      {/* 概述 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        id="overview"
        className="mb-10 bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <HelpCircle className="mr-2 text-blue-500" />
          概述
        </h2>
        <p className="mb-4 text-gray-700">
          雲科大課表轉換工具是一個幫助雲科大學生將 DOCX 格式的課表轉換為 ICS 行事曆文件或 Excel 表格的在線工具。通過這個工具，你可以：
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
          <li>上傳雲科大課表 DOCX 文件並自動識別課程資訊</li>
          <li>預覽識別後的課表內容</li>
          <li>設定學期起始日期和結束日期</li>
          <li>將課表匯出為 ICS 格式，便於導入到 Google 日曆、Outlook 或 Apple 日曆</li>
          <li>將課表匯出為 Excel 檔案，便於進一步編輯和處理</li>
        </ul>
        <p className="text-gray-700">
          本工具完全在瀏覽器中運行，您的課表資料不會上傳到任何伺服器，保障您的隱私安全。
        </p>
      </motion.section>

      {/* 系統需求 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        id="requirements"
        className="mb-10 bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <Settings className="mr-2 text-blue-500" />
          系統需求
        </h2>
        <p className="mb-4 text-gray-700">
          要使用本工具，您需要：
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
          <li>現代化瀏覽器（Chrome、Firefox、Safari、Edge 等最新版本）</li>
          <li>雲科大課表 DOCX 文件（從校務系統下載）</li>
          <li>網絡連接（僅用於加載網頁，處理文件過程不需要網絡）</li>
        </ul>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                注意：本工具專為雲科大課表格式設計，使用其他學校或格式的課表可能無法正確識別。
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 使用步驟 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        id="how-to-use"
        className="mb-10 bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <CheckCircle2 className="mr-2 text-blue-500" />
          使用步驟
        </h2>
        <ol className="list-decimal pl-6 mb-4 text-gray-700 space-y-4">
          <li>
            <p className="font-medium">準備課表 DOCX 文件</p>
            <p className="text-gray-600 mt-1">
              從雲科大校務系統下載您的課表 DOCX 文件。確保文件包含完整的課表信息。
            </p>
          </li>
          <li>
            <p className="font-medium">上傳文件</p>
            <p className="text-gray-600 mt-1">
              在首頁點擊「選擇 DOCX 文件」按鈕，或將文件直接拖放到上傳區域。
            </p>
          </li>
          <li>
            <p className="font-medium">檢查識別結果</p>
            <p className="text-gray-600 mt-1">
              上傳成功後，系統會自動識別課表內容並顯示預覽。您可以切換「課表預覽」和「課程列表」查看識別結果。
            </p>
          </li>
          <li>
            <p className="font-medium">設定學期時間（可選）</p>
            <p className="text-gray-600 mt-1">
              如需調整學期的開始和結束日期，可在學期設定區域進行調整。
            </p>
          </li>
          <li>
            <p className="font-medium">導出文件</p>
            <p className="text-gray-600 mt-1">
              根據需求點擊「匯出 ICS 行事曆」或「匯出 Excel」按鈕，將課表轉換為對應格式並下載。
            </p>
          </li>
        </ol>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                提示：如果您的課表包含連續的課程（如同一門課連續多節），系統會自動合併為一個時間段。
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 匯出 ICS 行事曆 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        id="ics-export"
        className="mb-10 bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <Calendar className="mr-2 text-blue-500" />
          匯出 ICS 行事曆
        </h2>
        <p className="mb-4 text-gray-700">
          ICS 是一種行事曆檔案格式，可導入到大多數行事曆應用中，包括 Google 日曆、Outlook 和 Apple 日曆。
        </p>
        <p className="mb-2 font-medium text-gray-800">匯出後如何使用：</p>
        <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
          <li>
            <span className="font-medium">Google 日曆：</span>
            <ul className="list-disc pl-6 mt-1 text-gray-600">
              <li>打開 Google 日曆</li>
              <li>點擊右上角的設置圖標，選擇「設置」</li>
              <li>選擇「導入與導出」</li>
              <li>選擇「導入」並上傳 ICS 文件</li>
            </ul>
          </li>
          <li>
            <span className="font-medium">Apple 日曆：</span>
            <ul className="list-disc pl-6 mt-1 text-gray-600">
              <li>打開日曆應用</li>
              <li>點擊「文件」 > 「導入」</li>
              <li>選擇並導入 ICS 文件</li>
            </ul>
          </li>
          <li>
            <span className="font-medium">Outlook：</span>
            <ul className="list-disc pl-6 mt-1 text-gray-600">
              <li>點擊「文件」 > 「打開和導出」 > 「導入/導出」</li>
              <li>選擇「導入 iCalendar」</li>
              <li>選擇並導入 ICS 文件</li>
            </ul>
          </li>
        </ul>
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                ICS 文件包含了課程名稱、時間、地點等資訊，並設置了重複規則，會在整個學期內按周重複。系統也會自動設置提醒，讓您不會錯過任何一堂課！
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 匯出 Excel */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        id="excel-export"
        className="mb-10 bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <FileSpreadsheet className="mr-2 text-blue-500" />
          匯出 Excel
        </h2>
        <p className="mb-4 text-gray-700">
          除了 ICS 行事曆，您還可以將課表匯出為 Excel 格式。Excel 格式便於您進一步編輯和處理課表資料。
        </p>
        <p className="mb-2 font-medium text-gray-800">Excel 文件包含：</p>
        <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
          <li>原始課表格式的工作表</li>
          <li>結構化的課程資訊工作表（包含課程名稱、時間、地點等）</li>
          <li>方便您自定義排序、篩選和分析的格式</li>
        </ul>
        <p className="text-gray-700">
          匯出的 Excel 文件可使用 Microsoft Excel、Google 試算表、LibreOffice Calc 等電子表格軟體打開。
        </p>
      </motion.section>

      {/* 常見問題 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        id="faq"
        className="mb-10 bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <HelpCircle className="mr-2 text-blue-500" />
          常見問題
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800">Q: 為什麼有些課程沒有被正確識別？</h3>
            <p className="mt-1 text-gray-700">
              A: 系統會嘗試識別標準格式的課表，但如果您的課表格式特殊或有手動修改，可能會導致識別錯誤。請確保上傳的是從校務系統下載的原始課表。
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800">Q: 我可以編輯已識別的課程資訊嗎？</h3>
            <p className="mt-1 text-gray-700">
              A: 目前系統不支持直接編輯識別後的課程資訊。如需編輯，建議先匯出為 Excel，在 Excel 中編輯後再手動添加到您的行事曆中。
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800">Q: 如何設置學期的開始和結束日期？</h3>
            <p className="mt-1 text-gray-700">
              A: 在課表識別成功後，頁面會顯示學期設置區域，您可以在那裡調整學期的開始日期和結束日期。
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800">Q: 導出的 ICS 文件會包含假期或特殊日期嗎？</h3>
            <p className="mt-1 text-gray-700">
              A: 目前系統僅根據課表生成課程行事曆，不包含假期或特殊日期。您需要手動在行事曆中添加這些信息。
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800">Q: 我的資料會被上傳到伺服器嗎？</h3>
            <p className="mt-1 text-gray-700">
              A: 不會。本工具完全在您的瀏覽器中運行，所有文件處理都在您的本地設備上進行，不會將您的資料上傳到任何伺服器。
            </p>
          </div>
        </div>
      </motion.section>

      {/* 返回首頁 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center mb-8"
      >
        <Link
          href="/"
          className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          返回課表轉換工具
        </Link>
      </motion.div>
    </div>
  );
}
