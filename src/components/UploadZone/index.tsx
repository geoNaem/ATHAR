import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileType2, RefreshCw } from 'lucide-react';
import styles from './index.module.css';
import { extractDocxText } from '../../lib/extractors/docx';
import { extractXlsxText } from '../../lib/extractors/xlsx';
import { normalizeText, detectLanguage } from '../../lib/extractors/normalizer';
import { useZeroRetention } from '../../lib/zero-retention';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Inline SVG shield icon — teal colored, no emoji dependency.
 * Rendered as a pure SVG path, not a Lucide import, to maintain
 * visual consistency across all platforms.
 */
function ShieldIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export default function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // UI data
  const [fileName, setFileName] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [detectedLang, setDetectedLang] = useState<'EN' | 'AR' | 'Mixed' | null>(null);

  // Memory-safe storage for the extracted text
  const [extractedText, setExtractedText] = useState('');
  const { bufferCleared, clearBuffer } = useZeroRetention();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (rawFile: File | null) => {
    if (!rawFile) return;

    setStatus('processing');
    setErrorMsg('');

    // Size check
    if (rawFile.size > MAX_FILE_SIZE) {
      setStatus('error');
      setErrorMsg(`File exceeds 10MB limit. Your file is ${(rawFile.size / 1024 / 1024).toFixed(1)}MB.`);
      return;
    }

    const extension = rawFile.name.split('.').pop()?.toLowerCase();

    if (extension !== 'docx' && extension !== 'xlsx') {
      setStatus('error');
      setErrorMsg('Invalid file type. Only .docx and .xlsx are supported.');
      return;
    }

    try {
      setFileName(rawFile.name);

      let rawText = '';
      if (extension === 'docx') {
        rawText = await extractDocxText(rawFile);
      } else if (extension === 'xlsx') {
        rawText = await extractXlsxText(rawFile);
      }

      const cleanText = normalizeText(rawText);
      const lang = detectLanguage(cleanText);

      // Store entirely in memory state
      setExtractedText(cleanText);

      // Update UI state
      setCharCount(cleanText.length);
      setDetectedLang(lang);
      setStatus('success');

    } catch {
      setStatus('error');
      setErrorMsg('Failed to extract text. The file might be corrupted or password-protected.');
    } finally {
      // Explicitly drop standard references to the File object
      rawFile = null;
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
    // Reset input so the same file could be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetZone = () => {
    clearBuffer(setExtractedText);
    setStatus('idle');
    setFileName('');
    setCharCount(0);
    setDetectedLang(null);
    setErrorMsg('');
  };

  // Analysis Dispatch — zero-retention compliant
  const dispatchAnalysis = async () => {
    if (!extractedText) return;

    try {
      await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extractedText,
          methodology: 'auto', // TODO: wire to MethodSelector state
          sector: '',
          logframe: '',
        }),
      });
    } catch {
      // Network errors are non-fatal for the wipe contract — buffer still clears
    }

    // Explicitly wipe the buffer from memory following dispatch
    clearBuffer(setExtractedText);
  };

  return (
    <div className={styles.uploadContainer}>
      <div
        className={`
          ${styles.dropZone}
          ${isDragging && status === 'idle' ? styles.dropZoneActive : ''}
          ${status === 'success' ? styles.dropZoneSuccess : ''}
          ${status === 'error' ? styles.dropZoneError : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (status === 'idle') fileInputRef.current?.click();
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".docx,.xlsx"
          className={styles.fileInput}
        />

        {status === 'idle' && (
          <div>
            <UploadCloud className={styles.icon} />
            <h3 className={styles.title}>Drop your transcript here</h3>
            <p className={styles.subtitle}>Supports .docx or .xlsx up to 10MB</p>
            <button className={styles.browseButton}>Browse Files</button>
          </div>
        )}

        {status === 'processing' && (
          <div>
            <RefreshCw className={`${styles.icon} animate-spin`} style={{ animationDuration: '2s' }} />
            <h3 className={styles.title}>Extracting data...</h3>
            <p className={styles.subtitle}>Securely processing entirely on your device</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <AlertCircle className={styles.icon} style={{ color: '#e63b2e' }} />
            <h3 className={styles.errorText}>We couldn't process that file</h3>
            <p className={styles.subtitle}>{errorMsg}</p>
            <button className={styles.retryButton} onClick={(e) => {
              e.stopPropagation();
              resetZone();
            }}>
              Try Another File
            </button>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className={styles.successHead}>
              <CheckCircle2 size={24} />
              Extraction Complete
            </div>

            <div className={styles.filename}>
              <FileType2 size={16} style={{ display: 'inline', marginRight: '8px' }} />
              {fileName}
            </div>

            <div className={styles.statsRow}>
              <span className={styles.badge}>{charCount.toLocaleString()} characters</span>
              <span className={`${styles.badge} ${styles.badgeLang}`}>{detectedLang}</span>
            </div>

            <div className={styles.secureMessage}>
              <ShieldIcon size={16} />
              File processed — original deleted from memory
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className={styles.retryButton} onClick={(e) => {
                e.stopPropagation();
                resetZone();
              }}>
                Start Over
              </button>
              <button
                className={styles.browseButton}
                style={{ backgroundColor: 'oklch(72% 0.18 65)', color: 'oklch(22% 0.03 250)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatchAnalysis();
                }}
              >
                Start Analysis
              </button>
            </div>

            {/* ── Zero-Retention Trust Indicator ─────────────────────── */}
            {bufferCleared && (
              <div className={styles.trustIndicator}>
                <ShieldIcon size={20} />
                <span>✓ Your file was processed in memory and cleared. Nothing was stored.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
