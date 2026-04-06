'use client';

import React from 'react';
import styles from './ResultPreview.module.css';

interface LogframeTableProps {
  alignment: Array<{
    indicator: string;
    aligned_theme: string;
    evidence_strength: 'Strong' | 'Moderate' | 'Weak' | 'Not found';
  }>;
}

export default function LogframeTable({ alignment }: LogframeTableProps) {
  if (alignment.length === 0) {
    return (
      <div className="text-center py-20 bg-white border-2 border-dashed border-[#E8A87C] rounded-lg">
        <h3 className="font-serif text-[#2C1503] text-xl mb-4">No logframe provided.</h3>
        <p className="text-[#E8A87C] text-sm">Include your project indicators in step 2 to see alignment data.</p>
      </div>
    );
  }

  const getStrengthStyle = (strength: string) => {
    switch (strength) {
      case 'Strong': return { bg: '#EAF3DE', text: '#3B6D11', border: '#C0DD97' };
      case 'Moderate': return { bg: '#FAEEDA', text: '#854F0B', border: '#FAC775' };
      case 'Weak': return { bg: '#F1EFE8', text: '#5F5E5A', border: '#D3D1C7' };
      case 'Not found': return { bg: '#FCEBEB', text: '#791F1F', border: '#F7C1C1' };
      default: return { bg: '#FFFFFF', text: '#2C1503', border: '#E8A87C' };
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className={styles.table}>
        <thead>
          <tr>
            <th className="w-1/2">Indicator</th>
            <th>Aligned Theme</th>
            <th>Evidence Strength</th>
          </tr>
        </thead>
        <tbody>
          {alignment.map((row, idx) => {
            const style = getStrengthStyle(row.evidence_strength);
            return (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F5EDD9]/10'}>
                <td className="text-sm font-bold text-[#2C1503]">{row.indicator}</td>
                <td className="text-sm text-[#2C1503]">{row.aligned_theme}</td>
                <td>
                  <span 
                    className={styles.badge}
                    style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}
                  >
                    {row.evidence_strength}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
