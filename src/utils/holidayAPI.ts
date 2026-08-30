// src/utils/holidayAPI.ts
interface DayData {
  date: string;
  week: string;
  isHoliday: boolean;
  description: string;
}

export const fetchHolidays = async (year: number): Promise<DayData[]> => {
  const response = await fetch(
    `https://cdn.jsdelivr.net/gh/ruyut/TaiwanCalendar/data/${year}.json`
  );

  if (!response.ok) throw new Error('無法獲取國定假日資料');

  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('Invalid response format');

  return data;
};

export const isHoliday = (date: Date, holidays: DayData[]): string | null => {
  const dateString =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');
  const holiday = holidays.find(h => h.date === dateString);
  return holiday?.isHoliday && holiday?.description ? holiday.description : null;
};
