'use client';

import React, { useState } from 'react';
import styles from './ResultPreview.module.css';
import { ChevronDown, Quote, Minus } from 'lucide-react';

interface ThemeCardProps {
  theme: {
    id: string;
    name: string;
    description: string;
    frequency: number;
    quotes: string[];
    sub_themes: Array<{ name: string; description: string }>;
  };
  initiallyExpanded?: boolean;
}

export default function ThemeCard({ theme, initiallyExpanded = false }: ThemeCardProps) {
  const [isExpanded, setExpanded] = useState(initiallyExpanded);

  return (
    <div className={styles.themeCard}>
      <div 
        className={styles.themeHeader}
        onClick={() => setExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <span className="font-serif text-[#2C1503] font-bold text-lg">{theme.name}</span>
          <span className="mono text-[#C84B31] text-xs font-bold px-2 py-1 bg-[#C84B31]/5 rounded">
            ×{theme.frequency}
          </span>
        </div>
        <ChevronDown 
          size={20} 
          className={`text-[#E8A87C] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>

      {isExpanded && (
        <div className={styles.themeBody}>
          <p className="text-[#2C1503] text-sm leading-relaxed mb-8">
            {theme.description}
          </p>

          {/* Sub-themes if present */}
          {theme.sub_themes && theme.sub_themes.length > 0 && (
            <div className="mb-8">
              <label className="label text-[#E8A87C] text-[10px] uppercase tracking-widest mb-4 block underline">
                Sub-themes
              </label>
              <div className="space-y-4">
                {theme.sub_themes.map((sub, i) => (
                  <div key={i} className="flex gap-3">
                    <Minus size={14} className="text-[#C84B31] mt-1 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#2C1503]">{sub.name}</div>
                      <div className="text-[11px] text-[#E8A87C] italic">{sub.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Representative Quotes */}
          {theme.quotes && theme.quotes.length > 0 && (
            <div>
              <label className="label text-[#E8A87C] text-[10px] uppercase tracking-widest mb-4 block underline">
                Representative Quotes
              </label>
              <div className="space-y-4">
                {theme.quotes.map((quote, i) => (
                  <div key={i} className="border-l-2 border-[#C84B31] pl-4 py-1">
                    <p className="text-sm italic text-[#2C1503] mb-1">"{quote}"</p>
                    <span className="text-[10px] text-[#E8A87C] font-bold">
                       — Participant, Qualitative Transcript
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
