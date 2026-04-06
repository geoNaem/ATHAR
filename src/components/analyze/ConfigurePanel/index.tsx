'use client';

import React, { useState } from 'react';
import styles from './ConfigurePanel.module.css';
import MethodSelector from './MethodSelector';
import ContextPanel from './ContextPanel';
import { MethodologyId } from '../../../types/methodology';
import { ArrowRight } from 'lucide-react';

interface AnalysisConfig {
  methodology: MethodologyId;
  sector: string;
  logframe: string;
  donorPreset: string;
  outputLanguage: 'en' | 'ar';
}

interface ConfigurePanelProps {
  transcriptType: 'SSI' | 'FGD';
  detectedLanguage: 'en' | 'ar' | 'mixed';
  onConfigured: (config: AnalysisConfig) => void;
}

export default function ConfigurePanel({ 
  transcriptType, 
  detectedLanguage, 
  onConfigured 
}: ConfigurePanelProps) {
  const [method, setMethod] = useState<MethodologyId | null>(null);
  const [sector, setSector] = useState<string>('');
  const [logframe, setLogframe] = useState<string>('');
  const [donor, setDonor] = useState<string>('Generic');
  const [outLang, setOutLang] = useState<'en' | 'ar'>('en');

  const isValid = method && sector;

  return (
    <div className={styles.layout}>
      
      {/* 1. Methodology Selection Column */}
      <MethodSelector 
        selected={method} 
        onSelect={setMethod} 
      />

      {/* 2. Contextual Configuration Column */}
      <ContextPanel 
        sector={sector}
        onSectorChange={setSector}
        logframe={logframe}
        onLogframeChange={setLogframe}
        donorPreset={donor}
        onDonorChange={setDonor}
        outputLanguage={outLang}
        onLangChange={setOutLang}
        detectedLanguage={detectedLanguage}
      />

      {/* 3. Bottom Action Logic / Proceed */}
      <div className={styles.proceedContainer}>
        <div className="mb-4">
          <p className="text-[#E8A87C] text-xs font-medium uppercase tracking-[0.05em]">
            Step 2 of 4: Configuration Complete
          </p>
          {method && sector && (
            <div className="mt-2 text-[#2C1503] font-bold text-sm">
              Using: {method.charAt(0).toUpperCase() + method.slice(1)} Analysis · {sector} Sector
            </div>
          )}
        </div>
        
        <button 
          className={styles.proceedBtn}
          disabled={!isValid}
          onClick={() => onConfigured({
            methodology: method as MethodologyId,
            sector,
            logframe,
            donorPreset: donor,
            outputLanguage: outLang
          })}
        >
          <div className="flex items-center justify-center gap-3">
             <span className="text-lg">Run analysis</span>
             <ArrowRight size={20} />
          </div>
        </button>
        
        <div className="mt-4 italic opacity-80 text-[10px] text-[#E8A87C]">
          Estimated processing time: 15–45 seconds. No data is retained after analysis.
        </div>
      </div>
    </div>
  );
}
