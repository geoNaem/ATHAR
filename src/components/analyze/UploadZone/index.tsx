'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './UploadZone.module.css';
import { Upload, CheckCircle2, AlertCircle, ArrowRight, Loader2, FileText, Users } from 'lucide-react';
import { extractDocx } from '../../../lib/extractors/docx';
import { extractXlsx } from '../../../lib/extractors/xlsx';
import { normalizeText, detectLanguage } from '../../../lib/extractors/normalizer';

interface UploadZoneProps {
  onExtracted: (text: string, lang: 'en' | 'ar' | 'mixed', filename: string, type: 'SSI' | 'FGD') => void;
}

export default function UploadZone({ onExtracted }: UploadZoneProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setDragOver] = useState(false);
  
  // File details
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string; count: number; lang: 'en' | 'ar' | 'mixed' } | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [transcriptType, setType] = useState<'SSI' | 'FGD' | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security cleanup: Ensure file object is released after extraction
  useEffect(() => {
    return () => {
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
  }, [status]);

  const handleFile = async (file: File) => {
    // Validations
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB.');
      setStatus('error');
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'docx' && extension !== 'xlsx') {
      setError('Only .docx and .xlsx files are supported.');
      setStatus('error');
      return;
    }

    setStatus('processing');
    setError(null);

    try {
      let rawText = '';
      if (extension === 'docx') {
        rawText = await extractDocx(file);
      } else {
        rawText = await extractXlsx(file);
      }

      const cleanText = normalizeText(rawText);
      const lang = detectLanguage(cleanText);
      const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

      setExtractedText(cleanText);
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        count: wordCount,
        lang: lang
      });

      // Auto-detect type from filename
      if (file.name.toLowerCase().includes('fgd') || file.name.toLowerCase().includes('group')) {
        setType('FGD');
      } else if (file.name.toLowerCase().includes('ssi') || file.name.toLowerCase().includes('interview')) {
        setType('SSI');
      }

      setStatus('success');
    } catch (err: any) {
      setError(err.message || 'An error occurred during extraction.');
      setStatus('error');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div 
        className={`${styles.container} ${styles[status]} ${isDragOver ? styles.dragOver : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => status === 'idle' && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".docx,.xlsx"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {status === 'idle' && (
          <>
            <div className="mb-6 p-4 bg-[#C84B31]/5 rounded-full text-[#C84B31]">
              <Upload size={32} />
            </div>
            <h2 className="text-[#2C1503] font-bold text-lg mb-2">Upload your transcript</h2>
            <p className="text-[#E8A87C] text-sm mb-8">DOCX or XLSX · Max 10MB</p>
            <button className="btn btn-primary" style={{ padding: '12px 24px' }}>Choose file</button>
          </>
        )}

        {status === 'processing' && (
          <>
            <div className={styles.spinner} />
            <h2 className="text-[#2C1503] text-sm font-medium">Reading your file...</h2>
          </>
        )}

        {status === 'success' && fileInfo && (
          <div className="w-full">
            <div className={styles.successHeader}>
              <div className="flex-1">
                <div className="mono text-[#2C1503] mb-4 text-sm font-bold truncate max-w-[400px]">
                  {fileInfo.name}
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="mono bg-[#C84B31] text-white px-3 py-1 rounded-sm text-[10px] font-bold uppercase">
                    Detected: {fileInfo.lang}
                  </span>
                  <span className="mono bg-[#E8A87C] text-[#2C1503] px-3 py-1 rounded-sm text-[10px] font-bold">
                    ~{fileInfo.count.toLocaleString()} words
                  </span>
                </div>
              </div>
              <div className="text-[#C84B31] flex flex-col items-center gap-2">
                <CheckCircle2 size={32} />
                <span className="text-[10px] font-bold uppercase">File Processed</span>
              </div>
            </div>

            <div className="border-t border-[#E8A87C]/20 pt-8">
              <label className="label text-[#E8A87C] mb-4 block">TRANSCRIPT TYPE</label>
              <div className={styles.typeSelector}>
                <button 
                  className={`${styles.pill} ${transcriptType === 'SSI' ? styles.active : ''}`}
                  onClick={() => setType('SSI')}
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    SSI — Semi-structured interview
                  </div>
                </button>
                <button 
                  className={`${styles.pill} ${transcriptType === 'FGD' ? styles.active : ''}`}
                  onClick={() => setType('FGD')}
                >
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    FGD — Focus group
                  </div>
                </button>
              </div>
            </div>

            <div className="text-center opacity-60 italic text-[11px] mb-8 text-[#E8A87C]">
              Original data has been released from memory.
            </div>

            <button 
              className={styles.proceedBtn}
              disabled={!transcriptType}
              onClick={() => onExtracted(extractedText, fileInfo.lang, fileInfo.name, transcriptType!)}
            >
              Continue to configuration
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        {status === 'error' && (
          <>
            <div className="text-[#CC0000] mb-6">
              <AlertCircle size={48} />
            </div>
            <h2 className="text-[#CC0000] font-bold text-lg mb-2">Extraction Failed</h2>
            <p className="text-[#2C1503] text-sm mb-8">{error}</p>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '12px 24px' }}
              onClick={() => setStatus('idle')}
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
