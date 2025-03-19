"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Menu, X, Calendar, Book, Home } from 'lucide-react';

interface NavbarProps {
  authorName?: string;
  githubUrl?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  authorName = "CloudTech Dev",
  githubUrl = "https://github.com/username/yuntech-calendar-converter"
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">雲科大課表轉換</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-1" />
                首頁
              </div>
            </Link>
            <Link
              href="/guide"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Book className="h-4 w-4 mr-1" />
                使用說明
              </div>
            </Link>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            >
              <Github className="h-4 w-4 mr-1" />
              GitHub
            </a>
            <div className="pl-3 border-l border-gray-200">
              <span className="text-sm text-gray-500">作者: {authorName}</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">開啟主選單</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimateMobileMenu isOpen={isMobileMenuOpen}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              首頁
            </div>
          </Link>
          <Link
            href="/guide"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center">
              <Book className="h-5 w-5 mr-2" />
              使用說明
            </div>
          </Link>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Github className="h-5 w-5 mr-2" />
            GitHub
          </a>
          <div className="px-3 py-2 text-sm text-gray-500">
            作者: {authorName}
          </div>
        </div>
      </AnimateMobileMenu>
    </nav>
  );
};

// Mobile menu animation component
const AnimateMobileMenu: React.FC<{ isOpen: boolean; children: React.ReactNode }> = ({
  isOpen,
  children
}) => {
  return (
    <motion.div
      className="md:hidden overflow-hidden"
      initial={{ height: 0 }}
      animate={{ height: isOpen ? 'auto' : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default Navbar;
