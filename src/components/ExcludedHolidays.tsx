"use client";

import React, { useEffect, useState } from 'react';
import { SemesterConfig, SemesterConfigJSON } from '../utils/types';
import { fetchHolidays } from '../utils/holidayAPI';
import { yuntechTheme } from '../styles/theme';

interface DisplayHoliday {
  date: string; // YYYY-MM-DD
  name: string;
}

interface Props {
  semesterConfig: SemesterConfig | null;
  jsonConfig: SemesterConfigJSON | null;
}

const ExcludedHolidays: React.FC<Props> = ({ semesterConfig, jsonConfig }) => {
  const [govHolidays, setGovHolidays] = useState<DisplayHoliday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!semesterConfig) return;

    const fetchAll = async () => {
      const years = new Set<number>();
      [semesterConfig.spring, semesterConfig.fall].forEach(range => {
        if (range.start) years.add(range.start.getFullYear());
        if (range.end) years.add(range.end.getFullYear());
      });

      const allDates = [
        semesterConfig.spring.start, semesterConfig.spring.end,
        semesterConfig.fall.start, semesterConfig.fall.end,
      ].filter((d): d is Date => d !== null);

      if (allDates.length === 0) { setLoading(false); return; }

      const semStartStr = new Date(Math.min(...allDates.map(d => d.getTime()))).toISOString().slice(0, 10);
      const semEndStr   = new Date(Math.max(...allDates.map(d => d.getTime()))).toISOString().slice(0, 10);

      const allApiDays: Awaited<ReturnType<typeof fetchHolidays>> = [];
      for (const year of years) {
        try { allApiDays.push(...await fetchHolidays(year)); } catch { /* skip year on failure */ }
      }

      const filtered = allApiDays
        .filter(h => h.isHoliday && h.description)
        .map(h => ({
          date: `${h.date.slice(0,4)}-${h.date.slice(4,6)}-${h.date.slice(6,8)}`,
          name: h.description,
        }))
        .filter(h => h.date >= semStartStr && h.date <= semEndStr)
        .sort((a, b) => a.date.localeCompare(b.date));

      setGovHolidays(filtered);
      setLoading(false);
    };

    fetchAll();
  }, [semesterConfig]);

  const schoolHolidays: DisplayHoliday[] = (jsonConfig?.schoolHolidays ?? []).map(h => ({
    date: h.date,
    name: h.name,
  }));

  const total = govHolidays.length + schoolHolidays.length;

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: yuntechTheme.gray[500] }}>
        載入假日資料中...
      </div>
    );
  }

  if (total === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: yuntechTheme.gray[500] }}>
        學期內無排除假日
      </div>
    );
  }

  return (
    <div style={{ padding: '0.5rem' }}>
      <p style={{ fontSize: '0.875rem', color: yuntechTheme.gray[600], marginBottom: '1.25rem' }}>
        以下日期的課程已從 ICS 匯出中排除，共 <strong>{total}</strong> 天。
      </p>

      {govHolidays.length > 0 && (
        <Section title="政府假日" color="#3B82F6" count={govHolidays.length}>
          {govHolidays.map(h => <HolidayRow key={h.date} date={h.date} name={h.name} />)}
        </Section>
      )}

      {schoolHolidays.length > 0 && (
        <Section title="學校補假" color="#F59E0B" count={schoolHolidays.length}>
          {schoolHolidays.map(h => <HolidayRow key={h.date} date={h.date} name={h.name} />)}
        </Section>
      )}
    </div>
  );
};

const DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六'];

const HolidayRow: React.FC<{ date: string; name: string }> = ({ date, name }) => {
  const d = new Date(`${date}T00:00:00+08:00`);
  const dayName = DAY_NAMES[d.getDay()];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.5rem 0.75rem', borderRadius: '0.375rem',
      backgroundColor: yuntechTheme.gray[50],
      marginBottom: '0.375rem',
    }}>
      <span style={{
        fontFamily: 'monospace', fontSize: '0.875rem',
        color: yuntechTheme.gray[700], fontWeight: 500, whiteSpace: 'nowrap',
      }}>
        {date} <span style={{ color: yuntechTheme.gray[500] }}>(週{dayName})</span>
      </span>
      <span style={{ fontSize: '0.875rem', color: yuntechTheme.gray[600] }}>{name}</span>
    </div>
  );
};

const Section: React.FC<{
  title: string;
  color: string;
  count: number;
  children: React.ReactNode;
}> = ({ title, color, count, children }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color }} />
      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: yuntechTheme.gray[700] }}>
        {title}
      </span>
      <span style={{
        fontSize: '0.75rem', backgroundColor: `${color}22`, color,
        padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 600,
      }}>
        {count} 天
      </span>
    </div>
    {children}
  </div>
);

export default ExcludedHolidays;
