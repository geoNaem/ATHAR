'use client';

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

// ── App Components ───────────────────────────────────────────────
import UploadZone from '../../../components/analyze/UploadZone';
import ConfigurePanel from '../../../components/analyze/ConfigurePanel';
import ProcessingPanel from '../../../components/analyze/ProcessingPanel';
import ResultPreview from '../../../components/analyze/ResultPreview';
import ExportSelector from '../../../components/analyze/ExportSelector';

// ── Security & Utilities ──────────────────────────────────────────
import { ZeroRetentionGuard } from '../../../lib/zero-retention';
import { AnalysisResult } from '../../../types/analysis-result';

type AnalyzeState = 'upload' | 'configure' | 'processing' | 'result';

export default function AnalyzePage() {
  const [state, setState] = useState<AnalyzeState>('upload');
  
  // Data State (Strictly Managed)
  const [rawText, setRawText] = useState<string>('');
  const [filename, setFilename] = useState<string>('');
  const [lang, setLang] = useState<'en' | 'ar' | 'mixed'>('en');
  const [transcriptType, setType] = useState<'SSI' | 'FGD'>('SSI');
  
  // Config & Result
  const [config, setConfig] = useState<any>(null);
  const [analysisResult, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [isExportOpen, setExportOpen] = useState(false);

  // ── Step Handlers ───────────────────────────────────────────────
  
  const handleExtracted = (text: string, l: 'en' | 'ar' | 'mixed', name: string, type: 'SSI' | 'FGD') => {
    setRawText(text);
    setLang(l);
    setFilename(name);
    setType(type);
    setState('configure');
  };

  const handleConfigured = async (finalConfig: any) => {
    setConfig({ ...finalConfig, transcriptType });
    setError(null);
    setState('processing');
    
    // Security Action: Clear the React state buffer of the raw text 
    // after the API call is initiated. We keep a local copy for the 
    // duration of the fetch only.
    const textBuffer = rawText;
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textBuffer, config: { ...finalConfig, transcriptType } })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Server processing failed.');
      }

      const result = await response.json();
      setResult(result);
      setState('result');
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      // Clear sensitive text from memory immediately
      ZeroRetentionGuard.clearTextBuffer(setRawText);
    }
  };

  const resetAnalysis = () => {
    ZeroRetentionGuard.clearTextBuffer(setRawText);
    setResult(null);
    setConfig(null);
    setState('upload');
    setError(null);
  };

  const steps = [
    { id: 'upload', label: 'Upload' },
    { id: 'configure', label: 'Configure' },
    { id: 'processing', label: 'Analyze' },
    { id: 'result', label: 'Export' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === state);

  return (
    <div className="max-w-[1120px] mx-auto min-h-screen pb-40">
      
      {/* ── Header & Progress Bar ─────────────────────────────────── */}
      <div className="mb-12 sticky top-0 z-[50] bg-[#F5EDD9]/90 backdrop-blur-md pt-2 pb-8 border-b border-[#E8A87C]/10">
        <h1 className="font-serif text-3xl mb-12 text-[#2C1503]">Analyze Qualitative Data</h1>
        
        <div className="flex items-center gap-4 px-2">
          {steps.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isComplete = idx < currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-3 flex-1 relative">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 border-2 ${
                      isActive ? 'bg-[#C84B31] text-white border-[#C84B31] shadow-[0_0_20px_rgba(200,75,49,0.3)] ring-4 ring-[#C84B31]/10' :
                      isComplete ? 'bg-[#C84B31] text-white border-[#C84B31]' : 'bg-white text-[#E8A87C] border-[#E8A87C]/30'
                    }`}
                  >
                    {isComplete ? <Check size={18} strokeWidth={3} /> : idx + 1}
                  </div>
                  
                  <span className={`text-[10px] uppercase tracking-widest font-black ${isActive ? 'text-[#C84B31]' : 'text-[#E8A87C]'}`}>
                    {step.label}
                  </span>

                  {idx < steps.length - 1 && (
                    <div className="absolute top-5 left-[calc(50%+24px)] w-[calc(100%-48px)] h-[1.5px] bg-[#E8A87C]/20 rounded-full">
                      <div 
                        className="h-full bg-[#C84B31] transition-all duration-1000 ease-in-out"
                        style={{ width: isComplete ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Active Step Container ─────────────────────────────────── */}
      <div 
        className="transition-all duration-500 ease-out transform"
        style={{ opacity: 1, transform: 'translateY(0)' }}
        key={state}
      >
        {state === 'upload' && (
          <UploadZone onExtracted={handleExtracted} />
        )}

        {state === 'configure' && (
          <ConfigurePanel 
            transcriptType={transcriptType}
            detectedLanguage={lang}
            onConfigured={handleConfigured}
          />
        )}

        {state === 'processing' && (
          <ProcessingPanel 
            hasLogframe={!!config?.logframe}
            error={error}
            onRetry={() => handleConfigured(config)}
            onReset={resetAnalysis}
          />
        )}

        {state === 'result' && analysisResult && (
          <ResultPreview 
            result={analysisResult} 
            config={config} 
            onReset={resetAnalysis}
            onExport={() => setExportOpen(true)}
          />
        )}
      </div>

      {/* ── Modals & Overlays ─────────────────────────────────────── */}
      {isExportOpen && analysisResult && (
        <ExportSelector 
          result={analysisResult}
          config={config}
          detectedLanguage={lang}
          onClose={() => setExportOpen(false)}
        />
      )}

    </div>
  );
}
