"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';

interface CourseTableProps {
	tableData: string[][];
	isLoading?: boolean;
}

// Define types for styles
interface Styles {
  [key: string]: React.CSSProperties;
}

const CourseTable: React.FC<CourseTableProps> = ({ tableData, isLoading = false }) => {
	const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
	const [expandedCell, setExpandedCell] = useState<{ row: number; col: number } | null>(null);
	const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

	const colors = {
		white: '#ffffff',
		blue: {
			50: '#f0f7ff',
			100: '#e0efff',
			500: '#3b82f6',
			600: '#2563eb'
		},
		gray: {
			100: '#f3f4f6',
			200: '#e5e7eb',
			300: '#d1d5db',
			500: '#6b7280',
			700: '#374151'
		}
	};

	const baseStyles: Styles = {
		container: {
			width: '100%',
			backgroundColor: colors.white,
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
			padding: '1.5rem',
		},
		header: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			alignItems: 'flex-start',
			marginBottom: '1rem'
		},
		title: {
			fontSize: '1.125rem',
			fontWeight: '600',
			color: colors.gray[700]
		},
		controls: {
			display: 'flex',
			alignItems: 'center',
			gap: '0.5rem',
			marginTop: '0.5rem'
		},
		formatBadge: {
			fontSize: '0.75rem',
			color: colors.gray[500],
			backgroundColor: colors.blue[50],
			padding: '0.5rem',
			borderRadius: '0.25rem'
		},
		tableWrapper: {
			overflowX: 'auto',
			borderRadius: '0.5rem',
			border: `1px solid ${colors.gray[200]}`,
		},
		table: {
			minWidth: '100%',
			borderCollapse: 'collapse'
		},
		tableHeader: {
			position: 'sticky',
			top: '0',
			zIndex: '10'
		},
		headerRow: {
			background: colors.blue[50]
		},
		headerCell: {
			border: `1px solid ${colors.gray[200]}`,
			padding: '0.75rem',
			textAlign: 'left',
			fontWeight: '500',
			color: colors.gray[700],
			textTransform: 'uppercase',
			whiteSpace: 'nowrap',
			fontSize: '0.75rem'
		},
		emptyCell: {
			height: '1.5rem',
			width: '100%'
		},
		cellContent: {
			position: 'relative'
		},
		eventTitle: {
			fontWeight: '500',
			fontSize: '0.875rem',
			color: colors.gray[700]
		},
		location: {
			color: colors.gray[500],
			fontSize: '0.75rem',
			marginTop: '0.25rem',
			display: 'flex',
			alignItems: 'center'
		},
		locationBadge: {
			backgroundColor: colors.blue[50],
			padding: '0.125rem 0.375rem',
			borderRadius: '0.25rem'
		},
		expandButton: {
			position: 'absolute',
			top: '0',
			right: '0',
			padding: '0.25rem',
			color: colors.gray[300],
			borderRadius: '9999px',
			border: 'none',
			background: 'transparent',
			cursor: 'pointer'
		},
		detailsPanel: {
			marginTop: '1rem',
			padding: '1rem',
			backgroundColor: colors.white,
			border: `1px solid ${colors.blue[100]}`,
			borderRadius: '0.5rem',
			boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
		},
		detailsTitle: {
			fontWeight: '500',
			color: colors.gray[700],
			marginBottom: '0.5rem'
		},
		detailsContent: {
			whiteSpace: 'pre-line',
			color: colors.gray[700]
		},
		selectionInfo: {
			marginTop: '1rem',
			padding: '0.75rem',
			backgroundColor: colors.blue[50],
			borderRadius: '0.5rem',
			fontSize: '0.875rem',
			border: `1px solid ${colors.blue[100]}`
		},
		selectionText: {
			fontWeight: '500',
			color: colors.gray[700]
		}
	};

	// 處理空數據或載入狀態
	if (isLoading) {
		return (
			<div style={{
				width: '100%',
				backgroundColor: colors.white,
				borderRadius: '0.5rem',
				boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
				padding: '1.5rem'
			}}>
				<h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: colors.gray[700] }}>課表預覽</h2>
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
					<div style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
						<div style={{ height: '1.5rem', width: '8rem', backgroundColor: colors.gray[200], borderRadius: '0.25rem', marginBottom: '1rem' }}></div>
						<div style={{ height: '16rem', width: '100%', backgroundColor: colors.blue[50], borderRadius: '0.25rem' }}></div>
					</div>
				</div>
			</div>
		);
	}

	if (!tableData || tableData.length === 0) {
		return (
			<div style={{
				width: '100%',
				backgroundColor: colors.white,
				borderRadius: '0.5rem',
				boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
				padding: '1.5rem'
			}}>
				<h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: colors.gray[700] }}>課表預覽</h2>
				<div style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '16rem',
					backgroundColor: colors.blue[50],
					borderRadius: '0.5rem'
				}}>
					<p style={{ color: colors.gray[500] }}>尚無課表資料，請先上傳或輸入課表</p>
				</div>
			</div>
		);
	}

	// 高亮選中的單元格
	const handleCellClick = (rowIndex: number, colIndex: number) => {
		if (rowIndex === 0) return; // 不選中表頭

		// 如果已有展開的單元格，先關閉它
		if (expandedCell) {
			setExpandedCell(null);
			return;
		}

		setSelectedCell(
			selectedCell?.row === rowIndex && selectedCell?.col === colIndex
				? null
				: { row: rowIndex, col: colIndex }
		);
	};

	// 展開單元格詳情
	const handleExpandCell = (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
		e.stopPropagation();

		// 切換展開
		if (expandedCell?.row === rowIndex && expandedCell?.col === colIndex) {
			setExpandedCell(null);
		} else {
			setExpandedCell({ row: rowIndex, col: colIndex });
			// 同時選中該單元格
			setSelectedCell({ row: rowIndex, col: colIndex });
		}
	};

	// 切換全螢幕
	const toggleFullScreen = () => {
		setIsFullScreen(!isFullScreen);
	};

	// 檢查是否有包含 地點 and 行程 格式的單元格
	const hasFormattedCells = tableData.slice(1).some(row =>
		row.some(cell => cell.includes('【地點】') || cell.includes('【行程】'))
	);

	// 計算依賴於狀態的樣式
	const getContainerStyle = (): React.CSSProperties => {
		return {
			...baseStyles.container,
			...(isFullScreen ? {
				position: 'fixed',
				inset: '0',
				zIndex: 50,
				padding: '2rem'
			} : {})
		};
	};

	const getTableWrapperStyle = (): React.CSSProperties => {
		return {
			...baseStyles.tableWrapper,
			...(isFullScreen ? {
				height: 'calc(100vh - 200px)'
			} : {})
		};
	};

	const getRowStyle = (): React.CSSProperties => {
		return {
			backgroundColor: colors.white,
			transition: 'background-color 0.15s'
		};
	};

	const getCellStyle = (isEmpty: boolean, isSelected: boolean): React.CSSProperties => {
		return {
			border: `1px solid ${colors.gray[200]}`,
			padding: '0.75rem',
			minWidth: '8rem',
			cursor: 'pointer',
			transition: 'all 0.15s',
			backgroundColor: colors.white,
			...(isSelected ? {
				backgroundColor: colors.blue[100],
				boxShadow: `0 0 0 1px ${colors.blue[500]}`
			} : {})
		};
	};

	const getExpandableContentStyle = (isExpanded: boolean): React.CSSProperties => {
		return {
			...(isExpanded ? { minHeight: '6rem' } : {})
		};
	};

	const getCellTextStyle = (isExpanded: boolean): React.CSSProperties => {
		return {
			whiteSpace: 'pre-line',
			fontSize: '0.75rem',
			color: colors.gray[700],
			...(isExpanded ? { minHeight: '5rem' } : {
				display: '-webkit-box',
				WebkitLineClamp: 2,
				WebkitBoxOrient: 'vertical',
				overflow: 'hidden'
			})
		};
	};

	return (
		<motion.div
			style={getContainerStyle()}
			layout
			transition={{ duration: 0.3 }}
		>
			<div style={baseStyles.header}>
				<h2 style={baseStyles.title}>課表預覽</h2>

				<div style={baseStyles.controls}>
					{hasFormattedCells && (
						<div style={baseStyles.formatBadge}>
							內容已格式化，便於 ICS 匯出
						</div>
					)}

					<button
						onClick={toggleFullScreen}
						style={{
							padding: '0.5rem',
							borderRadius: '9999px',
							transition: 'background-color 0.2s',
							border: 'none',
							background: 'transparent',
							cursor: 'pointer',
							color: colors.gray[500]
						}}
						onMouseOver={(e) => {
							e.currentTarget.style.backgroundColor = colors.blue[50];
							e.currentTarget.style.color = colors.blue[500];
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.backgroundColor = 'transparent';
							e.currentTarget.style.color = colors.gray[500];
						}}
						aria-label={isFullScreen ? "退出全屏" : "全屏顯示"}
					>
						{isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
					</button>
				</div>
			</div>

			<div style={getTableWrapperStyle()}>
				<table style={baseStyles.table}>
					<thead style={baseStyles.tableHeader}>
						<tr style={baseStyles.headerRow}>
							{tableData[0]?.map((header, index) => (
								<th
									key={index}
									style={baseStyles.headerCell}
								>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{tableData.slice(1).map((row, rowIndex) => (
							<tr
								key={rowIndex}
								style={getRowStyle()}
								onMouseOver={(e) => {
									e.currentTarget.style.backgroundColor = colors.blue[50];
								}}
								onMouseOut={(e) => {
									e.currentTarget.style.backgroundColor = colors.white;
								}}
							>
								{row.map((cell, cellIndex) => {
									// 處理課程資訊的格式化顯示
									const isFormatted = cell.includes('【地點】') || cell.includes('【行程】');
									const isEmpty = cell.trim() === '';
									const isExpanded = expandedCell?.row === rowIndex + 1 && expandedCell?.col === cellIndex;
									const isSelected = selectedCell?.row === rowIndex + 1 && selectedCell?.col === cellIndex;

									// 抽取地點和行程
									let location = '', event = '';

									if (isFormatted) {
										const locationMatch = cell.match(/【地點】([^\n]+)/);
										const eventMatch = cell.match(/【行程】([^\n]+)/);
										location = locationMatch ? locationMatch[1].trim() : '';
										event = eventMatch ? eventMatch[1].trim() : '';
									}

									// 判斷單元格是否有足夠內容需要展開
									const hasExpandableContent = cell.length > 50 || cell.split('\n').length > 2;

									return (
										<td
											key={cellIndex}
											style={getCellStyle(isEmpty, isSelected)}
											onClick={() => handleCellClick(rowIndex + 1, cellIndex)}
										>
											{isEmpty ? (
												<div style={baseStyles.emptyCell}></div>
											) : isFormatted ? (
													<div style={baseStyles.cellContent}>
														<motion.div
															layout
															style={getExpandableContentStyle(isExpanded)}
														>
															{event && (
																<div style={baseStyles.eventTitle}>{event}</div>
															)}
															{location && location !== '無' && (
																<div style={baseStyles.location}>
																	<span style={baseStyles.locationBadge}>
																		{location}
																	</span>
																</div>
															)}
														</motion.div>

														{hasExpandableContent && (
															<button
																style={baseStyles.expandButton}
																onMouseOver={(e) => {
																	e.currentTarget.style.color = colors.blue[500];
																	e.currentTarget.style.backgroundColor = colors.blue[50];
																}}
																onMouseOut={(e) => {
																	e.currentTarget.style.color = colors.gray[300];
																	e.currentTarget.style.backgroundColor = 'transparent';
																}}
																onClick={(e) => handleExpandCell(e, rowIndex + 1, cellIndex)}
																aria-label={isExpanded ? "收合" : "展開"}
															>
																{isExpanded ? (
																	<ChevronUp size={16} />
																) : (
																		<ChevronDown size={16} />
																	)}
															</button>
														)}
													</div>
												) : (
														<div style={baseStyles.cellContent}>
															<div style={getCellTextStyle(isExpanded)}>
																{cell}
															</div>

															{hasExpandableContent && (
																<button
																	style={baseStyles.expandButton}
																	onMouseOver={(e) => {
																		e.currentTarget.style.color = colors.blue[500];
																		e.currentTarget.style.backgroundColor = colors.blue[50];
																	}}
																	onMouseOut={(e) => {
																		e.currentTarget.style.color = colors.gray[300];
																		e.currentTarget.style.backgroundColor = 'transparent';
																	}}
																	onClick={(e) => handleExpandCell(e, rowIndex + 1, cellIndex)}
																	aria-label={isExpanded ? "收合" : "展開"}
																>
																	{isExpanded ? (
																		<ChevronUp size={16} />
																	) : (
																			<ChevronDown size={16} />
																		)}
																</button>
															)}
														</div>
													)}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<AnimatePresence>
				{expandedCell && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						style={baseStyles.detailsPanel}
					>
						<h3 style={baseStyles.detailsTitle}>詳細資訊</h3>
						<div style={baseStyles.detailsContent}>
							{tableData[expandedCell.row]?.[expandedCell.col]}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{selectedCell && !expandedCell && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					style={baseStyles.selectionInfo}
				>
					<p style={baseStyles.selectionText}>已選擇: 第 {selectedCell.row} 行, 第 {selectedCell.col + 1} 列</p>
				</motion.div>
			)}
		</motion.div>
	);
};

export default CourseTable;
