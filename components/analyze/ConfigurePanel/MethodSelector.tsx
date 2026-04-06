'use client';

import React from 'react';
import styles from './ConfigurePanel.module.css';
import { MethodologyId } from '../../../types/methodology';

interface MethodSelectorProps {
  selected: MethodologyId | null;
  onSelect: (id: MethodologyId) => void;
}

const METHODS = [
  {
    id: 'thematic',
    label: "Thematic Analysis",
    tag: "WORD REPORT",
    desc: "Inductive coding — patterns across transcripts",
    tooltip: "Based on Braun & Clarke. Identifies, analyzes, and interprets patterns of meaning inductively from data. Best for: exploratory SSI/FGD analysis."
  },
  {
    id: 'framework',
    label: "Framework Analysis",
    tag: "EXCEL MATRIX",
    desc: "Deductive matrix — structured against indicators",
    tooltip: "Highly structured approach. Organizes data into a matrix against pre-defined domains. Ideal when you have logframe indicators to map findings against."
  },
  {
    id: 'grounded',
    label: "Grounded Theory Coding",
    tag: "CODING TREE",
    desc: "Open + axial + selective coding pipeline",
    tooltip: "Builds theory from data up. Applies open coding, then axial coding to find relationships, then selective coding to identify core categories."
  },
  {
    id: 'content',
    label: "Content Analysis",
    tag: "FREQUENCY TABLE",
    desc: "Frequency counting + category breakdowns",
    tooltip: "Counts and categorizes occurrences of concepts. Gives frequency data and pattern breakdowns for structured response data."
  },
  {
    id: 'auto',
    label: "Auto-detect",
    tag: "MIXED FORMAT",
    desc: "Athar selects the best method automatically",
    badge: "Not sure? Start here",
    tooltip: "Athar analyzes your transcript structure and selects the most appropriate methodology. Recommended for first-time users."
  }
];

export default function MethodSelector({ selected, onSelect }: MethodSelectorProps) {
  return (
    <div style={{ flex: 1 }}>
      <header style={{ marginBottom: '32px' }}>
        <h2 className="font-serif text-[#2C1503] text-2xl mb-2">Choose your methodology</h2>
        <p className="font-sans text-[#E8A87C] text-sm">Select the analytical framework for your data.</p>
      </header>

      <div className="space-y-3">
        {METHODS.map((m) => (
          <div 
            key={m.id} 
            className={`${styles.card} ${selected === m.id ? styles.selected : ''}`}
            onClick={() => onSelect(m.id as MethodologyId)}
          >
            {m.badge && (
              <span className="absolute top-[-10px] right-2 bg-[#C84B31] text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase z-10">
                {m.badge}
              </span>
            )}
            <div className={styles.header}>
              <span className="font-bold text-[#2C1503] text-sm">{m.label}</span>
              <span className={styles.tag}>{m.tag}</span>
            </div>
            <p className="text-[#E8A87C] text-xs mt-1">{m.desc}</p>
            
            <div className={styles.tooltip}>
              <p className="font-bold text-white mb-2">{m.label}</p>
              <p className="opacity-80 leading-snug">{m.tooltip}</p>
              <div className="mt-3 pt-3 border-t border-white/20 text-[11px] font-bold text-[#F5EDD9]">
                BEST FOR: {m.id === 'framework' ? 'EVALUATIONS/INDICATORS' : 'QUALITATIVE EXPLORATION'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
