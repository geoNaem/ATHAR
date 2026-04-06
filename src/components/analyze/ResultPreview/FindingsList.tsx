'use client';

import React from 'react';
import styles from './ResultPreview.module.css';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface FindingsListProps {
  findings: string[];
  recommendations: string[];
  gaps: string[];
}

export default function FindingsList({ findings, recommendations, gaps }: FindingsListProps) {
  return (
    <div className="space-y-12">
      
      {/* 1. Key Findings */}
      <section>
        <h3 className="font-serif text-2xl text-[#2C1503] mb-8">Key Findings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {findings.map((f, i) => (
            <div key={i} className="flex gap-4 p-6 bg-white border border-[#E8A87C]/20 rounded-lg">
              <span className={styles.findingNumber}>0{i+1}</span>
              <p className="text-sm font-medium text-[#2C1503] pt-2">{f}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-[#E8A87C]/20" />

      {/* 2. Recommendations */}
      <section>
        <h3 className="font-serif text-2xl text-[#2C1503] mb-8">Recommendations</h3>
        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((r, i) => (
            <div key={i} className="flex items-center gap-4 bg-[#C84B31]/5 p-4 border-l-4 border-[#C84B31]">
              <ArrowRight size={18} className="text-[#C84B31]" />
              <p className="text-sm font-bold text-[#2C1503]">{r}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-[#E8A87C]/20" />

      {/* 3. Gaps & Limitations */}
      <section>
        <h3 className="font-serif text-2xl text-[#2C1503] mb-8">Gaps & Limitations</h3>
        <div className="space-y-3">
          {gaps.map((g, i) => (
            <div key={i} className="flex gap-3 text-[#E8A87C]">
              <AlertCircle size={16} className="shrink-0 mt-1" />
              <p className="text-sm italic">{g}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
