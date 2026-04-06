'use client';

import React, { useState } from 'react';
import styles from './ExportSelector.module.css';
import { FileText, Table, BarChart2, Check, Loader2, X } from 'lucide-react';

interface ExportSelectorProps {
  result: any;
  config: any;
  detectedLanguage: 'en' | 'ar' | 'mixed';
  onClose: () => void;
}

type Format = 'word' | 'excel' | 'pdf';
type ExportState = 'idle' | 'generating' | 'done' | 'error';

export default function ExportSelector({ result, config, detectedLanguage, onClose }: ExportSelectorProps) {
  const [outputLanguage, setOutLang] = useState<'en' | 'ar'>(detectedLanguage === 'ar' ? 'ar' : 'en');
  const [donorPreset, setDonor] = useState<string>(config.donorPreset || 'Generic');
  
  const [states, setStates] = useState<Record<Format, ExportState>>({
    word: 'idle',
    excel: 'idle',
    pdf: 'idle'
  });

  const handleDownload = async (format: Format) => {
    setStates(prev => ({ ...prev, [format]: 'generating' }));
    
    try {
      // API call placeholder for document generation
      const endpoint = format === 'word' ? '/api/export/word' : (format === 'excel' ? '/api/export/excel' : '/api/export/infographic');
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          result, 
          language: outputLanguage,
          donorPreset: format === 'word' ? donorPreset : undefined
        })
      });

      if (!response.ok) throw new Error('Download failed');

      // Trigger browser download via blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Athar_Analysis_${result.methodology.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${format === 'word' ? 'docx' : format === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      setStates(prev => ({ ...prev, [format]: 'done' }));
      setTimeout(() => setStates(prev => ({ ...prev, [format]: 'idle' })), 3000);
      
    } catch (err) {
      console.error(err);
      setStates(prev => ({ ...prev, [format]: 'error' }));
      setTimeout(() => setStates(prev => ({ ...prev, [format]: 'idle' })), 4000);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>
          <X size={24} />
        </button>

        <header className="mb-12">
          <h2 className="font-serif text-[#2C1503] text-2xl mb-2">Download your analysis</h2>
          <p className="text-[#E8A87C] text-sm italic">High-fidelity formats optimized for donor reporting.</p>
        </header>

        {/* 1. Language Toggle */}
        {detectedLanguage !== 'en' && (
          <div className="mb-12">
            <label className="text-[10px] font-bold text-[#E8A87C] uppercase tracking-widest block mb-4">Report Language</label>
            <div className={styles.pillGroup}>
              <button 
                className={`${styles.pill} ${outputLanguage === 'en' ? styles.active : ''}`}
                onClick={() => setOutLang('en')}
              >
                English Report
              </button>
              <button 
                className={`${styles.pill} ${outputLanguage === 'ar' ? styles.active : ''}`}
                onClick={() => setOutLang('ar')}
              >
                تقرير بالعربية
              </button>
            </div>
          </div>
        )}

        {/* 2. Format Grid */}
        <div className={styles.grid}>
          {/* WORD CARD */}
          <div className={styles.card}>
            <span className={styles.tag}>.docx</span>
            <FileText size={28} className={styles.cardIcon} />
            <h3 className="font-bold text-[#2C1503] mb-2">Word Report</h3>
            <p className="text-[#E8A87C] text-xs leading-5 mb-8">
               Narrative analysis with themes, quotes, and recommendations. Donor-ready format.
            </p>
            {donorPreset !== 'Generic' && (
              <div className={styles.donorBadge}>{donorPreset} format applied</div>
            )}
            <button 
              className={styles.btn} 
              disabled={states.word !== 'idle'}
              onClick={() => handleDownload('word')}
            >
              {states.word === 'idle' ? 'Download Report' : 
               states.word === 'generating' ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : 
               states.word === 'done' ? <><Check size={16} /> Downloaded</> : 'Retry Download'}
            </button>
          </div>

          {/* EXCEL CARD */}
          <div className={styles.card}>
            <span className={styles.tag}>.xlsx</span>
            <Table size={28} className={styles.cardIcon} />
            <h3 className="font-bold text-[#2C1503] mb-2">Excel Matrix</h3>
            <p className="text-[#E8A87C] text-xs leading-5 mb-8">
               Structured coding table with frequency data and logframe alignment.
            </p>
            <button 
              className={styles.btn} 
              disabled={states.excel !== 'idle'}
              onClick={() => handleDownload('excel')}
            >
              {states.excel === 'idle' ? 'Download Matrix' : 
               states.excel === 'generating' ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : 
               states.excel === 'done' ? <><Check size={16} /> Downloaded</> : 'Retry Download'}
            </button>
          </div>

          {/* PDF CARD */}
          <div className={styles.card}>
            <span className={styles.tag}>.pdf</span>
            <BarChart2 size={28} className={styles.cardIcon} />
            <h3 className="font-bold text-[#2C1503] mb-2">Visual Summary</h3>
            <p className="text-[#E8A87C] text-xs leading-5 mb-8">
               One-page PDF infographic. Print-ready A4 with top themes and key findings.
            </p>
            <button 
              className={styles.btn} 
              disabled={states.pdf !== 'idle'}
              onClick={() => handleDownload('pdf')}
            >
              {states.pdf === 'idle' ? 'Download PDF' : 
               states.pdf === 'generating' ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : 
               states.pdf === 'done' ? <><Check size={16} /> Downloaded</> : 'Retry Download'}
            </button>
          </div>
        </div>

        {/* 3. Donor Selection Row */}
        <div className="mt-12 pt-8 border-t border-[#E8A87C]/20">
          <div className="flex justify-between items-end mb-4">
             <label className="text-[10px] font-bold text-[#E8A87C] uppercase tracking-widest block">Donor Format Template</label>
             <span className="text-[9px] text-[#E8A87C] italic">Affects Word report structure only</span>
          </div>
          <div className={styles.pillGroup}>
            {['Generic', 'GIZ', 'USAID', 'EU'].map(d => (
              <button 
                key={d} 
                className={`${styles.pill} ${donorPreset === d ? styles.active : ''}`}
                onClick={() => setDonor(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
