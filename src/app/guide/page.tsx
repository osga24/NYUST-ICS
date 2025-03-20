"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
	FileText,
	Calendar,
	ChevronRight,
	FileSpreadsheet,
	ArrowLeft,
	Bookmark,
	AlertTriangle,
	HelpCircle,
	CheckCircle2,
	Settings
} from 'lucide-react';

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

export default function GuidePage() {
	return (
		<div style={{
			maxWidth: '5xl',
			margin: '0 auto',
			padding: '1.5rem',
			background: yuntechTheme.white,
			minHeight: 'calc(100vh - 180px)'
		}}>
			{/* 頁面標題 */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				style={{
					textAlign: 'center',
					marginBottom: '2.5rem'
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
					<Image
						src="/NYUST.svg"
						alt="雲科大校徽"
						width={60}
						height={60}
						style={{ marginRight: '1rem' }}
					/>
					<h1 style={{
						fontSize: '2.5rem',
						fontWeight: 'bold',
						color: yuntechTheme.primary,
						margin: 0
					}}>
						使用說明
					</h1>
				</div>
				<p style={{
					marginTop: '0.5rem',
					color: yuntechTheme.gray[600],
					fontSize: '1.125rem'
				}}>
					瞭解如何使用雲科大課表轉換工具
				</p>
				<Link
					href="/"
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						marginTop: '1rem',
						color: yuntechTheme.primary,
						fontWeight: '500',
						textDecoration: 'none',
						transition: 'color 0.2s ease'
					}}
					onMouseOver={(e) => { e.currentTarget.style.color = yuntechTheme.secondary; }}
					onMouseOut={(e) => { e.currentTarget.style.color = yuntechTheme.primary; }}
				>
					<ArrowLeft style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
					返回首頁
				</Link>
			</motion.div>

			{/* 目錄導航 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				style={{
					marginBottom: '2rem',
					backgroundColor: yuntechTheme.ultraLight,
					borderRadius: '0.5rem',
					padding: '1rem',
					border: `1px solid ${yuntechTheme.light}`,
					boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
				}}
			>
				<h2 style={{
					fontSize: '1.25rem',
					fontWeight: '600',
					marginBottom: '0.75rem',
					display: 'flex',
					alignItems: 'center',
					color: yuntechTheme.primary
				}}>
					<Bookmark style={{ marginRight: '0.5rem', color: yuntechTheme.primary }} />
					目錄
				</h2>
				<ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
					{[
						{ id: "overview", name: "概述" },
						{ id: "requirements", name: "系統需求" },
						{ id: "how-to-use", name: "使用步驟" },
						{ id: "ics-export", name: "匯出 ICS 行事曆" },
						{ id: "excel-export", name: "匯出 Excel" },
						{ id: "faq", name: "常見問題" }
					].map((item) => (
							<li key={item.id} style={{ marginBottom: '0.5rem' }}>
								<a
									href={`#${item.id}`}
									style={{
										display: 'flex',
										alignItems: 'center',
										color: yuntechTheme.primary,
										textDecoration: 'none',
										padding: '0.25rem 0',
										transition: 'all 0.2s ease'
									}}
									onMouseOver={(e) => {
										e.currentTarget.style.color = yuntechTheme.secondary;
										e.currentTarget.style.paddingLeft = '0.25rem';
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.color = yuntechTheme.primary;
										e.currentTarget.style.paddingLeft = '0';
									}}
								>
									<ChevronRight style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
									<span style={{ marginLeft: '0.25rem' }}>{item.name}</span>
								</a>
							</li>
						))}
				</ul>
			</motion.div>

			{/* 概述 */}
			<motion.section
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				id="overview"
				style={{
					marginBottom: '2.5rem',
					backgroundColor: yuntechTheme.white,
					borderRadius: '0.5rem',
					padding: '1.5rem',
					border: `1px solid ${yuntechTheme.gray[200]}`,
					boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
				}}
			>
				<h2 style={{
					fontSize: '1.5rem',
					fontWeight: 'bold',
					marginBottom: '1rem',
					display: 'flex',
					alignItems: 'center',
					color: yuntechTheme.primary
				}}>
					<HelpCircle style={{ marginRight: '0.5rem', color: yuntechTheme.primary }} />
					概述
				</h2>
				<p style={{ marginBottom: '1rem', color: yuntechTheme.gray[700], lineHeight: 1.6 }}>
					雲科大課表轉換工具是一個幫助雲科大學生將 DOCX 格式的課表轉換為 ICS 行事曆文件或 Excel 表格的在線工具。通過這個工具，你可以：
				</p>
				<ul style={{
					paddingLeft: '1.5rem',
					marginBottom: '1rem',
					color: yuntechTheme.gray[700],
					listStyleType: 'disc'
				}}>
					<li style={{ marginBottom: '0.5rem' }}>上傳雲科大課表 DOCX 文件並自動識別課程資訊</li>
					<li style={{ marginBottom: '0.5rem' }}>預覽識別後的課表內容</li>
					<li style={{ marginBottom: '0.5rem' }}>將課表匯出為 ICS 格式，便於導入到 Google 日曆、Outlook 或 Apple 日曆</li>
				</ul>
				<p style={{ color: yuntechTheme.gray[700], lineHeight: 1.6 }}>
					本工具完全在瀏覽器中運行，您的課表資料不會上傳到任何伺服器，保障您的隱私安全。
				</p>
			</motion.section>

			{/* 系統需求 */}
			<motion.section
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
				id="requirements"
				style={{
					marginBottom: '2.5rem',
					backgroundColor: yuntechTheme.white,
					borderRadius: '0.5rem',
					padding: '1.5rem',
					border: `1px solid ${yuntechTheme.gray[200]}`,
					boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
				}}
			>
				<h2 style={{
					fontSize: '1.5rem',
					fontWeight: 'bold',
					marginBottom: '1rem',
					display: 'flex',
					alignItems: 'center',
					color: yuntechTheme.primary
				}}>
					<Settings style={{ marginRight: '0.5rem', color: yuntechTheme.primary }} />
					系統需求
				</h2>
				<p style={{ marginBottom: '1rem', color: yuntechTheme.gray[700], lineHeight: 1.6 }}>
					要使用本工具，您需要：
				</p>
				<ul style={{
					paddingLeft: '1.5rem',
					marginBottom: '1.5rem',
					color: yuntechTheme.gray[700],
					listStyleType: 'disc'
				}}>
					<li style={{ marginBottom: '0.5rem' }}>瀏覽器（Chrome、Firefox、Safari、Edge 等最新版本）</li>
					<li style={{ marginBottom: '0.5rem' }}>雲科大課表 DOCX 文件（單一系統登入你的帳號 ➡️  課程資訊 ➡️  學期選課資料➡️  下載該學期課表）</li>
					<li style={{ marginBottom: '0.5rem' }}>一顆耐心的心，本工具目前只針對學期開始到學期結束做處理，國定假日還是會按照排程，如果需要的話需自行刪除行程</li>
					<p style={{ marginBottom: '0.5rem' }} className='text-gray-500'>（原意是希望能提醒各位做可能需要做的作業，絕對不是我懶沒處理qq）</p>
				</ul>
				<div style={{
					backgroundColor: '#FFF9DB',
					borderLeft: '4px solid #F59E0B',
					padding: '1rem',
					borderRadius: '0.25rem'
				}}>
					<div style={{ display: 'flex' }}>
						<div style={{ flexShrink: 0 }}>
							<AlertTriangle style={{ height: '1.25rem', width: '1.25rem', color: '#F59E0B' }} />
						</div>
						<div style={{ marginLeft: '0.75rem' }}>
							<p style={{
								fontSize: '0.875rem',
								color: '#92400E',
								margin: 0
							}}>
								注意：本工具專為雲科大課表格式設計，使用其他學校或格式的課表無法正確識別。
							</p>
						</div>
					</div>
				</div>
			</motion.section>

			{/* 使用步驟 */}
			<motion.section
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
				id="how-to-use"
				style={{
					marginBottom: '2.5rem',
					backgroundColor: yuntechTheme.white,
					borderRadius: '0.5rem',
					padding: '1.5rem',
					border: `1px solid ${yuntechTheme.gray[200]}`,
					boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
				}}
			>
				<h2 style={{
					fontSize: '1.5rem',
					fontWeight: 'bold',
					marginBottom: '1rem',
					display: 'flex',
					alignItems: 'center',
					color: yuntechTheme.primary
				}}>
					<CheckCircle2 style={{ marginRight: '0.5rem', color: yuntechTheme.primary }} />
					使用步驟
				</h2>
				<ol style={{
					paddingLeft: '1.5rem',
					marginBottom: '1.5rem',
					color: yuntechTheme.gray[700],
					listStyleType: 'decimal'
				}}>
					<li style={{ marginBottom: '1rem' }}>
						<p style={{ fontWeight: '500', margin: '0 0 0.25rem 0' }}>準備課表 DOCX 文件</p>
						<p style={{ color: yuntechTheme.gray[600], margin: 0 }}>
							從雲科大單一系統下載您的課表 DOCX 文件。確保文件包含完整的課表信息。
						</p>
						<p style={{ color: yuntechTheme.gray[600], margin: 0 }}>
							（單一系統登入你的帳號 ➡️ 課程資訊 ➡️ 學期選課資料➡️ 下載該學期課表）
						</p>
					</li>
					<li style={{ marginBottom: '1rem' }}>
						<p style={{ fontWeight: '500', margin: '0 0 0.25rem 0' }}>上傳文件</p>
						<p style={{ color: yuntechTheme.gray[600], margin: 0 }}>
							在首頁點擊「選擇 DOCX 文件」按鈕，或將文件直接拖放到上傳區域。
						</p>
					</li>
					<li style={{ marginBottom: '1rem' }}>
						<p style={{ fontWeight: '500', margin: '0 0 0.25rem 0' }}>檢查識別結果</p>
						<p style={{ color: yuntechTheme.gray[600], margin: 0 }}>
							上傳成功後，系統會自動識別課表內容並顯示預覽。您可以切換「課表預覽」和「課程列表」查看識別結果。
						</p>
					</li>
					<li style={{ marginBottom: '1rem' }}>
						<p style={{ fontWeight: '500', margin: '0 0 0.25rem 0' }}>設定學期時間（可選）</p>
						<p style={{ color: yuntechTheme.gray[600], margin: 0 }}>
							如需調整學期的開始和結束日期，可在學期設定區域進行調整。
						</p>
					</li>
					<li style={{ marginBottom: '1rem' }}>
						<p style={{ fontWeight: '500', margin: '0 0 0.25rem 0' }}>導出文件</p>
						<p style={{ color: yuntechTheme.gray[600], margin: 0 }}>
							根據需求點擊「匯出 ICS 行事曆」或「匯出 Excel」按鈕，將課表轉換為對應格式並下載。
						</p>
					</li>
				</ol>
				<div style={{
					backgroundColor: yuntechTheme.ultraLight,
					borderLeft: `4px solid ${yuntechTheme.primary}`,
					padding: '1rem',
					borderRadius: '0.25rem'
				}}>
					<div style={{ display: 'flex' }}>
						<div style={{ flexShrink: 0 }}>
							<FileText style={{ height: '1.25rem', width: '1.25rem', color: yuntechTheme.primary }} />
						</div>
						<div style={{ marginLeft: '0.75rem' }}>
							<p style={{
								fontSize: '0.875rem',
								color: yuntechTheme.secondary,
								margin: 0
							}}>
								提示：如果您的課表包含連續的課程（如同一門課連續多節），系統會自動合併為一個時間段。
							</p>
						</div>
					</div>
				</div>
			</motion.section>

			{/* 匯出 ICS 行事曆 */}
			<motion.section
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}
				id="ics-export"
				style={{
					marginBottom: '2.5rem',
					backgroundColor: yuntechTheme.white,
					borderRadius: '0.5rem',
					padding: '1.5rem',
					border: `1px solid ${yuntechTheme.gray[200]}`,
					boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
				}}
			>
				<h2 style={{
					fontSize: '1.5rem',
					fontWeight: 'bold',
					marginBottom: '1rem',
					display: 'flex',
					alignItems: 'center',
					color: yuntechTheme.primary
				}}>
					<Calendar style={{ marginRight: '0.5rem', color: yuntechTheme.primary }} />
					匯出 ICS 行事曆
				</h2>
				<p style={{ marginBottom: '1rem', color: yuntechTheme.gray[700], lineHeight: 1.6 }}>
					ICS 是一種行事曆檔案格式，可導入到大多數行事曆應用中，包括 Google 日曆、Outlook 和 Apple 日曆。
				</p>
				<p style={{ marginBottom: '0.5rem', fontWeight: '500', color: yuntechTheme.gray[800] }}>匯出後如何使用：</p>
				<ul style={{
					paddingLeft: '1.5rem',
					marginBottom: '1.5rem',
					color: yuntechTheme.gray[700],
					listStyleType: 'disc'
				}}>
					<li style={{ marginBottom: '1rem' }}>
						<span style={{ fontWeight: '500' }}>Google 日曆：</span>
						<ul style={{
							paddingLeft: '1.5rem',
							marginTop: '0.25rem',
							color: yuntechTheme.gray[600],
							listStyleType: 'disc'
						}}>
							<li>打開 Google 日曆</li>
							<li>點擊右上角的設置圖標，選擇「設置」</li>
							<li>選擇「匯入與匯出」</li>
							<li>選擇「匯入」並上傳 ICS 文件</li>
						</ul>
					</li>
					<li style={{ marginBottom: '1rem' }}>
						<span style={{ fontWeight: '500' }}>Apple 日曆：</span>
						<ul style={{
							paddingLeft: '1.5rem',
							marginTop: '0.25rem',
							color: yuntechTheme.gray[600],
							listStyleType: 'disc'
						}}>
							<li>打開日曆應用</li>
							<li>點擊「檔案」 ➡️  「輸入」</li>
							<li>選擇並導入 ICS 文件</li>
							<li>選擇要導入的行程（建議新增一個行程）</li>
						</ul>
					</li>
					<li style={{ marginBottom: '1rem' }}>
						<span style={{ fontWeight: '500' }}>Outlook：</span>
						<ul style={{
							paddingLeft: '1.5rem',
							marginTop: '0.25rem',
							color: yuntechTheme.gray[600],
							listStyleType: 'disc'
						}}>
							<li>點擊「文件」➡️  「打開和導出」➡️  「導入/導出」</li>
							<li>選擇「導入 iCalendar」</li>
							<li>選擇並導入 ICS 文件</li>
							<p className='text-gray-500'>（因為我沒過 Outlook 所以這段是 AI 生的，如果流程有誤歡迎到 github 發 issue 或<a href='https://osga.dev/contact' className='text-teal-600 hover:text-teal-700'>聯絡我</a>）</p>
						</ul>
					</li>
				</ul>
				<div style={{
					backgroundColor: '#ECFDF5',
					borderLeft: '4px solid #10B981',
					padding: '1rem',
					borderRadius: '0.25rem'
				}}>
					<div style={{ display: 'flex' }}>
						<div style={{ flexShrink: 0 }}>
							<CheckCircle2 style={{ height: '1.25rem', width: '1.25rem', color: '#10B981' }} />
						</div>
						<div style={{ marginLeft: '0.75rem' }}>
							<p style={{
								fontSize: '0.875rem',
								color: '#047857',
								margin: 0
							}}>
								ICS 文件包含了課程名稱、時間、地點等資訊，並設置了重複規則，會在整個學期內按周重複。系統也會自動設置提醒，讓您不會錯過任何一堂課！
							</p>
						</div>
					</div>
				</div>
			</motion.section>

			{/* 匯出 Excel */}
			<motion.section
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.6 }}
				id="excel-export"
				style={{
					marginBottom: '2.5rem',
					backgroundColor: yuntechTheme.white,
					borderRadius: '0.5rem',
					padding: '1.5rem',
					border: `1px solid ${yuntechTheme.gray[200]}`,
					boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
				}}
			>
				<h2 style={{
					fontSize: '1.5rem',
					fontWeight: 'bold',
					marginBottom: '1rem',
					display: 'flex',
					alignItems: 'center',
					color: yuntechTheme.primary
				}}>
					<FileSpreadsheet style={{ marginRight: '0.5rem', color: yuntechTheme.primary }} />
					匯出 Excel
				</h2>
				<p style={{ marginBottom: '1rem', color: yuntechTheme.gray[700], lineHeight: 1.6 }}>
					除了 ICS 行事曆，您還可以將課表匯出為 Excel 格式。Excel 格式便於您進一步編輯和處理課表資料。
				</p>
				<p style={{ marginBottom: '0.5rem', fontWeight: '500', color: yuntechTheme.gray[800] }}>Excel 文件包含：</p>
				<ul style={{
					paddingLeft: '1.5rem',
					marginBottom: '1rem',
					color: yuntechTheme.gray[700],
					listStyleType: 'disc'
				}}>
					<li style={{ marginBottom: '0.5rem' }}>原始課表格式的工作表</li>
					<li style={{ marginBottom: '0.5rem' }}>結構化的課程資訊工作表（包含課程名稱、時間、地點等）</li>
					<li style={{ marginBottom: '0.5rem' }}>方便您自定義排序、篩選和分析的格式</li>
				</ul>
				<p style={{ color: yuntechTheme.gray[700], lineHeight: 1.6 }}>
					匯出的 Excel 文件可使用 Microsoft Excel、Google 試算表、LibreOffice Calc 等電子表格軟體打開。
				</p>
			</motion.section>

			{/* 常見問題 */}
			<motion.section
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.7 }}
				id="faq"
				style={{
					marginBottom: '2.5rem',
					backgroundColor: yuntechTheme.white,
					borderRadius: '0.5rem',
					padding: '1.5rem',
					border: `1px solid ${yuntechTheme.gray[200]}`,
					boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
				}}
			>
				<h2 style={{
					fontSize: '1.5rem',
					fontWeight: 'bold',
					marginBottom: '1rem',
					display: 'flex',
					alignItems: 'center',
					color: yuntechTheme.primary
				}}>
					<HelpCircle style={{ marginRight: '0.5rem', color: yuntechTheme.primary }} />
					常見問題
				</h2>

				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					<div>
						<h3 style={{
							fontWeight: '500',
							fontSize: '1.125rem',
							color: yuntechTheme.gray[800],
							margin: '0 0 0.25rem 0'
						}}>Q: 為什麼有些課程沒有被正確識別？</h3>
						<p style={{
							marginTop: '0.25rem',
							color: yuntechTheme.gray[700],
							lineHeight: 1.6
						}}>
							A: 系統會嘗試識別標準格式的課表，但如果您的課表格式特殊或有手動修改，可能會導致識別錯誤。請確保上傳的是從單一下載的原始課表。
						</p>
					</div>

					<div>
						<h3 style={{
							fontWeight: '500',
							fontSize: '1.125rem',
							color: yuntechTheme.gray[800],
							margin: '0 0 0.25rem 0'
						}}>Q: 我可以編輯已識別的課程資訊嗎？</h3>
						<p style={{
							marginTop: '0.25rem',
							color: yuntechTheme.gray[700],
							lineHeight: 1.6
						}}>
							A: 目前系統不支持直接編輯識別後的課程資訊。如需編輯，建議嘗試按照原 DOCX 的檔案進行編輯，並且嘗試系統是否可以讀取課程。
						</p>
					</div>

					<div>
						<h3 style={{
							fontWeight: '500',
							fontSize: '1.125rem',
							color: yuntechTheme.gray[800],
							margin: '0 0 0.25rem 0'
						}}>Q: 如何設置學期的開始和結束日期？</h3>
						<p style={{
							marginTop: '0.25rem',
							color: yuntechTheme.gray[700],
							lineHeight: 1.6
						}}>
							A: 在課表識別成功後，頁面會顯示學期設置區域，目前是由系統預設雲科本學期的開始時間以及結束時間，會在每次學期結束後手動更新，如果沒有的話請提醒我🥲。
						</p>
					</div>

					<div>
						<h3 style={{
							fontWeight: '500',
							fontSize: '1.125rem',
							color: yuntechTheme.gray[800],
							margin: '0 0 0.25rem 0'
						}}>Q: 導出的 ICS 文件會包含假期或特殊日期嗎？</h3>
						<p style={{
							marginTop: '0.25rem',
							color: yuntechTheme.gray[700],
							lineHeight: 1.6
						}}>
							A: 目前系統僅根據課表生成課程行事曆，不包含假期或特殊日期。需要自行將假日手動移除，日後（可能）會更新，如果想一同協作，歡迎<a href='https://osga.dev/contact' className='text-teal-600 hover:text-teal-700'>聯絡我</a>。
						</p>
					</div>

					<div>
						<h3 style={{
							fontWeight: '500',
							fontSize: '1.125rem',
							color: yuntechTheme.gray[800],
							margin: '0 0 0.25rem 0'
						}}>Q: 我的資料會被上傳到伺服器嗎？</h3>
						<p style={{
							marginTop: '0.25rem',
							color: yuntechTheme.gray[700],
							lineHeight: 1.6
						}}>
							A: 不會。本工具完全在您的瀏覽器中運行，所有文件處理都在本地設備上進行，不會將資料上傳到任何伺服器。
						</p>
					</div>

					<div>
						<h3 style={{
							fontWeight: '500',
							fontSize: '1.125rem',
							color: yuntechTheme.gray[800],
							margin: '0 0 0.25rem 0'
						}}>Q: 滷肉飯拌還不拌？</h3>
						<p style={{
							marginTop: '0.25rem',
							color: yuntechTheme.gray[700],
							lineHeight: 1.6
						}}>
							A: 不拌，跟咖哩一樣，但是這問題希望明年開展營可以再問一次長官們。
						</p>
					</div>
				</div>
			</motion.section>

			{/* 返回首頁 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.8 }}
				style={{ textAlign: 'center', marginBottom: '2rem' }}
			>
				<Link
					href="/"
					className="inline-flex items-center bg-[#009393] hover:bg-[#007575] text-white px-6 py-3 rounded-lg transition-colors"
				>
					<ArrowLeft className="w-5 h-5 mr-2" />
					返回課表轉換工具
				</Link>
			</motion.div>
		</div>
	);
}
