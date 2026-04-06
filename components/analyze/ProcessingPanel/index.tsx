'use client';

import React, { useState, useEffect } from 'react';
import styles from './ProcessingPanel.module.css';
import { Shield, AlertCircle, RefreshCw } from 'lucide-react';

interface ProcessingPanelProps {
  hasLogframe: boolean;
  error?: string | null;
  onRetry: () => void;
  onReset: () => void;
}

const STAGES = [
  { id: 1, label: 'Reading transcript structure...', delay: 0 },
  { id: 2, label: 'Identifying themes and patterns...', delay: 3000 },
  { id: 3, label: 'Extracting representative quotes...', delay: 8000 },
  { id: 4, label: 'Assessing logframe alignment...', delay: 14000, condition: 'hasLogframe' },
  { id: 5, label: 'Generating analysis report...', delay: 18000 }
];

export default function ProcessingPanel({ 
  hasLogframe, 
  error, 
  onRetry, 
  onReset 
}: ProcessingPanelProps) {
  const [activeStep, setStep] = useState(1);
  const [visibleSteps, setVisibleSteps] = useState([1]);

  useEffect(() => {
    if (error) return;

    const timers = STAGES.map((stage) => {
      if (stage.id === 1) return null; // First stage always visible
      
      // Filter out logframe if not provided
      if (stage.condition === 'hasLogframe' && !hasLogframe) return null;

      return setTimeout(() => {
        setVisibleSteps(prev => [...prev, stage.id]);
        setStep(stage.id);
      }, stage.delay);
    });

    return () => timers.forEach(t => t && clearTimeout(t));
  }, [hasLogframe, error]);

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <AlertCircle size={48} className="text-[#CC0000] mx-auto mb-6" />
          <h2 className="font-serif text-[#2C1503] text-2xl mb-4">Analysis Failed</h2>
          <p className="text-[#2C1503] text-sm mb-12">{error}</p>
          <div className="flex flex-col gap-4 items-center">
            <button 
              className="btn btn-primary" 
              style={{ width: '240px' }}
              onClick={onRetry}
            >
              <RefreshCw size={18} className="mr-2" />
              Retry analysis
            </button>
            <button 
              className="text-[#E8A87C] text-sm font-bold underline"
              onClick={onReset}
            >
              Change configuration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      
      {/* Athar Pulsing Icon */}
      <div className={styles.icon}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#C84B31"/>
          <path d="M12 6L6 18H18L12 6Z" fill="#F5EDD9"/>
          <circle cx="12" cy="14" r="2" fill="#C84B31"/>
        </svg>
      </div>

      <header>
        <h2 className="font-serif text-[#2C1503] text-2xl mb-2">Analyzing your data</h2>
        <p className="text-[#E8A87C] text-sm">
          This takes 15–45 seconds depending on transcript length.
        </p>
      </header>

      {/* Sequential Processing Steps */}
      <div className={styles.steps}>
        {STAGES.map((stage) => {
          if (stage.condition === 'hasLogframe' && !hasLogframe) return null;
          
          const isVisible = visibleSteps.includes(stage.id);
          const isActive = activeStep === stage.id;
          
          if (!isVisible) return null;

          return (
            <div key={stage.id} className={styles.step}>
              <div className={`${styles.dot} ${isActive ? styles.active : ''}`} />
              <span className={`transition-colors duration-300 ${isActive ? 'text-[#2C1503] font-bold' : 'text-[#E8A87C]'}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.notice}>
        <Shield size={14} className="text-[#C84B31] mr-1" />
        Your file has been cleared from memory. Analysis runs on extracted text only.
      </div>

    </div>
  );
}
