"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
  Settings,
} from "lucide-react";
import guideData from "./guide-content.json";

const yuntechTheme = {
  primary: "#009393",
  secondary: "#007575",
  light: "#4FC3C3",
  ultraLight: "#E6F7F7",
  white: "#ffffff",
  gray: {
    50: "#f8f9fa",
    100: "#f0f1f3",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#6c757d",
    700: "#495057",
    800: "#343a40",
    900: "#212529",
  },
};

const IconMap: Record<string, React.ElementType> = {
  HelpCircle,
  Settings,
  CheckCircle2,
  Calendar,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  Bookmark,
  ChevronRight,
};

export default function GuidePage() {
  const renderTextWithLinks = (text: string) => {
    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <a
            key={index}
            href={match[2]}
            target={match[2].startsWith("http") ? "_blank" : undefined}
            rel={
              match[2].startsWith("http") ? "noopener noreferrer" : undefined
            }
            className="text-teal-600 hover:text-teal-700"
            style={{ textDecoration: "none" }}
          >
            {match[1]}
          </a>
        );
      }
      return part;
    });
  };

  const renderBlock = (block: any, index: number) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p
            key={index}
            style={{
              marginBottom: "1rem",
              color:
                block.className === "text-gray-500"
                  ? yuntechTheme.gray[500]
                  : yuntechTheme.gray[700],
              lineHeight: 1.6,
              fontWeight: block.isStrong ? "500" : "normal",
            }}
          >
            {renderTextWithLinks(block.content)}
          </p>
        );
      case "list":
        return (
          <ul
            key={index}
            style={{
              paddingLeft: "1.5rem",
              marginBottom: "1rem",
              color: yuntechTheme.gray[700],
              listStyleType: "disc",
            }}
          >
            {block.items.map((item: string, idx: number) => (
              <li key={idx} style={{ marginBottom: "0.5rem" }}>
                {renderTextWithLinks(item)}
              </li>
            ))}
          </ul>
        );
      case "ordered-list":
        return (
          <ol
            key={index}
            style={{
              paddingLeft: "1.5rem",
              marginBottom: "1.5rem",
              color: yuntechTheme.gray[700],
              listStyleType: "decimal",
            }}
          >
            {block.items.map((item: any, idx: number) => (
              <li key={idx} style={{ marginBottom: "1rem" }}>
                <p style={{ fontWeight: "500", margin: "0 0 0.25rem 0" }}>
                  {item.title}
                </p>
                {item.content.split("\n").map((line: string, lIdx: number) => (
                  <p
                    key={lIdx}
                    style={{ color: yuntechTheme.gray[600], margin: 0 }}
                  >
                    {renderTextWithLinks(line)}
                  </p>
                ))}
              </li>
            ))}
          </ol>
        );
      case "nested-list":
        return (
          <ul
            key={index}
            style={{
              paddingLeft: "1.5rem",
              marginBottom: "1.5rem",
              color: yuntechTheme.gray[700],
              listStyleType: "disc",
            }}
          >
            {block.items.map((item: any, idx: number) => (
              <li key={idx} style={{ marginBottom: "1rem" }}>
                <span style={{ fontWeight: "500" }}>{item.title}</span>
                <ul
                  style={{
                    paddingLeft: "1.5rem",
                    marginTop: "0.25rem",
                    color: yuntechTheme.gray[600],
                    listStyleType: "disc",
                  }}
                >
                  {item.subItems.map((subItem: string, sIdx: number) => (
                    <li key={sIdx}>{renderTextWithLinks(subItem)}</li>
                  ))}
                </ul>
                {item.footer && (
                  <p className="text-gray-500" style={{ marginTop: "0.5rem" }}>
                    {renderTextWithLinks(item.footer)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        );
      case "alert":
        const alertStyles: Record<string, any> = {
          warning: {
            bg: "#FFF9DB",
            border: "#F59E0B",
            text: "#92400E",
            icon: AlertTriangle,
          },
          tip: {
            bg: yuntechTheme.ultraLight,
            border: yuntechTheme.primary,
            text: yuntechTheme.secondary,
            icon: FileText,
          },
          success: {
            bg: "#ECFDF5",
            border: "#10B981",
            text: "#047857",
            icon: CheckCircle2,
          },
        };
        const style = alertStyles[block.style || "tip"];
        const AlertIcon = style.icon;
        return (
          <div
            key={index}
            style={{
              backgroundColor: style.bg,
              borderLeft: `4px solid ${style.border}`,
              padding: "1rem",
              borderRadius: "0.25rem",
              marginBottom: "1rem",
            }}
          >
            <div style={{ display: "flex" }}>
              <div style={{ flexShrink: 0 }}>
                <AlertIcon
                  style={{
                    height: "1.25rem",
                    width: "1.25rem",
                    color: style.border,
                  }}
                />
              </div>
              <div style={{ marginLeft: "0.75rem" }}>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: style.text,
                    margin: 0,
                  }}
                >
                  {renderTextWithLinks(block.content)}
                </p>
              </div>
            </div>
          </div>
        );
      case "faq":
        return (
          <div
            key={index}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {block.items.map((item: any, idx: number) => (
              <div key={idx}>
                <h3
                  style={{
                    fontWeight: "500",
                    fontSize: "1.125rem",
                    color: yuntechTheme.gray[800],
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  Q: {item.q}
                </h3>
                <p
                  style={{
                    marginTop: "0.25rem",
                    color: yuntechTheme.gray[700],
                    lineHeight: 1.6,
                  }}
                >
                  A: {renderTextWithLinks(item.a)}
                </p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        maxWidth: "5xl",
        margin: "0 auto",
        padding: "1.5rem",
        background: yuntechTheme.white,
        minHeight: "calc(100vh - 180px)",
      }}
    >
      {/* 頁面標題 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: "center",
          marginBottom: "2.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <Image
            src="/NYUST.svg"
            alt="雲科大校徽"
            width={60}
            height={60}
            style={{ marginRight: "1rem" }}
          />
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: yuntechTheme.primary,
              margin: 0,
            }}
          >
            {guideData.title}
          </h1>
        </div>
        <p
          style={{
            marginTop: "0.5rem",
            color: yuntechTheme.gray[600],
            fontSize: "1.125rem",
          }}
        >
          {guideData.subtitle}
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginTop: "1rem",
            color: yuntechTheme.primary,
            fontWeight: "500",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = yuntechTheme.secondary;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = yuntechTheme.primary;
          }}
        >
          <ArrowLeft
            style={{ width: "1rem", height: "1rem", marginRight: "0.25rem" }}
          />
          返回首頁
        </Link>
      </motion.div>

      {/* 目錄導航 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          marginBottom: "2rem",
          backgroundColor: yuntechTheme.ultraLight,
          borderRadius: "0.5rem",
          padding: "1rem",
          border: `1px solid ${yuntechTheme.light}`,
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "0.75rem",
            display: "flex",
            alignItems: "center",
            color: yuntechTheme.primary,
          }}
        >
          <Bookmark
            style={{ marginRight: "0.5rem", color: yuntechTheme.primary }}
          />
          目錄
        </h2>
        <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
          {guideData.toc.map((item) => (
            <li key={item.id} style={{ marginBottom: "0.5rem" }}>
              <a
                href={`#${item.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: yuntechTheme.primary,
                  textDecoration: "none",
                  padding: "0.25rem 0",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = yuntechTheme.secondary;
                  e.currentTarget.style.paddingLeft = "0.25rem";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = yuntechTheme.primary;
                  e.currentTarget.style.paddingLeft = "0";
                }}
              >
                <ChevronRight
                  style={{ width: "1rem", height: "1rem", flexShrink: 0 }}
                />
                <span style={{ marginLeft: "0.25rem" }}>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* 渲染各個章節 */}
      {guideData.sections.map((section, sIndex) => {
        const SectionIcon = IconMap[section.icon] || HelpCircle;
        return (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + sIndex * 0.1 }}
            id={section.id}
            style={{
              marginBottom: "2.5rem",
              backgroundColor: yuntechTheme.white,
              borderRadius: "0.5rem",
              padding: "1.5rem",
              border: `1px solid ${yuntechTheme.gray[200]}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                color: yuntechTheme.primary,
              }}
            >
              <SectionIcon
                style={{ marginRight: "0.5rem", color: yuntechTheme.primary }}
              />
              {section.title}
            </h2>
            {section.blocks.map((block, bIndex) => renderBlock(block, bIndex))}
          </motion.section>
        );
      })}

      {/* 返回首頁 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        style={{ textAlign: "center", marginBottom: "2rem" }}
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
