// src/utils/courseProcessor.ts
import { CourseInfo, TimeRange, SemesterConfig } from './types';

/**
 * 解析時間區間
 */
export const parseTimeSlot = (timeSlot: string): TimeRange | null => {
	// 嘗試格式 "X. HH:MM | HH:MM"
	const timeMatch = timeSlot.match(/[A-Z]\.\s*(\d{1,2}:\d{2})\s*\|\s*(\d{1,2}:\d{2})/);
	if (timeMatch) {
		return {
			start: timeMatch[1],
			end: timeMatch[2]
		};
	}
	return null;
};

/**
 * 將星期幾轉換為ISO標準日期中的數字
 */
export const getDayNumber = (day: string): number => {
	const days: { [key: string]: number } = {
		'星期一': 1,
		'星期二': 2,
		'星期三': 3,
		'星期四': 4,
		'星期五': 5,
		'星期六': 6,
		'星期日': 0,
		'一': 1,
		'二': 2,
		'三': 3,
		'四': 4,
		'五': 5,
		'六': 6,
		'日': 0
	};
	return days[day] !== undefined ? days[day] : -1;
};

/**
 * 預設學期時間配置
 */
export const defaultSemesterConfig: SemesterConfig = {
	spring: {
		start: new Date('2026-09-07'),
		end: new Date('2027-01-31')
	},
	fall: {
		start: null,
		end: null
	}
};

/**
 * 判斷日期是否在學期期間
 */
export const isSchoolDay = (date: Date, semesterConfig: SemesterConfig): boolean => {
	// 檢查是否在上學期期間
	if (semesterConfig.spring.start && semesterConfig.spring.end) {
		if (date >= semesterConfig.spring.start && date <= semesterConfig.spring.end) {
			return true;
		}
	}

	// 檢查是否在下學期期間
	if (semesterConfig.fall.start && semesterConfig.fall.end) {
		if (date >= semesterConfig.fall.start && date <= semesterConfig.fall.end) {
			return true;
		}
	}

	return false; // 如果不在學期內，則不是上課日
};

/**
 * 將日期格式化為 YYYY-MM-DD 字符串
 */
export const formatDateString = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

/**
 * 將表格數據處理為標準課表格式
 */
export const processScheduleData = (rawData: string[][]): string[][] => {
	// 嘗試找出包含"星期"的行作為表頭行
	let dataStartIndex = rawData.findIndex(row =>
		row.some(cell => cell.includes('星期'))
	);

	// 如果找不到包含"星期"的行，嘗試查找其他可能的表頭標記
	if (dataStartIndex === -1) {
		// 嘗試查找包含時間段的行（如"A."、"B."或具體時間）
		dataStartIndex = rawData.findIndex(row =>
			row.some(cell => /^[A-Z]\.\s*\d{1,2}:\d{2}/.test(cell)) ||
			row.some(cell => /^\d{1,2}:\d{2}/.test(cell))
		);

		// 如果還是找不到，假設第一行就是表頭
		if (dataStartIndex === -1 && rawData.length > 0) {
			dataStartIndex = 0;
		}
	}

	if (dataStartIndex === -1 || rawData.length <= dataStartIndex) {
		throw new Error('無法識別課程表結構，請確認文件格式正確');
	}

	// 提取表頭行（星期幾）
	const headerRow = rawData[dataStartIndex];

	// 處理時間段和課程數據
	const processedData: string[][] = [];

	// 添加表頭行 - 使用固定的星期標題保證輸出格式
	processedData.push(['時間', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']);

	// 處理每個時間段的行
	for (let i = dataStartIndex + 1; i < rawData.length; i++) {
		const row = rawData[i];
		if (row.length < 2) continue; // 跳過空行

		// 提取時間段（第一列）
		const timeSlot = row[0].trim();

		// 創建新行，以時間段開頭
		const newRow: string[] = [timeSlot];

		// 為每天添加課程信息
		for (let j = 1; j < Math.min(headerRow.length, 8); j++) {
			const courseInfo = j < row.length && row[j] ? formatCourseInfo(row[j]) : '';
			newRow.push(courseInfo);
		}

		processedData.push(newRow);
	}

	return processedData;
};

/**
 * 格式化課程單元格內容
 * 支援格式：[教室代碼] 班級 課程名稱教師老師
 */
export const formatCourseInfo = (cellContent: string): string => {
	if (!cellContent || cellContent.trim() === '') return '';

	const trimmed = cellContent.trim();

	// 新格式：[CODE] ...
	const codeMatch = trimmed.match(/^\[([^\]]+)\]\s*/);
	if (codeMatch) {
		const classroomCode = codeMatch[1];
		const rest = trimmed.slice(codeMatch[0].length).trim();
		return `【地點】${classroomCode}\n【行程】${rest}`;
	}

	// 舊格式：使用 (...) 括號標示地點
	let location = '';
	const locationMatch = cellContent.match(/\(([^)]+)\)/);
	if (locationMatch) location = locationMatch[1];

	let event = cellContent.trim();
	if (locationMatch) event = event.replace(locationMatch[0], '').trim();

	const courseCodeMatch = event.match(/\b\d{4,5}\b/);
	if (courseCodeMatch) event = event.replace(courseCodeMatch[0], '').trim();

	const classNameMatch = event.match(/^([\w\s]+(系|班|中心|通識|資管|AI|一|二|三|四|五)[A-Z]?\s*)/);
	if (classNameMatch) event = event.replace(classNameMatch[0], '').trim();

	event = event.replace(/\s{2,}/g, ' ');
	if (!event && !location) return cellContent.trim();

	return `【地點】${location || '無'}\n【行程】${event.trim()}`;
};

/**
 * 從格式化後的行程字串中解析班級、課程名稱、教師
 * 輸入格式：「班級名稱 課程名稱教師老師」（班級與課程以空格分隔，教師緊接課程後）
 */
const parseEventContent = (eventStr: string): { className: string; courseName: string; teacher: string } => {
	if (!eventStr) return { className: '', courseName: '', teacher: '' };

	// 教師名稱：2–3 個中文字元 + 「老師」，位於字串結尾
	// 注意：{2,4} 的 greedy 行為會在 3 字老師名稱時多吃課程名稱最後一字
	const teacherMatch = eventStr.match(/([一-龥]{2,3}老師)$/);
	const teacher = teacherMatch ? teacherMatch[1] : '';
	const withoutTeacher = teacher ? eventStr.slice(0, -teacher.length).trim() : eventStr;

	// 第一個空格前為班級名稱
	const spaceIdx = withoutTeacher.indexOf(' ');
	const className = spaceIdx >= 0 ? withoutTeacher.slice(0, spaceIdx) : '';
	const courseName = spaceIdx >= 0 ? withoutTeacher.slice(spaceIdx + 1).trim() : withoutTeacher;

	return { className, courseName, teacher };
};

/**
 * 將表格數據轉換為結構化課程數據
 */
export const convertToStructuredData = (tableData: string[][]): CourseInfo[] => {
	const courses: CourseInfo[] = [];
	const DAY_LABELS = ['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

	for (let i = 1; i < tableData.length; i++) {
		const row = tableData[i];
		const timeSlot = row[0];

		for (let j = 1; j < row.length; j++) {
			const cellContent = row[j];
			if (!cellContent || cellContent.trim() === '') continue;

			const locationMatch = cellContent.match(/【地點】([^\n]+)/);
			const eventMatch = cellContent.match(/【行程】([^\n]+)/);

			const rawLocation = locationMatch ? locationMatch[1].trim() : '';
			const rawEvent = eventMatch ? eventMatch[1].trim() : '';
			const classroomCode = rawLocation !== '無' ? rawLocation : '';

			if (!classroomCode && !rawEvent) continue;

			const { className, courseName, teacher } = parseEventContent(rawEvent);

			courses.push({
				timeSlot,
				day: DAY_LABELS[j] ?? '',
				location: classroomCode, // resolved to real name in page.tsx via classroom map
				event: courseName || rawEvent,
				classroomCode,
				className,
				courseName,
				teacher,
			});
		}
	}

	return mergeContinuousCourses(courses);
};

/**
 * 合併連續的課程 - 改進版，針對雲科大實際課表情況優化
 */
export const mergeContinuousCourses = (courses: CourseInfo[]): CourseInfo[] => {
	if (!courses || courses.length <= 1) return courses;

	// 課程時間格式轉換函數，以便比較連續性
	const getTimeCode = (timeSlot: string): string | null => {
		const match = timeSlot.match(/([A-Z])\./);
		return match ? match[1] : null;
	};

	// 將課程按星期、行程、地點進行分組
	const courseGroups: { [key: string]: CourseInfo[] } = {};

	courses.forEach(course => {
		// 創建分組鍵 (星期+行程+地點)
		const key = `${course.day}-${course.event}-${course.location}`;
		if (!courseGroups[key]) {
			courseGroups[key] = [];
		}
		courseGroups[key].push(course);
	});

	// 處理每個分組並合併連續課程
	const mergedCourses: CourseInfo[] = [];

	Object.values(courseGroups).forEach(group => {
		// 如果分組只有一個課程，直接添加
		if (group.length === 1) {
			mergedCourses.push(group[0]);
			return;
		}

		// 對課程按照時間代碼排序
		group.sort((a, b) => {
			const codeA = getTimeCode(a.timeSlot) || '';
			const codeB = getTimeCode(b.timeSlot) || '';
			return codeA.localeCompare(codeB);
		});

		// 檢查是否是連續的時間代碼，如果是則合併
		// 雲科大課表的時間代碼通常是連續的字母
		const isSequentialCodes = (timeCodes: string[]): boolean => {
			for (let i = 0; i < timeCodes.length - 1; i++) {
				const current = timeCodes[i].charCodeAt(0);
				const next = timeCodes[i + 1].charCodeAt(0);
				if (next - current !== 1) {
					return false;
				}
			}
			return true;
		};

		// 獲取課程時間代碼
		const timeCodes = group.map(course => getTimeCode(course.timeSlot) || '');

		// 如果時間代碼是連續的，則將整個分組合併為一個課程
		if (isSequentialCodes(timeCodes)) {
			const firstCourse = group[0];
			const lastCourse = group[group.length - 1];

			const firstTimeRange = parseTimeSlot(firstCourse.timeSlot);
			const lastTimeRange = parseTimeSlot(lastCourse.timeSlot);

			if (firstTimeRange && lastTimeRange) {
				const firstCode = getTimeCode(firstCourse.timeSlot) || '';
				const mergedTimeSlot = `${firstCode}. ${firstTimeRange.start} | ${lastTimeRange.end}`;

				const mergedCourse: CourseInfo = {
					...firstCourse,
					timeSlot: mergedTimeSlot,
				};

				mergedCourses.push(mergedCourse);
			} else {
				// 如果不能解析時間，則添加原始課程
				group.forEach(course => mergedCourses.push(course));
			}
		} else {
			// 如果時間代碼不連續，則添加原始課程
			group.forEach(course => mergedCourses.push(course));
		}
	});

	return mergedCourses;
};
