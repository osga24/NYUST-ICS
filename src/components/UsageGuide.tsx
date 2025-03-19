"use client";

import React from 'react';

/**
 * 使用說明組件
 */
const UsageGuide: React.FC = () => {
  return (
    <>
      <div className="w-full bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-lg font-semibold mb-2">使用說明</h2>
        <ol className="list-decimal pl-5 space-y-2 text-black">
          <li>點擊「選擇文件」按鈕上傳包含課表的 DOCX 文件</li>
          <li>系統會自動識別文件中的課表並顯示課程清單和預覽</li>
          <li>點擊「匯出為 ICS 行事曆」按鈕下載可匯入 Google 日曆、Apple 日曆或其他支援 iCalendar 格式的行事曆</li>
          <li>也可以點擊「匯出為 Excel」按鈕下載 Excel 格式的課表</li>
          <li>導入 ICS 檔案到行事曆後，會自動為整學期的每堂課創建重複事件</li>
        </ol>
      </div>

      <div className="w-full bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-lg font-semibold mb-2">注意事項</h2>
        <ul className="list-disc pl-5 space-y-2 text-black">
          <li>本工具僅支援雲林科技大學課表格式，其他學校的課表可能無法正確解析</li>
          <li>預設學期時間設定為 2025 年 2 月 17 日至 6 月 22 日，參考雲科大校曆</li>
          <li>行事曆事件僅會在學期期間顯示，自動排除國定假日和其他休息日</li>
          <li>系統會自動合併連續的相同課程，例如連續三節的「資料結構」會被合併為一個行程</li>
          <li>所有行事曆事件都會設置為黑色，便於在日曆應用中清晰顯示</li>
          <li>事件標題會包含地點資訊，例如：[EC501] 資料結構與演算法</li>
          <li>如果匯出的 ICS 文件無法正確導入，請檢查課表中的時間格式是否正確</li>
          <li>本工具僅在本地運行，不會上傳您的課表到任何伺服器</li>
        </ul>
      </div>

      <footer className="mt-8 text-center text-gray-500">
        <p>© 2025 雲林科技大學課表轉換工具 | 僅供學習使用</p>
      </footer>
    </>
  );
};

export default UsageGuide;
