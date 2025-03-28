"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Github, Menu, X, Calendar, Book, Home } from 'lucide-react';

interface NavbarProps {
	authorName?: string;
	githubUrl?: string;
}

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

const Navbar: React.FC<NavbarProps> = ({
	authorName = "OsGa.dev",
	githubUrl = "https://github.com/osga24/NYUST-ICS"
}) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<nav style={{
			backgroundColor: yuntechTheme.white,
			boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
			position: 'sticky',
			top: 0,
			zIndex: 40
			}}>
			<div style={{
				maxWidth: '1200px',
				margin: '0 auto',
				padding: '0 1rem'
				}}>
				<div style={{
					display: 'flex',
					justifyContent: 'space-between',
					height: '4rem'
					}}>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<Link href="/" style={{
							display: 'flex',
							alignItems: 'center',
							flexShrink: 0
							}}>
							<Calendar
								size={28}
								style={{
									color: yuntechTheme.primary,
									marginRight: '0.5rem'
								}}
							/>
							<span style={{
								marginLeft: '0.5rem',
								fontSize: '1.25rem',
								fontWeight: 'bold',
								color: yuntechTheme.primary
								}}>
								雲科大課表轉換
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex" style={{
						alignItems: 'center',
						gap: '1rem'
						}}>
						<Link
							href="/"
							style={{
								padding: '0.5rem 0.75rem',
								borderRadius: '0.375rem',
								fontSize: '0.875rem',
								fontWeight: '500',
								color: yuntechTheme.gray[700],
								display: 'flex',
								alignItems: 'center',
								transition: 'all 0.2s ease'
							}}
							onMouseOver={(e) => {
								e.currentTarget.style.color = yuntechTheme.primary;
								e.currentTarget.style.backgroundColor = yuntechTheme.ultraLight;
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.color = yuntechTheme.gray[700];
								e.currentTarget.style.backgroundColor = 'transparent';
							}}
							>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<Home style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
								首頁
							</div>
						</Link>
						<Link
							href="/guide"
							style={{
								padding: '0.5rem 0.75rem',
								borderRadius: '0.375rem',
								fontSize: '0.875rem',
								fontWeight: '500',
								color: yuntechTheme.gray[700],
								display: 'flex',
								alignItems: 'center',
								transition: 'all 0.2s ease'
							}}
							onMouseOver={(e) => {
								e.currentTarget.style.color = yuntechTheme.primary;
								e.currentTarget.style.backgroundColor = yuntechTheme.ultraLight;
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.color = yuntechTheme.gray[700];
								e.currentTarget.style.backgroundColor = 'transparent';
							}}
							>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<Book style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
								使用說明
							</div>
						</Link>
						<a
							href={githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							style={{
								padding: '0.5rem 0.75rem',
								borderRadius: '0.375rem',
								fontSize: '0.875rem',
								fontWeight: '500',
								color: yuntechTheme.gray[700],
								display: 'flex',
								alignItems: 'center',
								transition: 'all 0.2s ease'
							}}
							onMouseOver={(e) => {
								e.currentTarget.style.color = yuntechTheme.primary;
								e.currentTarget.style.backgroundColor = yuntechTheme.ultraLight;
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.color = yuntechTheme.gray[700];
								e.currentTarget.style.backgroundColor = 'transparent';
							}}
							>
							<Github style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
							GitHub
						</a>
						<div className="pl-3 border-l border-gray-300">
							<a
								href="https://osga.dev"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md border-2 border-teal-500 shadow-sm
								hover:bg-teal-600 hover:text-white hover:scale-105 transition-all duration-300 ease-out
								focus:outline-none focus:ring focus:ring-teal-400 active:scale-95"
								>
								Made by {authorName}
							</a>
						</div>
					</div>

					{/* Mobile menu button */}
					<div className="flex md:hidden" style={{
						alignItems: 'center'
						}}>
						<button
							onClick={toggleMobileMenu}
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								padding: '0.5rem',
								borderRadius: '0.375rem',
								color: yuntechTheme.gray[700],
								backgroundColor: 'transparent',
								border: 'none',
								cursor: 'pointer',
								transition: 'all 0.2s ease'
							}}
							onMouseOver={(e) => {
								e.currentTarget.style.color = yuntechTheme.primary;
								e.currentTarget.style.backgroundColor = yuntechTheme.ultraLight;
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.color = yuntechTheme.gray[700];
								e.currentTarget.style.backgroundColor = 'transparent';
							}}
							aria-expanded="false"
							>
							<span style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: '0' }}>
								開啟主選單
							</span>
							{isMobileMenuOpen ? (
								<X style={{ display: 'block', height: '1.5rem', width: '1.5rem' }} />
								) : (
									<Menu style={{ display: 'block', height: '1.5rem', width: '1.5rem' }} />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			<div
				className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
				style={{
					backgroundColor: yuntechTheme.white,
					transition: 'all 0.3s ease'
				}}
				>
				<div style={{
					padding: '0.5rem'
					}}>
					<Link
						href="/"
						style={{
							display: 'block',
							padding: '0.75rem',
							borderRadius: '0.375rem',
							fontSize: '1rem',
							fontWeight: '500',
							color: yuntechTheme.gray[700],
							transition: 'all 0.2s ease'
						}}
						onClick={() => setIsMobileMenuOpen(false)}
						onMouseOver={(e) => {
							e.currentTarget.style.color = yuntechTheme.primary;
							e.currentTarget.style.backgroundColor = yuntechTheme.ultraLight;
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.color = yuntechTheme.gray[700];
							e.currentTarget.style.backgroundColor = 'transparent';
						}}
						>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<Home style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem' }} />
							首頁
						</div>
					</Link>
					<Link
						href="/guide"
						style={{
							display: 'block',
							padding: '0.75rem',
							borderRadius: '0.375rem',
							fontSize: '1rem',
							fontWeight: '500',
							color: yuntechTheme.gray[700],
							transition: 'all 0.2s ease'
						}}
						onClick={() => setIsMobileMenuOpen(false)}
						onMouseOver={(e) => {
							e.currentTarget.style.color = yuntechTheme.primary;
							e.currentTarget.style.backgroundColor = yuntechTheme.ultraLight;
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.color = yuntechTheme.gray[700];
							e.currentTarget.style.backgroundColor = 'transparent';
						}}
						>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<Book style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem' }} />
							使用說明
						</div>
					</Link>
					<a
						href={githubUrl}
						target="_blank"
						rel="noopener noreferrer"
						style={{
							display: 'flex',
							alignItems: 'center',
							padding: '0.75rem',
							borderRadius: '0.375rem',
							fontSize: '1rem',
							fontWeight: '500',
							color: yuntechTheme.gray[700],
							transition: 'all 0.2s ease'
						}}
						onClick={() => setIsMobileMenuOpen(false)}
						onMouseOver={(e) => {
							e.currentTarget.style.color = yuntechTheme.primary;
							e.currentTarget.style.backgroundColor = yuntechTheme.ultraLight;
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.color = yuntechTheme.gray[700];
							e.currentTarget.style.backgroundColor = 'transparent';
						}}
						>
						<Github style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem' }} />
						GitHub
					</a>
					<div className="text-center">
						<a
							href="https://osga.dev"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block px-4 py-2 text-sm font-medium text-gray-600 rounded-md
							hover:bg-teal-600 hover:text-white hover:scale-105 transition-all duration-300 ease-out
							focus:outline-none focus:ring focus:ring-teal-400 active:scale-95"
						>
							Made by {authorName}
						</a>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
