"use client";

import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseDocxFile } from '../utils/docxParser';
import { downloadICS } from '../utils/icsGenerator';
import { generateExcel } from '../utils/excelGenerator';
import { CourseInfo, SemesterConfig } from '../utils/types';
import { mergeContinuousCourses, defaultSemesterConfig } from '../utils/courseProcessor';
import CourseTable from '../components/CourseTable';
import CourseList from '../components/CourseList';
import SemesterPicker from '../components/SemesterPicker';
import { FileText, Calendar, FileSpreadsheet, Upload, CheckCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';

const yuntechTheme = {
	primary: '#009393',
	secondary: '#007575',
	light: '#4FC3C3',
	ultraLight: '#E6F7F7',
	accent: '#E6F7F7',
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

export default function Home() {
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [tableData, setTableData] = useState<string[][] | null>(null);
	const [courses, setCourses] = useState<CourseInfo[] | null>(null);
	const [semesterConfig] = useState<SemesterConfig>(defaultSemesterConfig);
	const [activeTab, setActiveTab] = useState<'table' | 'list'>('table');
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const dropAreaRef = useRef<HTMLDivElement>(null);

	// 清除成功消息的計時器
	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (success) {
			timer = setTimeout(() => {
				setSuccess(null);
			}, 3000);
		}
		return () => clearTimeout(timer);
	}, [success]);

	// 處理拖放功能
	useEffect(() => {
		const dropArea = dropAreaRef.current;
		if (!dropArea) return;

		const handleDragOver = (e: DragEvent) => {
			e.preventDefault();
			setIsDragging(true);
		};

		const handleDragLeave = (e: DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
		};

		const handleDrop = (e: DragEvent) => {
			e.preventDefault();
			setIsDragging(false);

			if (e.dataTransfer?.files.length) {
				const file = e.dataTransfer.files[0];
				if (file && file.name.endsWith('.docx')) {
					processFile(file);
				} else {
					setError('請選擇有效的 DOCX 文件');
				}
			}
		};

		dropArea.addEventListener('dragover', handleDragOver);
		dropArea.addEventListener('dragleave', handleDragLeave);
		dropArea.addEventListener('drop', handleDrop);

		return () => {
			dropArea.removeEventListener('dragover', handleDragOver);
			dropArea.removeEventListener('dragleave', handleDragLeave);
			dropArea.removeEventListener('drop', handleDrop);
		};
	}, []);

	/**
   * 處理文件上傳
   */
	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];
		if (!file || !file.name.endsWith('.docx')) {
			setError('請選擇有效的 DOCX 文件');
			return;
		}

		processFile(file);
	};

	/**
   * 處理文件
   */
	const processFile = async (file: File): Promise<void> => {
		try {
			setIsProcessing(true);
			setError(null);

			// 解析 DOCX 文件
			const parsedData = await parseDocxFile(file);

			// 設置解析結果
			setTableData(parsedData.tableData);

			// 確保 structuredData 存在，否則設為空陣列
			const structuredData = parsedData.structuredData ?? [];

			// 確保課程數據已經過合併處理
			const mergedCourses = mergeContinuousCourses(structuredData);
			setCourses(mergedCourses);

			console.log("原始課程數量:", structuredData.length);
			console.log("合併後課程數量:", mergedCourses.length);

			// 輸出範例時間段，檢查合併是否成功
			if (mergedCourses.length > 0) {
				console.log("合併後的課程時間範例:");
				mergedCourses.slice(0, 5).forEach(course => {
					console.log(`${course.day} ${course.timeSlot} - ${course.event} (${course.location})`);
				});
			} else {
				console.warn("合併後的課程數據為空，請檢查解析邏輯");
			}

			setSuccess('文件解析成功！');
		} catch (err) {
			console.error('處理文件時出錯:', err);
			setError(err instanceof Error ? err.message : '處理文件時發生錯誤');
		} finally {
			setIsProcessing(false);
		}
	};

	/**
   * 導出 ICS 文件
   */
	const handleExportICS = async (): Promise<void> => {
		if (!courses || courses.length === 0) {
			setError('沒有課程數據可導出');
			return;
		}

		try {
			// 確保導出前數據已合併，並傳入學期設定
			const mergedCourses = mergeContinuousCourses(courses);
			await downloadICS(mergedCourses, semesterConfig);
			setSuccess('ICS 行事曆匯出成功！');
		} catch (err) {
			console.error('導出ICS時出錯:', err);
			setError(err instanceof Error ? err.message : '導出ICS失敗，請重試');
		}
	};

	/**
   * 導出 Excel 文件
   */
	const handleExportExcel = (): void => {
		if (!tableData || !courses) {
			setError('沒有課程數據可導出');
			return;
		}

		try {
			// 確保導出前數據已合併
			const mergedCourses = mergeContinuousCourses(courses);
			generateExcel(tableData, mergedCourses);
			setSuccess('Excel 匯出成功！');
		} catch (err) {
			console.error('導出Excel時出錯:', err);
			setError(err instanceof Error ? err.message : '導出Excel失敗，請重試');
		}
	};


	return (
		<div style={{
			maxWidth: '1200px',
			margin: '0 auto',
			padding: '1.5rem',
			background: yuntechTheme.white,
			minHeight: 'calc(100vh - 180px)'
		}}>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-center mb-8"
			>
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-3 mb-4">
					<Image
						src="/NYUST.svg"
						alt="雲科大校徽"
						width={60}
						height={60}
						className="w-12 h-12 sm:w-16 sm:h-16"
					/>
					<h1 className="text-3xl sm:text-4xl font-bold text-primary m-0">
						雲科大課表轉換工具
					</h1>
				</div>
				<p className="mt-2 text-gray-600 text-xs sm:text-lg">
					輕鬆將 DOCX 課表轉換為 ICS 行事曆，填滿你的行事曆！
				</p>
			</motion.div>

			{/* 上傳區域 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				style={{ marginBottom: '2rem' }}
			>
				<div
					ref={dropAreaRef}
					style={{
						width: '100%',
						borderRadius: '0.75rem',
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
						transition: 'all 0.3s ease',
						border: isDragging
							? `2px dashed ${yuntechTheme.primary}`
							: `1px solid ${yuntechTheme.gray[200]}`,
						backgroundColor: isDragging ? yuntechTheme.ultraLight : yuntechTheme.white
					}}
				>
					<div style={{ padding: '1.5rem' }}>
						<div style={{
							display: 'flex',
							alignItems: 'center',
							marginBottom: '1rem',
							color: yuntechTheme.primary
						}}>
							<FileText size={24} style={{ marginRight: '0.5rem', color: yuntechTheme.primary }} />
							<h2 style={{
								fontSize: '1.5rem',
								fontWeight: '600',
								margin: 0,
								color: yuntechTheme.primary
							}}>
								上傳課表文件
							</h2>
						</div>

						<div style={{ textAlign: 'center', padding: '2rem 0' }}>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<input
									type="file"
									accept=".docx"
									onChange={handleFileChange}
									ref={fileInputRef}
									style={{ display: 'none' }}
								/>
								<button
									onClick={() => fileInputRef.current?.click()}
									style={{
										backgroundColor: yuntechTheme.primary,
										color: 'white',
										fontWeight: '500',
										padding: '0.75rem 1.5rem',
										borderRadius: '0.5rem',
										border: 'none',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										margin: '0 auto 0.5rem auto',
										cursor: 'pointer',
										boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
										transition: 'background-color 0.3s ease'
									}}
									onMouseOver={(e) => {
										e.currentTarget.style.backgroundColor = yuntechTheme.secondary;
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.backgroundColor = yuntechTheme.primary;
									}}
								>
									<Upload size={20} style={{ marginRight: '0.5rem' }} />
									選擇 DOCX 文件
								</button>
							</motion.div>
							<p style={{
								color: yuntechTheme.gray[500],
								fontSize: '0.875rem',
								marginTop: '0.5rem'
							}}>
								或將檔案拖放至此區域
							</p>
						</div>

						<AnimatePresence>
							{isProcessing && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									style={{
										display: 'flex',
										justifyContent: 'center',
										marginTop: '1rem'
									}}
								>
									<div style={{
										display: 'flex',
										alignItems: 'center',
										color: yuntechTheme.primary
									}}>
										<svg
											style={{
												animation: 'spin 1s linear infinite',
												height: '1.25rem',
												width: '1.25rem',
												marginRight: '0.5rem'
											}}
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												style={{ opacity: 0.25 }}
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												style={{ opacity: 0.75 }}
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										處理中，請稍候...
									</div>
								</motion.div>
							)}

							{error && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									style={{
										marginTop: '1rem',
										backgroundColor: '#FEE2E2',
										borderLeft: '4px solid #DC2626',
										padding: '1rem',
										borderRadius: '0.25rem'
									}}
								>
									<div style={{ display: 'flex' }}>
										<div style={{ flexShrink: 0 }}>
											<svg
												style={{ height: '1.25rem', width: '1.25rem', color: '#DC2626' }}
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
										<div style={{ marginLeft: '0.75rem' }}>
											<p style={{
												fontSize: '0.875rem',
												color: '#B91C1C'
											}}>
												{error}
											</p>
										</div>
									</div>
								</motion.div>
							)}

							{success && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									style={{
										marginTop: '1rem',
										backgroundColor: yuntechTheme.ultraLight,
										borderLeft: `4px solid ${yuntechTheme.primary}`,
										padding: '1rem',
										borderRadius: '0.25rem'
									}}
								>
									<div style={{ display: 'flex' }}>
										<div style={{ flexShrink: 0 }}>
											<CheckCircle
												size={20}
												style={{ color: yuntechTheme.primary }}
											/>
										</div>
										<div style={{ marginLeft: '0.75rem' }}>
											<p style={{
												fontSize: '0.875rem',
												color: yuntechTheme.secondary
											}}>
												{success}
											</p>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{courses && (
						<div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
							<div style={{
								borderTop: `1px solid ${yuntechTheme.gray[200]}`,
								paddingTop: '1.25rem'
							}}>
								<div style={{
									display: 'flex',
									flexWrap: 'wrap',
									gap: '0.75rem',
									justifyContent: 'center'
								}}>
									<motion.button
										whileHover={{ scale: 1.03 }}
										whileTap={{ scale: 0.97 }}
										onClick={handleExportICS}
										disabled={isProcessing}
										style={{
											backgroundColor: '#16A34A',
											color: 'white',
											fontWeight: '500',
											padding: '0.5rem 1rem',
											borderRadius: '0.5rem',
											border: 'none',
											display: 'flex',
											alignItems: 'center',
											cursor: 'pointer',
											boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
											transition: 'all 0.3s ease'
										}}
										onMouseOver={(e) => {
											e.currentTarget.style.backgroundColor = '#15803D';
										}}
										onMouseOut={(e) => {
											e.currentTarget.style.backgroundColor = '#16A34A';
										}}
									>
										<Calendar size={20} style={{ marginRight: '0.5rem' }} />
										匯出 ICS 行事曆
									</motion.button>

									<motion.button
										whileHover={{ scale: 1.03 }}
										whileTap={{ scale: 0.97 }}
										onClick={handleExportExcel}
										disabled={isProcessing}
										style={{
											backgroundColor: '#3B82F6',
											color: 'white',
											fontWeight: '500',
											padding: '0.5rem 1rem',
											borderRadius: '0.5rem',
											border: 'none',
											display: 'flex',
											alignItems: 'center',
											cursor: 'pointer',
											boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
											transition: 'all 0.3s ease'
										}}
										onMouseOver={(e) => {
											e.currentTarget.style.backgroundColor = '#2563EB';
										}}
										onMouseOut={(e) => {
											e.currentTarget.style.backgroundColor = '#3B82F6';
										}}
									>
										<FileSpreadsheet size={20} style={{ marginRight: '0.5rem' }} />
										匯出 Excel
									</motion.button>
								</div>
							</div>
						</div>
					)}
				</div>
			</motion.div>

			{/* 學期資訊 */}
			{courses && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					style={{ marginBottom: '2rem' }}
				>
					<SemesterPicker />
				</motion.div>
			)}

			{/* 課程資訊顯示區 */}
			{(tableData || courses) && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					style={{
						backgroundColor: yuntechTheme.white,
						borderRadius: '0.75rem',
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
						overflow: 'hidden',
						marginBottom: '2rem',
						borderTop: `1px solid ${yuntechTheme.gray[200]}`,
						borderLeft: `1px solid ${yuntechTheme.gray[200]}`,
						borderRight: `1px solid ${yuntechTheme.gray[200]}`,
						borderBottom: `1px solid ${yuntechTheme.gray[200]}`
					}}
				>
					<div style={{
						display: 'flex',
						borderBottom: `1px solid ${yuntechTheme.gray[200]}`
					}}>
						<button
							style={{
								flex: 1,
								padding: '0.75rem 1rem',
								fontWeight: '500',
								textAlign: 'center',
								transition: 'all 0.2s ease',
								color: activeTab === 'table' ? yuntechTheme.primary : yuntechTheme.gray[600],
								borderTop: 'none',
								borderLeft: 'none',
								borderRight: 'none',
								borderBottom: activeTab === 'table'
									? `2px solid ${yuntechTheme.primary}`
									: 'none',
								background: 'none',
								cursor: 'pointer'
							}}
							onClick={() => setActiveTab('table')}
						>
							課表預覽
						</button>
						<button
							style={{
								flex: 1,
								padding: '0.75rem 1rem',
								fontWeight: '500',
								textAlign: 'center',
								transition: 'all 0.2s ease',
								color: activeTab === 'list' ? yuntechTheme.primary : yuntechTheme.gray[600],
								borderTop: 'none',
								borderLeft: 'none',
								borderRight: 'none',
								borderBottom: activeTab === 'list'
									? `2px solid ${yuntechTheme.primary}`
									: 'none',
								background: 'none',
								cursor: 'pointer'
							}}
							onClick={() => setActiveTab('list')}
						>
							課程列表
						</button>
					</div>

					<div style={{ padding: '1rem' }}>
						{activeTab === 'table' && tableData && (
							<CourseTable tableData={tableData} />
						)}

						{activeTab === 'list' && courses && (
							<CourseList courses={courses} />
						)}
					</div>
				</motion.div>
			)}

			{/* 使用說明連結 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
				style={{ textAlign: 'center', marginBottom: '2rem' }}
			>
				<Link
					href="/guide"
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						color: yuntechTheme.primary,
						fontWeight: '500',
						padding: '0.5rem 1rem',
						borderRadius: '0.5rem',
						transition: 'all 0.3s ease',
						textDecoration: 'none'
					}}
					onMouseOver={(e) => {
						e.currentTarget.style.backgroundColor = yuntechTheme.ultraLight;
						e.currentTarget.style.color = yuntechTheme.secondary;
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.backgroundColor = 'transparent';
						e.currentTarget.style.color = yuntechTheme.primary;
					}}
				>
					<BookOpen size={20} style={{ marginRight: '0.25rem' }} />
					查看詳細使用說明
				</Link>
			</motion.div>
		</div>
	);
}
