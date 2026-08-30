"use client";

import React from 'react';
import { CourseInfo } from '../utils/types';
import { yuntechTheme } from '../styles/theme';

interface CourseListProps {
  courses: CourseInfo[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  if (!courses || courses.length === 0) return null;

  const th: React.CSSProperties = {
    border: `1px solid ${yuntechTheme.gray[200]}`,
    padding: '0.5rem 0.75rem',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: '0.8125rem',
    color: yuntechTheme.gray[600],
    backgroundColor: yuntechTheme.gray[50],
    whiteSpace: 'nowrap',
  };
  const td: React.CSSProperties = {
    border: `1px solid ${yuntechTheme.gray[200]}`,
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    color: yuntechTheme.gray[700],
    verticalAlign: 'middle',
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <p style={{ fontSize: '0.875rem', color: yuntechTheme.gray[500], marginBottom: '0.75rem' }}>
        共 <strong style={{ color: yuntechTheme.secondary }}>{courses.length}</strong> 堂課
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr>
            <th style={th}>時間</th>
            <th style={th}>星期</th>
            <th style={th}>地點</th>
            <th style={th}>課程名稱</th>
            <th style={th}>班級</th>
            <th style={th}>教師</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? yuntechTheme.white : yuntechTheme.gray[50] }}>
              <td style={{ ...td, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{course.timeSlot}</td>
              <td style={{ ...td, whiteSpace: 'nowrap' }}>{course.day}</td>
              <td style={td}>{course.location || '—'}</td>
              <td style={{ ...td, fontWeight: 500, color: yuntechTheme.secondary }}>{course.courseName || course.event || '—'}</td>
              <td style={{ ...td, color: yuntechTheme.gray[500] }}>{course.className || '—'}</td>
              <td style={{ ...td, color: yuntechTheme.gray[500] }}>{course.teacher || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseList;
