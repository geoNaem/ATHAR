import React, { useState } from 'react';
import styles from './index.module.css';
import type { AnalysisResult } from '../../types/analysis-result';
import type { DonorPresetId } from '../../lib/exporters/donor-presets';

// Client-side download trigger — calls the builder directly in-browser
// (Vite SPA: exporters must run client-side. API routes are Next.js stubs for future migration.)
import { Packer } from 'docx';
import { buildThematicDocument } from '../../lib/exporters/report-structures/thematic';
import { buildIndicatorLedDocument } from '../../lib/exporters/report-structures/indicator-led';
import { buildExcelExport } from '../../lib/exporters/excel-exporter';
import { getDonorPreset } from '../../lib/exporters/donor-presets';

// PDF: react-pdf is Node-only, so we POST to the API route when running as Next.js.
// In Vite SPA dev mode, PDF download falls back to the /api/export/infographic route
// (which requires Next.js to be running). Show a notice in Vite dev mode.
import { prepareInfographicData } from '../../lib/exporters/infographic-builder';

// Lucide icons
import { FileText, Sheet, Image, Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ExportSelectorProps {
  result: AnalysisResult;
}

type ExportFormat = 'word' | 'excel' | 'infographic';
type ExportStatus = 'idle' | 'loading' | 'success' | 'error';

const FORMAT_CONFIG = {
  word: {
    icon: FileText,
    label: 'Word Report',
    sublabel: '.docx',
    description: 'Full structured report ready for donor submission',
  },
  excel: {
    icon: Sheet,
    label: 'Coding Matrix',
    sublabel: '.xlsx',
    description: '4-sheet workbook: matrix, frequencies, logframe, metadata',
  },
  infographic: {
    icon: Image,
    label: 'Summary Infographic',
    sublabel: '.pdf',
    description: 'One-page visual summary for presentations and briefs',
  },
} as const;

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

export default function ExportSelector({ result }: ExportSelectorProps) {
  const [structure, setStructure] = useState<'thematic' | 'indicator-led'>('thematic');
  const [donorPreset, setDonorPreset] = useState<DonorPresetId>('generic');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [orgName, setOrgName] = useState('');
  const [projectName, setProjectName] = useState('');

  const [statuses, setStatuses] = useState<Record<ExportFormat, ExportStatus>>({
    word: 'idle',
    excel: 'idle',
    infographic: 'idle',
  });

  const setStatus = (format: ExportFormat, status: ExportStatus) => {
    setStatuses(prev => ({ ...prev, [format]: status }));
  };

  const dateSlug = new Date().toISOString().slice(0, 10);

  const downloadWord = async () => {
    setStatus('word', 'loading');
    try {
      const preset = getDonorPreset(donorPreset);
      const doc =
        structure === 'indicator-led'
          ? buildIndicatorLedDocument(result, preset, orgName, projectName)
          : buildThematicDocument(result, preset, orgName, projectName);

      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      triggerBlobDownload(blob, `athar-analysis-${dateSlug}.docx`);
      setStatus('word', 'success');
      setTimeout(() => setStatus('word', 'idle'), 3000);
    } catch {
      setStatus('word', 'error');
      setTimeout(() => setStatus('word', 'idle'), 4000);
    }
  };

  const downloadExcel = async () => {
    setStatus('excel', 'loading');
    try {
      const buffer = await buildExcelExport(result, language);
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      triggerBlobDownload(blob, `athar-analysis-${dateSlug}.xlsx`);
      setStatus('excel', 'success');
      setTimeout(() => setStatus('excel', 'idle'), 3000);
    } catch {
      setStatus('excel', 'error');
      setTimeout(() => setStatus('excel', 'idle'), 4000);
    }
  };

  const downloadInfographic = async () => {
    setStatus('infographic', 'loading');
    try {
      // POST to API route (works in Next.js; in Vite dev, requires separate Next.js process)
      const res = await fetch('/api/export/infographic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result, language }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const arrayBuffer = await res.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      triggerBlobDownload(blob, `athar-infographic-${dateSlug}.pdf`);
      setStatus('infographic', 'success');
      setTimeout(() => setStatus('infographic', 'idle'), 3000);
    } catch {
      setStatus('infographic', 'error');
      setTimeout(() => setStatus('infographic', 'idle'), 4000);
    }
  };

  const handlers: Record<ExportFormat, () => void> = {
    word: downloadWord,
    excel: downloadExcel,
    infographic: downloadInfographic,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Export Analysis</h2>
        <p className={styles.subtitle}>
          Configure your report, then download in one click. Nothing is stored.
        </p>
      </div>

      {/* ── Configuration Panel ── */}
      <div className={styles.configPanel}>
        <div className={styles.configGrid}>
          <div className={styles.configField}>
            <label className={styles.label} htmlFor="export-structure">Report Structure</label>
            <select
              id="export-structure"
              className={styles.select}
              value={structure}
              onChange={e => setStructure(e.target.value as 'thematic' | 'indicator-led')}
            >
              <option value="thematic">Thematic (SSI/FGD Analysis)</option>
              <option value="indicator-led">Indicator-Led (Logframe-Aligned)</option>
            </select>
          </div>

          <div className={styles.configField}>
            <label className={styles.label} htmlFor="export-donor">Donor Format</label>
            <select
              id="export-donor"
              className={styles.select}
              value={donorPreset}
              onChange={e => setDonorPreset(e.target.value as DonorPresetId)}
            >
              <option value="generic">Generic</option>
              <option value="giz">GIZ</option>
              <option value="usaid">USAID</option>
              <option value="eu">European Union</option>
            </select>
          </div>

          <div className={styles.configField}>
            <label className={styles.label} htmlFor="export-lang">Language</label>
            <select
              id="export-lang"
              className={styles.select}
              value={language}
              onChange={e => setLanguage(e.target.value as 'en' | 'ar')}
            >
              <option value="en">English</option>
              <option value="ar">Arabic (RTL)</option>
            </select>
          </div>

          <div className={styles.configField}>
            <label className={styles.label} htmlFor="export-org">Organization Name</label>
            <input
              id="export-org"
              type="text"
              className={styles.input}
              placeholder="Your organization..."
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
            />
          </div>

          <div className={styles.configField}>
            <label className={styles.label} htmlFor="export-project">Project Name</label>
            <input
              id="export-project"
              type="text"
              className={styles.input}
              placeholder="Project or program name..."
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Format Cards ── */}
      <div className={styles.formatGrid}>
        {(Object.keys(FORMAT_CONFIG) as ExportFormat[]).map(format => {
          const config = FORMAT_CONFIG[format];
          const status = statuses[format];
          const Icon = config.icon;

          return (
            <div key={format} className={styles.formatCard}>
              <div className={styles.formatHeader}>
                <Icon className={styles.formatIcon} />
                <div>
                  <div className={styles.formatLabel}>{config.label}</div>
                  <div className={styles.formatTag}>{config.sublabel}</div>
                </div>
              </div>
              <p className={styles.formatDesc}>{config.description}</p>

              <button
                className={`${styles.downloadBtn} ${status === 'success' ? styles.downloadBtnSuccess : ''} ${status === 'error' ? styles.downloadBtnError : ''}`}
                onClick={handlers[format]}
                disabled={status === 'loading'}
                aria-label={`Download ${config.label}`}
              >
                {status === 'idle' && <><Download className={styles.btnIcon} /> Download {config.label}</>}
                {status === 'loading' && <><Loader2 className={`${styles.btnIcon} ${styles.spinning}`} /> Generating...</>}
                {status === 'success' && <><CheckCircle2 className={styles.btnIcon} /> Downloaded!</>}
                {status === 'error' && <><AlertCircle className={styles.btnIcon} /> Error — Retry</>}
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.retentionNote}>
        <span className={styles.retentionDot} />
        All exports are generated in memory and downloaded directly. No file is ever stored.
      </div>
    </div>
  );
}
