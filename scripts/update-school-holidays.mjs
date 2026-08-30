/**
 * 更新雲科大學校假日到 semester-config.json
 * 使用方式：node scripts/update-school-holidays.mjs
 *
 * 從雲科大行事曆 ICS 抓取含「補假」「停課」「放假」關鍵字的日期，
 * 寫入 public/config/semester-config.json 的 schoolHolidays 欄位。
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, '../public/config/semester-config.json');
const ICS_BASE_URL = 'https://events.yuntech.edu.tw/?&view=YunTech&format=ics&y=';

// 符合這些關鍵字的事件才算停課日
const NO_CLASS_KEYWORDS = ['補假', '停課', '放假'];

async function fetchICS(year) {
  const res = await fetch(`${ICS_BASE_URL}${year}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching year ${year}`);
  return res.text();
}

// ICS 行摺疊：CRLF 後接空格/tab 代表接續
function unfold(icsText) {
  return icsText.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
}

function parseVEvents(icsText) {
  const events = [];
  const re = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
  let m;
  while ((m = re.exec(unfold(icsText))) !== null) {
    const block = m[1];
    const dtstart = block.match(/^DTSTART[^:]*:(\d{8})/m)?.[1];
    const dtend   = block.match(/^DTEND[^:]*:(\d{8})/m)?.[1];
    const summary = block.match(/^SUMMARY:(.+)/m)?.[1]?.trim() ?? '';
    if (dtstart) events.push({ dtstart, dtend: dtend ?? dtstart, summary });
  }
  return events;
}

function isNoClass(summary) {
  return NO_CLASS_KEYWORDS.some(kw => summary.includes(kw));
}

// ICS 全天事件的 DTEND 是 exclusive（隔天），展開成每日日期字串
function expandDates(dtstart, dtend) {
  const dates = [];
  const start = new Date(`${dtstart.slice(0,4)}-${dtstart.slice(4,6)}-${dtstart.slice(6,8)}T00:00:00+08:00`);
  const end   = new Date(`${dtend.slice(0,4)}-${dtend.slice(4,6)}-${dtend.slice(6,8)}T00:00:00+08:00`);
  const cur = new Date(start);
  while (cur < end) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  if (dates.length === 0) dates.push(start.toISOString().slice(0, 10));
  return dates;
}

function inRange(dateStr, start, end) {
  return dateStr >= start && dateStr <= end;
}

async function main() {
  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));

  // 取得學期起訖日期
  const semStart = config.spring?.start ?? config.fall?.start;
  const semEnd   = config.fall?.end ?? config.spring?.end;
  if (!semStart || !semEnd) {
    throw new Error('semester-config.json 缺少 spring/fall 起訖日期');
  }

  // 收集需要查的年份
  const years = new Set([
    semStart.slice(0, 4),
    semEnd.slice(0, 4),
  ]);

  console.log(`抓取雲科行事曆，年份：${[...years].join('、')}`);

  const allEvents = [];
  for (const year of years) {
    console.log(`  fetching ${year}...`);
    const ics = await fetchICS(year);
    allEvents.push(...parseVEvents(ics));
  }

  // 過濾：關鍵字命中 + 在學期範圍內
  const holidayDates = new Set();
  const nameMap = {};

  for (const ev of allEvents) {
    if (!isNoClass(ev.summary)) continue;
    for (const date of expandDates(ev.dtstart, ev.dtend)) {
      if (inRange(date, semStart, semEnd)) {
        holidayDates.add(date);
        nameMap[date] = ev.summary;
      }
    }
  }

  const sorted = [...holidayDates].sort();
  config.schoolHolidays = sorted;
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, '\t'), 'utf-8');

  console.log(`\n找到 ${sorted.length} 個學校停課日：`);
  sorted.forEach(d => console.log(`  ${d}  ${nameMap[d]}`));
  console.log('\n已寫入 public/config/semester-config.json');
}

main().catch(err => { console.error(err.message); process.exit(1); });
