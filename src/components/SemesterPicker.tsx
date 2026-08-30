"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, Check, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { SemesterConfigJSON } from '../utils/types';
import { yuntechTheme } from '../styles/theme';

interface SemesterPickerProps {
  config: SemesterConfigJSON | null;
  loading: boolean;
  error: string | null;
}

const SemesterPicker: React.FC<SemesterPickerProps> = ({ config, loading, error }) => {
  const [currentSemester, setCurrentSemester] = useState<string>("");

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    if (month >= 2 && month <= 6) {
      setCurrentSemester(`${year - 1912}學年度 下學期`);
    } else if (month >= 9 || month === 1) {
      const academicYear = month >= 9 ? year : year - 1;
      setCurrentSemester(`${academicYear - 1911}學年度 上學期`);
    } else if (month >= 7 && month <= 8) {
      setCurrentSemester(`${year}學年度 暑假期間`);
    }
  }, []);

  const cardStyle = {
    width: '100%',
    backgroundColor: yuntechTheme.white,
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    border: `1px solid ${yuntechTheme.gray[200]}`
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 0' }}>
          <div style={{
            width: '1.5rem', height: '1.5rem', borderRadius: '50%',
            borderTop: `2px solid ${yuntechTheme.primary}`, borderRight: '2px solid transparent',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ marginLeft: '0.75rem', color: yuntechTheme.gray[700] }}>載入學期資訊中...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={cardStyle}>
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '1rem', backgroundColor: '#FEF2F2', borderRadius: '0.5rem', borderLeft: '4px solid #DC2626'
        }}>
          <AlertTriangle size={18} style={{ color: '#DC2626' }} />
          <p style={{ color: '#B91C1C', marginLeft: '0.75rem' }}>{error}</p>
        </div>
      </motion.div>
    );
  }

  if (!config) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={cardStyle}>
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '1rem', backgroundColor: yuntechTheme.ultraLight, borderRadius: '0.5rem',
          borderLeft: `4px solid ${yuntechTheme.primary}`
        }}>
          <Info size={18} style={{ color: yuntechTheme.primary }} />
          <p style={{ color: yuntechTheme.secondary, marginLeft: '0.75rem' }}>未找到學期配置資訊</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={cardStyle}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          marginBottom: '1.25rem', backgroundColor: '#FFF9DB', borderRadius: '0.5rem',
          padding: '1rem', display: 'flex', alignItems: 'flex-start', borderLeft: '4px solid #F59E0B'
        }}
      >
        <AlertTriangle size={24} style={{ color: '#F59E0B', marginRight: '0.75rem', flexShrink: 0, marginTop: '0.125rem' }} />
        <div>
          <p style={{ fontWeight: '600', color: '#92400E', marginTop: 0, marginBottom: '0.5rem' }}>
            使用前請先確認：以下顯示的是否為當前學期資訊
          </p>
          <p style={{ fontSize: '0.875rem', color: '#B45309', margin: 0 }}>
            匯出的行事曆將根據這些日期資訊生成，請確保學期起訖日期正確，避免匯出錯誤的課表時間。
          </p>
        </div>
      </motion.div>

      <div style={{
        display: 'flex', alignItems: 'center', marginBottom: '1.25rem',
        borderBottom: `1px solid ${yuntechTheme.gray[200]}`, paddingBottom: '1rem'
      }}>
        <Calendar size={22} style={{ color: yuntechTheme.primary, marginRight: '0.75rem' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: yuntechTheme.primary, margin: 0 }}>學期資訊</h2>
        <div style={{
          marginLeft: 'auto', padding: '0.375rem 0.75rem', backgroundColor: yuntechTheme.ultraLight,
          borderRadius: '9999px', display: 'flex', alignItems: 'center'
        }}>
          <Clock size={16} style={{ color: yuntechTheme.primary, marginRight: '0.375rem' }} />
          <span style={{ fontWeight: '500', fontSize: '0.875rem', color: yuntechTheme.secondary }}>{currentSemester}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <SemesterDateCard
          title="此學期範圍"
          start={config.spring.start}
          end={config.spring.end}
          active
        />
        {config.fall && (
          <SemesterDateCard
            title="下學期範圍"
            start={config.fall.start}
            end={config.fall.end}
            active={false}
          />
        )}
      </div>

      {config.holidays && config.holidays.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{
            fontWeight: '600', marginBottom: '1rem', fontSize: '1rem',
            color: yuntechTheme.secondary, display: 'flex', alignItems: 'center'
          }}>
            <Check size={16} style={{ color: '#10B981', marginRight: '0.5rem' }} />
            自動排除日期
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {config.holidays.map((holiday, index) => (
              <div key={index} style={{
                fontSize: '0.875rem', backgroundColor: yuntechTheme.white, padding: '0.75rem',
                borderRadius: '0.5rem', border: `1px solid ${yuntechTheme.gray[200]}`,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'transform 0.2s, box-shadow 0.2s'
              }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}
              >
                <div style={{
                  fontWeight: '600', color: yuntechTheme.primary, marginBottom: '0.25rem',
                  borderBottom: `1px dashed ${yuntechTheme.gray[200]}`, paddingBottom: '0.25rem'
                }}>
                  {holiday.name}
                </div>
                <div style={{ color: yuntechTheme.gray[700], fontSize: '0.75rem' }}>
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

interface SemesterDateCardProps {
  title: string;
  start: string;
  end: string;
  active: boolean;
}

const SemesterDateCard: React.FC<SemesterDateCardProps> = ({ title, start, end, active }) => (
  <div style={{
    backgroundColor: active ? yuntechTheme.ultraLight : '#F8FAFC',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    ...(active
      ? { borderLeft: `4px solid ${yuntechTheme.primary}` }
      : { border: `1px solid ${yuntechTheme.gray[200]}` })
  }}>
    <h3 style={{
      fontWeight: '600', marginBottom: '1rem', fontSize: '1rem',
      color: active ? yuntechTheme.secondary : yuntechTheme.gray[700],
      display: 'flex', alignItems: 'center'
    }}>
      {active
        ? <AlertTriangle size={16} style={{ color: '#F59E0B', marginRight: '0.5rem' }} />
        : <Info size={16} style={{ color: '#3B82F6', marginRight: '0.5rem' }} />
      }
      {title}
    </h3>
    <div style={{ backgroundColor: yuntechTheme.white, borderRadius: '0.5rem', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
      <div style={{
        display: 'flex', alignItems: 'center', marginBottom: '0.75rem',
        borderBottom: `1px solid ${yuntechTheme.gray[100]}`, paddingBottom: '0.75rem'
      }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', marginRight: '0.75rem' }} />
        <span style={{ fontSize: '0.875rem', color: yuntechTheme.gray[700], fontWeight: '500' }}>學期開始日期</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.875rem', fontWeight: active ? '600' : '500', color: active ? yuntechTheme.primary : yuntechTheme.gray[800] }}>
          {start}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444', marginRight: '0.75rem' }} />
        <span style={{ fontSize: '0.875rem', color: yuntechTheme.gray[700], fontWeight: '500' }}>結束日期</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.875rem', fontWeight: active ? '600' : '500', color: active ? yuntechTheme.primary : yuntechTheme.gray[800] }}>
          {end}
        </span>
      </div>
    </div>
  </div>
);

export default SemesterPicker;
