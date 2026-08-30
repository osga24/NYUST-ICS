"use client";

import React from 'react';
import { CourseInfo } from '../utils/types';

interface CourseListProps {
  courses: CourseInfo[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  if (!courses || courses.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">課程清單（共 {courses.length} 堂課）</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">時間</th>
              <th className="border border-gray-300 px-4 py-2 text-left">星期</th>
              <th className="border border-gray-300 px-4 py-2 text-left">地點</th>
              <th className="border border-gray-300 px-4 py-2 text-left">行程</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="border border-gray-300 px-4 py-2">{course.timeSlot}</td>
                <td className="border border-gray-300 px-4 py-2">{course.day}</td>
                <td className="border border-gray-300 px-4 py-2">{course.location}</td>
                <td className="border border-gray-300 px-4 py-2">{course.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseList;
