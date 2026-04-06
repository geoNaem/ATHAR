'use client';

import React from 'react';
import { Info } from 'lucide-react';
import styles from './configure.module.css';

interface ContextPanelProps {
  sector: string;
  onSectorChange: (val: string) => void;
  logframe: string;
  onLogframeChange: (val: string) => void;
  donorPreset: string;
  onDonorChange: (val: string) => void;
  outputLanguage: 'en' | 'ar';
  onLangChange: (val: 'en' | 'ar') => void;
  detectedLanguage: 'en' | 'ar' | 'mixed';
}

const SECTORS = [
  'Health', 'Livelihoods', 'Protection', 'WASH', 'Education', 
  'Food Security', 'Shelter', 'GBV', 'Cash & Vouchers', 
  'Multi-sector', 'Other'
];

const DONORS = ['Generic', 'GIZ', 'USAID', 'EU'];

export default function ContextPanel({
  sector, onSectorChange,
  logframe, onLogframeChange,
  donorPreset, onDonorChange,
  outputLanguage, onLangChange,
  detectedLanguage
}: ContextPanelProps) {
  return (
    <div className={styles.panel} style={{ flex: 1 }}>
      <header className="mb-6">
        <h3 className="font-sans text-[#2C1503] font-bold text-lg mb-1">Analysis context</h3>
        <p className="text-[#E8A87C] text-sm italic">Optional — improves output quality</p>
      </header>

      {/* Sector Selection */}
      <div className="mb-8">
        <label className="label text-[#2C1503] mb-2 block font-bold text-xs uppercase tracking-wider">Humanitarian Sector</label>
        <select 
          className={styles.select}
          value={sector}
          onChange={(e) => onSectorChange(e.target.value)}
        >
          <option value="">Select a sector...</option>
          {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Logframe indicators */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
           <label className="label text-[#2C1503] block font-bold text-xs uppercase tracking-wider">Logframe Indicators</label>
           <span className="text-[10px] text-[#E8A87C] italic mb-1">
             Paste indicators to align themes to your project results
           </span>
        </div>
        <textarea 
          className={styles.textarea}
          rows={6}
          placeholder="e.g. % of women reporting improved food security (baseline 20%, target 60%)

Add one indicator per line."
          value={logframe}
          onChange={(e) => onLogframeChange(e.target.value)}
        />
        <div className="text-right text-[10px] text-[#E8A87C] mt-2 mono">
          {logframe.length} / 2000 characters
        </div>
      </div>

      {/* Donor Pre-set Toggle */}
      <div className="mb-8">
        <label className="label text-[#2C1503] font-bold text-xs uppercase tracking-wider mb-2">Donor Format Preset</label>
        <div className={styles.pillGroup}>
          {DONORS.map((d) => (
            <button
              key={d}
              className={`${styles.pill} ${donorPreset === d ? styles.active : ''}`}
              onClick={() => onDonorChange(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Output Language Toggle (Only if detected is not just English) */}
      {detectedLanguage !== 'en' && (
        <div className="mb-8 p-6 bg-[#F5EDD9]/30 rounded-lg border border-[#E8A87C]/20">
          <label className="label text-[#2C1503] font-bold text-xs uppercase tracking-wider mb-2">Report Language</label>
          <div className={styles.pillGroup}>
            <button
              className={`${styles.pill} ${outputLanguage === 'en' ? styles.active : ''}`}
              onClick={() => onLangChange('en')}
            >
              English
            </button>
            <button
              className={`${styles.pill} ${outputLanguage === 'ar' ? styles.active : ''}`}
              onClick={() => onLangChange('ar')}
            >
              تقرير بالعربية
            </button>
          </div>
        </div>
      )}

      {/* Data Security Re-assurance */}
      <div className="flex gap-2 p-4 bg-[#F5EDD9]/50 rounded-md border border-[#E8A87C]/30 text-xs text-[#E8A87C] italic items-start">
        <Info size={14} className="mt-0.5 text-[#C84B31]" />
        Your analysis context is used once during the processing session and never improving any AI models.
      </div>
    </div>
  );
}
