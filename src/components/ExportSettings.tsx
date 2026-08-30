"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Settings, CalendarPlus, ChevronUp, ChevronDown } from 'lucide-react';
import { ExportSettings, TitleFieldConfig, CustomScheduleEvent } from '../utils/types';
import { yuntechTheme } from '../styles/theme';

interface Props {
  settings: ExportSettings;
  onSettingsChange: (s: ExportSettings) => void;
  customEvents: CustomScheduleEvent[];
  onCustomEventsChange: (events: CustomScheduleEvent[]) => void;
}

const DAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];
const ALARM_OPTIONS = [
  { label: '不提醒', value: null },
  { label: '5 分鐘前', value: 5 },
  { label: '10 分鐘前', value: 10 },
  { label: '15 分鐘前', value: 15 },
  { label: '30 分鐘前', value: 30 },
  { label: '1 小時前', value: 60 },
];
const COLOR_PRESETS = [
  { label: '雲科綠', value: '#009393' },
  { label: '藍', value: '#3B82F6' },
  { label: '綠', value: '#16A34A' },
  { label: '紅', value: '#EF4444' },
  { label: '紫', value: '#8B5CF6' },
  { label: '橙', value: '#F97316' },
  { label: '灰', value: '#6B7280' },
];

interface FormState {
  title: string;
  location: string;
  days: number[];
  startTime: string;
  endTime: string;
  repeat: 'weekly' | 'biweekly';
}

const defaultForm: FormState = {
  title: '',
  location: '',
  days: [],
  startTime: '08:00',
  endTime: '10:00',
  repeat: 'weekly',
};

const ExportSettingsPanel: React.FC<Props> = ({
  settings, onSettingsChange, customEvents, onCustomEventsChange,
}) => {
  const [form, setForm] = useState(defaultForm);
  const [formError, setFormError] = useState<string | null>(null);

  const updateSetting = <K extends keyof ExportSettings>(key: K, value: ExportSettings[K]) =>
    onSettingsChange({ ...settings, [key]: value });

  const toggleDay = (day: number) => {
    setForm(f => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter(d => d !== day) : [...f.days, day],
    }));
  };

  const addEvent = () => {
    if (!form.title.trim()) { setFormError('請輸入行程名稱'); return; }
    if (form.days.length === 0) { setFormError('請選擇至少一個星期'); return; }
    if (form.startTime >= form.endTime) { setFormError('結束時間需晚於開始時間'); return; }
    setFormError(null);
    onCustomEventsChange([
      ...customEvents,
      { ...form, id: `custom-${Date.now()}`, title: form.title.trim(), location: form.location.trim() },
    ]);
    setForm(defaultForm);
  };

  const removeEvent = (id: string) =>
    onCustomEventsChange(customEvents.filter(e => e.id !== id));

  const inputStyle: React.CSSProperties = {
    border: `1px solid ${yuntechTheme.gray[300]}`,
    borderRadius: '0.375rem',
    padding: '0.375rem 0.625rem',
    fontSize: '0.875rem',
    color: yuntechTheme.gray[800],
    backgroundColor: yuntechTheme.white,
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: yuntechTheme.gray[600],
    marginBottom: '0.375rem',
    display: 'block',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: yuntechTheme.white,
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: `1px solid ${yuntechTheme.gray[200]}`,
        marginBottom: '2rem',
        overflow: 'hidden',
      }}
    >
      {/* 匯出格式設定 */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${yuntechTheme.gray[200]}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Settings size={18} style={{ color: yuntechTheme.primary }} />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: yuntechTheme.primary }}>
            匯出格式設定
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          {/* 行事曆名稱 */}
          <div>
            <label style={labelStyle}>行事曆名稱</label>
            <input
              type="text"
              value={settings.calendarName}
              onChange={e => updateSetting('calendarName', e.target.value)}
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          {/* 課前提醒 */}
          <div>
            <label style={labelStyle}>課前提醒</label>
            <select
              value={settings.alarmMinutes ?? ''}
              onChange={e => updateSetting('alarmMinutes', e.target.value === '' ? null : Number(e.target.value))}
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', cursor: 'pointer' }}
            >
              {ALARM_OPTIONS.map(opt => (
                <option key={String(opt.value)} value={opt.value ?? ''}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 事件顏色 */}
          <div>
            <label style={labelStyle}>事件顏色</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center' }}>
              {COLOR_PRESETS.map(c => (
                <button
                  key={c.value}
                  title={c.label}
                  onClick={() => updateSetting('eventColor', c.value)}
                  style={{
                    width: 24, height: 24, borderRadius: '50%',
                    backgroundColor: c.value, border: 'none', cursor: 'pointer',
                    outline: settings.eventColor === c.value ? `3px solid ${yuntechTheme.gray[700]}` : '2px solid transparent',
                    outlineOffset: 1,
                  }}
                />
              ))}
              <input
                type="color"
                value={settings.eventColor}
                onChange={e => updateSetting('eventColor', e.target.value)}
                title="自訂顏色"
                style={{ width: 28, height: 28, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer', backgroundColor: 'transparent' }}
              />
            </div>
          </div>

          {/* 標題欄位 */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>行事曆標題欄位（可調整順序與顯示）</label>
            <TitleFieldEditor
              fields={settings.titleFields}
              onChange={fields => updateSetting('titleFields', fields)}
              primary={yuntechTheme.primary}
              gray={yuntechTheme.gray}
            />
          </div>
        </div>
      </div>

      {/* 自訂行程 */}
      <div style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <CalendarPlus size={18} style={{ color: yuntechTheme.primary }} />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: yuntechTheme.primary }}>
            自訂行程
          </h3>
          <span style={{ fontSize: '0.75rem', color: yuntechTheme.gray[500] }}>
            工讀、社課等週期性行程
          </span>
        </div>

        {/* 新增表單 */}
        <div style={{
          backgroundColor: yuntechTheme.gray[50],
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1rem',
          border: `1px solid ${yuntechTheme.gray[200]}`,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={labelStyle}>行程名稱 *</label>
              <input
                type="text"
                placeholder="例：工讀、社課"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={labelStyle}>地點</label>
              <input
                type="text"
                placeholder="（選填）"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* 星期 */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={labelStyle}>星期 *</label>
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              {[1,2,3,4,5,6,0].map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  style={{
                    width: 36, height: 36, borderRadius: '50%', fontSize: '0.875rem', fontWeight: 500,
                    border: `1px solid ${form.days.includes(day) ? yuntechTheme.primary : yuntechTheme.gray[300]}`,
                    backgroundColor: form.days.includes(day) ? yuntechTheme.primary : yuntechTheme.white,
                    color: form.days.includes(day) ? yuntechTheme.white : yuntechTheme.gray[700],
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {DAY_LABELS[day]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {/* 開始時間 */}
            <div>
              <label style={labelStyle}>開始時間</label>
              <input
                type="time"
                value={form.startTime}
                onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            {/* 結束時間 */}
            <div>
              <label style={labelStyle}>結束時間</label>
              <input
                type="time"
                value={form.endTime}
                onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            {/* 重複 */}
            <div>
              <label style={labelStyle}>重複方式</label>
              <select
                value={form.repeat}
                onChange={e => setForm(f => ({ ...f, repeat: e.target.value as 'weekly' | 'biweekly' }))}
                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', cursor: 'pointer' }}
              >
                <option value="weekly">每週</option>
                <option value="biweekly">隔週</option>
              </select>
            </div>
          </div>

          {formError && (
            <p style={{ fontSize: '0.8125rem', color: '#DC2626', marginBottom: '0.5rem' }}>{formError}</p>
          )}

          <button
            onClick={addEvent}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              backgroundColor: yuntechTheme.primary, color: yuntechTheme.white,
              border: 'none', borderRadius: '0.375rem',
              padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500,
              cursor: 'pointer',
            }}
            onMouseOver={e => { e.currentTarget.style.backgroundColor = yuntechTheme.secondary; }}
            onMouseOut={e => { e.currentTarget.style.backgroundColor = yuntechTheme.primary; }}
          >
            <Plus size={16} />
            新增行程
          </button>
        </div>

        {/* 已新增的行程列表 */}
        {customEvents.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {customEvents.map(ev => (
              <div key={ev.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.625rem 0.875rem',
                backgroundColor: yuntechTheme.ultraLight,
                borderRadius: '0.5rem',
                border: `1px solid ${yuntechTheme.gray[200]}`,
              }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: yuntechTheme.secondary }}>
                    {ev.title}
                  </span>
                  {ev.location && (
                    <span style={{ fontSize: '0.8rem', color: yuntechTheme.gray[500], marginLeft: '0.5rem' }}>
                      @ {ev.location}
                    </span>
                  )}
                  <span style={{ fontSize: '0.8rem', color: yuntechTheme.gray[600], marginLeft: '0.625rem' }}>
                    週{ev.days.map(d => DAY_LABELS[d]).join('、')}
                    　{ev.startTime}–{ev.endTime}
                    　{ev.repeat === 'weekly' ? '每週' : '隔週'}
                  </span>
                </div>
                <button
                  onClick={() => removeEvent(ev.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: yuntechTheme.gray[400], padding: '0.25rem',
                    borderRadius: '0.25rem', lineHeight: 1,
                  }}
                  onMouseOver={e => { e.currentTarget.style.color = '#DC2626'; }}
                  onMouseOut={e => { e.currentTarget.style.color = yuntechTheme.gray[400]; }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface TitleFieldEditorProps {
  fields: TitleFieldConfig[];
  onChange: (fields: TitleFieldConfig[]) => void;
  primary: string;
  gray: Record<number, string>;
}

const TitleFieldEditor: React.FC<TitleFieldEditorProps> = ({ fields, onChange, primary, gray }) => {
  const toggle = (i: number) => {
    const next = fields.map((f, idx) => idx === i ? { ...f, enabled: !f.enabled } : f);
    onChange(next);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= fields.length) return;
    const next = [...fields];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const FIELD_HINTS: Record<string, string> = {
    location: '教室位置',
    courseName: '課程名稱',
    className: '開課班級',
    teacher: '授課教師',
  };

  const preview = fields
    .filter(f => f.enabled)
    .map(f => f.field === 'location' ? '[教室]' : FIELD_HINTS[f.field])
    .join(' ');

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '0.5rem' }}>
        {fields.map((f, i) => (
          <div key={f.field} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.375rem 0.625rem',
            backgroundColor: f.enabled ? `${primary}15` : gray[50],
            borderRadius: '0.375rem',
            border: `1px solid ${f.enabled ? primary : gray[200]}`,
            transition: 'all 0.15s',
          }}>
            <input
              type="checkbox"
              checked={f.enabled}
              onChange={() => toggle(i)}
              style={{ accentColor: primary, cursor: 'pointer' }}
            />
            <span style={{ flex: 1, fontSize: '0.875rem', color: f.enabled ? primary : gray[500], fontWeight: f.enabled ? 600 : 400 }}>
              {f.label}
              <span style={{ fontWeight: 400, color: gray[400], marginLeft: '0.375rem', fontSize: '0.75rem' }}>
                ({FIELD_HINTS[f.field]})
              </span>
            </span>
            <button
              onClick={() => move(i, -1)} disabled={i === 0}
              style={{ background: 'none', border: 'none', cursor: i === 0 ? 'default' : 'pointer', color: i === 0 ? gray[300] : gray[500], padding: '0.125rem', lineHeight: 1 }}
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={() => move(i, 1)} disabled={i === fields.length - 1}
              style={{ background: 'none', border: 'none', cursor: i === fields.length - 1 ? 'default' : 'pointer', color: i === fields.length - 1 ? gray[300] : gray[500], padding: '0.125rem', lineHeight: 1 }}
            >
              <ChevronDown size={14} />
            </button>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.75rem', color: gray[500], margin: 0 }}>
        預覽：<span style={{ color: gray[700], fontWeight: 500 }}>{preview || '（無欄位）'}</span>
      </p>
    </div>
  );
};

export default ExportSettingsPanel;
