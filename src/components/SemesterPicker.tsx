"use client";

import React, { useState, useEffect } from 'react';
import { SemesterConfig } from '../utils/types';
import { defaultSemesterConfig } from '../utils/courseProcessor';

// 為簡化的JSON配置定義接口
interface SimplifiedSemesterConfigJSON {
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
}

interface SemesterPickerProps {
  initialConfig?: SemesterConfig;
  onChange?: (config: SemesterConfig) => void;
}

const SemesterPicker: React.FC<SemesterPickerProps> = ({ initialConfig = defaultSemesterConfig }) => {
  const [currentSemester, setCurrentSemester] = useState<string>("");
  const [jsonConfig, setJsonConfig] = useState<SimplifiedSemesterConfigJSON | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 格式化日期為易讀格式，用於顯示
  const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  // 從 JSON 加載學期配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch('/config/semester-config.json');
        if (!response.ok) {
          setError('無法加載學期設定檔案');
          setLoading(false);
          return;
        }

        const config: SimplifiedSemesterConfigJSON = await response.json();
        setJsonConfig(config);
        console.log('學期配置已加載:', config);
      } catch (error) {
        console.error('加載學期設定時出錯:', error);
        setError('加載學期設定時出錯');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // 判斷目前是哪個學期
  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // getMonth() 從 0 開始

    // 根據雲科大學期時間判斷
    if (currentMonth >= 2 && currentMonth <= 6) {
      // 2月-6月
      setCurrentSemester(`${currentYear}學年度 第2學期`);
    } else if ((currentMonth >= 9 && currentMonth <= 12) || currentMonth === 1) {
      // 9月-1月
      const academicYear = currentMonth >= 9 ? currentYear : currentYear - 1;
      setCurrentSemester(`${academicYear}學年度 第1學期`);
    } else {
      // 暑假或寒假
      if (currentMonth >= 7 && currentMonth <= 8) {
        setCurrentSemester(`${currentYear}學年度 暑假期間`);
      } else {
        setCurrentSemester(`${currentYear-1}學年度 寒假期間`);
      }
    }
  }, []);

  // 如果JSON配置還未加載，顯示加載中
  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-center">
          <p>載入學期資訊中...</p>
        </div>
      </div>
    );
  }

  // 如果加載出錯，顯示錯誤信息
  if (error) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // 如果沒有配置數據，顯示提示
  if (!jsonConfig) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-center">
          <p>未找到學期配置資訊</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col mb-4">
        <h2 className="text-lg font-semibold">學期資訊</h2>
        <div className="mt-2 p-2 bg-blue-100 rounded-md inline-block">
          <span className="font-medium">{currentSemester}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-2">此學期範圍 🚨 請先確認是否為該學期範圍</h3>
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="flex flex-col">
              <span className="text-sm"><strong>開始日期：</strong>{jsonConfig.spring.start}</span>
              <span className="text-sm mt-1"><strong>結束日期：</strong>{jsonConfig.spring.end}</span>
            </div>
          </div>
        </div>

        {jsonConfig.fall && (
          <div>
            <h3 className="font-medium mb-2">下學期範圍</h3>
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex flex-col">
                <span className="text-sm"><strong>開始日期：</strong>{jsonConfig.fall.start}</span>
                <span className="text-sm mt-1"><strong>結束日期：</strong>{jsonConfig.fall.end}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {jsonConfig.holidays && jsonConfig.holidays.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">自動排除日期</h3>
          <div className="bg-gray-50 rounded-md p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {jsonConfig.holidays.map((holiday, index) => (
                <div key={index} className="text-sm bg-white p-2 rounded border border-gray-200">
                  <span className="font-medium">{holiday.name}：</span>
                  {holiday.date || (holiday.range && `${holiday.range.start} ~ ${holiday.range.end}`)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemesterPicker;
