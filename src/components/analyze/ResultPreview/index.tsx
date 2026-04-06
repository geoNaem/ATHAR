'use client';

import React, { useState } from 'react';
import styles from './ResultPreview.module.css';
import { AnalysisResult } from '@/types/analysis-result';
import ThemeCard from './ThemeCard';
import LogframeTable from './LogframeTable';
import FindingsList from './FindingsList';
import { Shield, FileText, Table, BarChart2, Hash, Code, LayoutDashboard } from 'lucide-react';

interface ResultPreviewProps {
  result: AnalysisResult;
  config: any;
  onReset: () => void;
  onExport: (format: 'word' | 'excel' | 'pdf') => void;
}

export default function ResultPreview({ result, config, onReset, onExport }: ResultPreviewProps) {
  const [activeTab, setTab] = useState<'themes' | 'findings' | 'logframe' | 'raw'>('themes');

  return (
    <div className={styles.container}>
      
      {/* 1. Sticky Summary Bar */}
      <div className={styles.stickySummary}>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-[#C84B31] px-3 py-1.5 rounded-sm text-white mono text-[10px] font-bold uppercase">
            <Hash size={12} /> {result.methodology}
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#E8A87C]/40 px-3 py-1.5 rounded-sm text-[#2C1503] mono text-[10px] font-bold">
             {result.sector}
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#E8A87C]/40 px-3 py-1.5 rounded-sm text-[#2C1503] mono text-[10px] font-bold">
             {result.transcript_type}
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#E8A87C]/40 px-3 py-1.5 rounded-sm text-[#E8A87C] mono text-[10px] font-bold">
             ~{result.word_count_analyzed?.toLocaleString()} words
          </div>
        </div>
        
        <button 
          className="flex items-center gap-2 text-xs font-bold text-[#E8A87C] hover:text-[#C84B31] transition-colors"
          onClick={onReset}
        >
          <LayoutDashboard size={14} />
          New analysis
        </button>
      </div>

      {/* 2. Tabbed Navigation */}
      <div className={styles.tabBar}>
        {[
          { id: 'themes', label: 'THEMES', icon: FileText },
          { id: 'findings', label: 'KEY FINDINGS', icon: BarChart2 },
          { id: 'logframe', label: 'LOGFRAME', icon: Table },
          { id: 'raw', label: 'RAW JSON', icon: Code }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setTab(tab.id as any)}
          >
            <div className="flex items-center justify-center gap-2">
              <tab.icon size={16} />
              <span className="text-[11px] tracking-widest">{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* 3. Section Content */}
      <div className={styles.section}>
        {activeTab === 'themes' && (
          <div className="space-y-6">
            {result.themes.map((theme, i) => (
              <ThemeCard key={theme.name} theme={theme} initiallyExpanded={i === 0} />
            ))}
          </div>
        )}

        {activeTab === 'findings' && (
          <FindingsList 
            findings={result.key_findings} 
            recommendations={result.recommendations} 
            gaps={result.gaps_and_limitations} 
          />
        )}

        {activeTab === 'logframe' && (
          <LogframeTable alignment={result.logframe_alignment} />
        )}

        {activeTab === 'raw' && (
          <div className="relative">
             <pre className="bg-[#2C1503] text-[#E8A87C] p-8 rounded-lg overflow-x-auto mono text-xs leading-relaxed max-h-[100dvh]">
               {JSON.stringify(result, null, 2)}
             </pre>
             <button 
               className="absolute top-4 right-4 bg-[#C84B31] text-white px-3 py-1.5 font-bold text-[10px] rounded hover:brightness-110"
               onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
             >
               COPY JSON
             </button>
          </div>
        )}
      </div>

      {/* 4. Confidence Note */}
      <div className="mt-12 p-6 border-l-4 border-[#C84B31] bg-white text-sm text-[#E8A87C] italic italic flex items-start gap-4">
        <Shield size={20} className="shrink-0 text-[#C84B31]" />
        <p>{result.confidence_note}</p>
      </div>

      {/* 5. Sticky Export Floor */}
      <div className={styles.stickyExport}>
        <div>
          <h4 className="font-sans font-bold text-[#2C1503] text-sm mb-1">Ready to export</h4>
          <p className="text-[#E8A87C] text-[11px] italic">Donor-ready reports generated from this analysis run.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '13px' }} onClick={() => onExport('word')}>
            <FileText size={16} className="mr-2" /> Download Word Report
          </button>
          <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '13px' }} onClick={() => onExport('excel')}>
            <Table size={16} className="mr-2" /> Download Excel Matrix
          </button>
          <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '13px' }} onClick={() => onExport('pdf')}>
            <BarChart2 size={16} className="mr-2" /> Download Infographic
          </button>
        </div>
      </div>

    </div>
  );
}
