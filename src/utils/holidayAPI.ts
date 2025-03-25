interface Holiday {
  name: string;
  date: string;
}

interface DayData {
  date: string;
  week: string;
  isHoliday: boolean;
  description: string;
}

/**
 * fetch holidays from government open data platform
 * @param year search year
 * @returns include holiday name and date array
 */
export const fetchHolidays = async (year: number): Promise<Holiday[]> => {
  try {
    // use government open data platform API
    const response = await fetch(
      `https://cdn.jsdelivr.net/gh/ruyut/TaiwanCalendar/data/${year}.json`
    );
    
    if (!response.ok) {
      throw new Error('無法獲取國定假日資料');
    }

    const data: DayData[] = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }

    // Filter out only national holidays with descriptions (excluding regular weekends)
    return data
      .filter(day => day.isHoliday && day.description.trim() !== '')
      .map(day => ({
        name: day.description,
        date: day.date
      }));
  } catch (error) {
    console.error('獲取國定假日時發生錯誤:', error);
    return [];
  }
};

/**
 * check if the date is a holiday
 * @param date date to check
 * @param holidays holidays list
 * @returns holiday name if it is a holiday, otherwise return null
 */
export const isHoliday = (date: Date, holidays: Holiday[]): string | null => {
  // convert date to YYYYMMDD format
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}${month}${day}`;
  
  const holiday = holidays.find(h => h.date === dateString);
  return holiday ? holiday.name : null;
}; 