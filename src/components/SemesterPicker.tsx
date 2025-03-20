"use client";

import React, { useState, useEffect } from 'react';
import { SemesterConfig } from '../utils/types';
import { defaultSemesterConfig } from '../utils/courseProcessor';
import { Calendar, Clock, AlertTriangle, Check, Info } from 'lucide-react';
import { motion } from 'framer-motion';

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
}

const SemesterPicker: React.FC<SemesterPickerProps> = ({ initialConfig = defaultSemesterConfig }) => {
  const [currentSemester, setCurrentSemester] = useState<string>("");
  const [jsonConfig, setJsonConfig] = useState<SimplifiedSemesterConfigJSON | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const yuntechTheme = {
    primary: '#009393',
    secondary: '#007575',
    light: '#4FC3C3',
    ultraLight: '#E6F7F7',
    white: '#ffffff',
    gray: {
      50: '#f8f9fa',
      100: '#f0f1f3',
      200: '#e9ecef',
      300: '#dee2e6',
      400: '#ced4da',
      500: '#adb5bd',
      600: '#6c757d',
      700: '#495057',
      800: '#343a40',
      900: '#212529',
    }
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

    // 根據學期時間判斷
    if (currentMonth >= 2 && currentMonth <= 6) {
      // 2月-6月
      setCurrentSemester(`${currentYear - 1912}學年度 下學期`);
    } else if ((currentMonth >= 9 && currentMonth <= 12) || currentMonth === 1) {
      // 9月-1月
      const academicYear = currentMonth >= 9 ? currentYear : currentYear - 1;
      setCurrentSemester(`${academicYear - 1911}學年度 上學期`);
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          backgroundColor: yuntechTheme.white,
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          border: `1px solid ${yuntechTheme.gray[200]}`
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 0' }}>
          <div style={{
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '50%',
            borderTop: `2px solid ${yuntechTheme.primary}`,
            borderRight: `2px solid transparent`,
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginLeft: '0.75rem', color: yuntechTheme.gray[600] }}>載入學期資訊中...</p>
        </div>
      </motion.div>
    );
  }

  // 如果加載出錯，顯示錯誤信息
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          backgroundColor: yuntechTheme.white,
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          border: `1px solid ${yuntechTheme.gray[200]}`
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: '#FEF2F2',
          borderRadius: '0.5rem',
          borderLeft: '4px solid #DC2626'
        }}>
          <AlertTriangle size={18} style={{ color: '#DC2626' }} />
          <p style={{ color: '#B91C1C', marginLeft: '0.75rem' }}>{error}</p>
        </div>
      </motion.div>
    );
  }

  // 如果沒有配置數據，顯示提示
  if (!jsonConfig) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          backgroundColor: yuntechTheme.white,
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          border: `1px solid ${yuntechTheme.gray[200]}`
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: yuntechTheme.ultraLight,
          borderRadius: '0.5rem',
          borderLeft: `4px solid ${yuntechTheme.primary}`
        }}>
          <Info size={18} style={{ color: yuntechTheme.primary }} />
          <p style={{ color: yuntechTheme.secondary, marginLeft: '0.75rem' }}>未找到學期配置資訊</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        width: '100%',
        backgroundColor: yuntechTheme.white,
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        border: `1px solid ${yuntechTheme.gray[200]}`
      }}
    >
      {/* 學期警告標注 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          marginBottom: '1.25rem',
          backgroundColor: '#FFF9DB',
          borderRadius: '0.5rem',
          padding: '1rem',
          display: 'flex',
          alignItems: 'flex-start',
          borderLeft: '4px solid #F59E0B'
        }}
      >
        <AlertTriangle size={24} style={{ color: '#F59E0B', marginRight: '0.75rem', flexShrink: 0, marginTop: '0.125rem' }} />
        <div>
          <p style={{
            fontWeight: '600',
            color: '#92400E',
            marginTop: 0,
            marginBottom: '0.5rem'
          }}>
            使用前請先確認：以下顯示的是否為當前學期資訊
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: '#B45309',
            margin: 0
          }}>
            匯出的行事曆將根據這些日期資訊生成，請確保學期起訖日期正確，避免匯出錯誤的課表時間。
          </p>
        </div>
      </motion.div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.25rem',
        borderBottom: `1px solid ${yuntechTheme.gray[200]}`,
        paddingBottom: '1rem'
      }}>
        <Calendar size={22} style={{ color: yuntechTheme.primary, marginRight: '0.75rem' }} />
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: yuntechTheme.primary,
          margin: 0
        }}>學期資訊</h2>
        <div style={{
          marginLeft: 'auto',
          padding: '0.375rem 0.75rem',
          backgroundColor: yuntechTheme.ultraLight,
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Clock size={16} style={{ color: yuntechTheme.primary, marginRight: '0.375rem' }} />
          <span style={{
            fontWeight: '500',
            fontSize: '0.875rem',
            color: yuntechTheme.secondary
          }}>{currentSemester}</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        <div style={{
          backgroundColor: yuntechTheme.ultraLight,
          borderRadius: '0.75rem',
          padding: '1.25rem',
          borderLeft: `4px solid ${yuntechTheme.primary}`
        }}>
          <h3 style={{
            fontWeight: '600',
            marginBottom: '1rem',
            fontSize: '1rem',
            color: yuntechTheme.secondary,
            display: 'flex',
            alignItems: 'center',
          }}>
            <AlertTriangle size={16} style={{ color: '#F59E0B', marginRight: '0.5rem' }} />
            此學期範圍
          </h3>
          <div style={{
            backgroundColor: yuntechTheme.white,
            borderRadius: '0.5rem',
            padding: '1rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.75rem',
              borderBottom: `1px solid ${yuntechTheme.gray[100]}`,
              paddingBottom: '0.75rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                marginRight: '0.75rem'
              }}></div>
              <span style={{ fontSize: '0.875rem', color: yuntechTheme.gray[700], fontWeight: '500' }}>
                學期開始日期
              </span>
              <span style={{
                marginLeft: 'auto',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: yuntechTheme.primary
              }}>
                {jsonConfig.spring.start}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                marginRight: '0.75rem'
              }}></div>
              <span style={{ fontSize: '0.875rem', color: yuntechTheme.gray[700], fontWeight: '500' }}>
                結束日期
              </span>
              <span style={{
                marginLeft: 'auto',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: yuntechTheme.primary
              }}>
                {jsonConfig.spring.end}
              </span>
            </div>
          </div>
        </div>

        {jsonConfig.fall && (
          <div style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            border: `1px solid ${yuntechTheme.gray[200]}`
          }}>
            <h3 style={{
              fontWeight: '600',
              marginBottom: '1rem',
              fontSize: '1rem',
              color: yuntechTheme.gray[700],
              display: 'flex',
              alignItems: 'center',
            }}>
              <Info size={16} style={{ color: '#3B82F6', marginRight: '0.5rem' }} />
              下學期範圍
            </h3>
            <div style={{
              backgroundColor: yuntechTheme.white,
              borderRadius: '0.5rem',
              padding: '1rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.75rem',
                borderBottom: `1px solid ${yuntechTheme.gray[100]}`,
                paddingBottom: '0.75rem'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  marginRight: '0.75rem'
                }}></div>
                <span style={{ fontSize: '0.875rem', color: yuntechTheme.gray[700], fontWeight: '500' }}>
                  開始日期
                </span>
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: yuntechTheme.gray[800]
                }}>
                  {jsonConfig.fall.start}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  marginRight: '0.75rem'
                }}></div>
                <span style={{ fontSize: '0.875rem', color: yuntechTheme.gray[700], fontWeight: '500' }}>
                  結束日期
                </span>
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: yuntechTheme.gray[800]
                }}>
                  {jsonConfig.fall.end}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {jsonConfig.holidays && jsonConfig.holidays.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{
            fontWeight: '600',
            marginBottom: '1rem',
            fontSize: '1rem',
            color: yuntechTheme.secondary,
            display: 'flex',
            alignItems: 'center',
          }}>
            <Check size={16} style={{ color: '#10B981', marginRight: '0.5rem' }} />
            自動排除日期
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '0.75rem'
          }}>
            {jsonConfig.holidays.map((holiday, index) => (
              <div key={index} style={{
                fontSize: '0.875rem',
                backgroundColor: yuntechTheme.white,
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: `1px solid ${yuntechTheme.gray[200]}`,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              }}
              >
                <div style={{
                  fontWeight: '600',
                  color: yuntechTheme.primary,
                  marginBottom: '0.25rem',
                  borderBottom: `1px dashed ${yuntechTheme.gray[200]}`,
                  paddingBottom: '0.25rem'
                }}>
                  {holiday.name}
                </div>
                <div style={{
                  color: yuntechTheme.gray[700],
                  fontSize: '0.75rem'
                }}>
                  {holiday.date || (holiday.range && `${holiday.range.start} ~ ${holiday.range.end}`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SemesterPicker;
