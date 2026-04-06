/**
 * Excel export builder — runs client-side (browser) and server-side.
 *
 * 4-sheet workbook:
 *  Sheet 1 — Coding Matrix
 *  Sheet 2 — Frequency Summary
 *  Sheet 3 — Logframe Alignment
 *  Sheet 4 — Analysis Metadata
 */

import ExcelJS from 'exceljs';
import type { AnalysisResult, EvidenceStrength } from '../../types/analysis-result';

// ── Design tokens ─────────────────────────────────────────────────────────────
const TEAL      = '1A5C5A';
const TEAL_ARGB = 'FF1A5C5A';
const MUTED     = 'FF888888';
const AMBER     = 'FFB07800';
const RED       = 'FFCC0000';
const OFF_WHITE = 'FFF5F5F2';
const WHITE     = 'FFFFFFFF';
const SAFFRON   = 'FFC4930A';
const LIGHT_TEAL_BG = 'FFEAF4F3';

function tealFill(): ExcelJS.Fill {
  return { type: 'pattern', pattern: 'solid', fgColor: { argb: TEAL_ARGB } };
}

function altFill(even: boolean): ExcelJS.Fill {
  return {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: even ? OFF_WHITE : WHITE },
  };
}

function evidenceFont(strength: EvidenceStrength): Partial<ExcelJS.Font> {
  const colorMap: Record<EvidenceStrength, string> = {
    Strong:    TEAL_ARGB,
    Moderate:  AMBER,
    Weak:      MUTED,
    'Not found': RED,
  };
  return { color: { argb: colorMap[strength] ?? MUTED }, bold: strength === 'Strong' };
}

function applyHeaderRow(row: ExcelJS.Row): void {
  row.height = 22;
  row.eachCell(cell => {
    cell.fill = tealFill();
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: WHITE } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
    cell.border = {
      bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
    };
  });
}

// ── Sheet 1: Coding Matrix ───────────────────────────────────────────────────

function buildCodingMatrix(wb: ExcelJS.Workbook, result: AnalysisResult, rtl: boolean): void {
  const ws = wb.addWorksheet('Coding Matrix', {
    views: [{ state: 'frozen', ySplit: 1, rightToLeft: rtl }],
  });

  ws.columns = [
    { header: 'Theme ID',          key: 'themeId',          width: 8 },
    { header: 'Theme Name',         key: 'themeName',         width: 28 },
    { header: 'Sub-theme',          key: 'subTheme',          width: 24 },
    { header: 'Quote',              key: 'quote',             width: 55 },
    { header: 'Frequency',          key: 'frequency',         width: 11 },
    { header: 'Source',             key: 'source',            width: 10 },
    { header: 'Logframe Indicator', key: 'logframeIndicator', width: 32 },
    { header: 'Evidence Strength',  key: 'evidenceStrength',  width: 18 },
  ];

  // Style header row
  applyHeaderRow(ws.getRow(1));
  ws.autoFilter = { from: 'A1', to: { row: 1, column: 8 } };

  let rowIdx = 2;

  result.themes.forEach((theme, tIdx) => {
    const themeId = `T${tIdx + 1}`;
    const logframeEntry = result.logframe_alignment.find(a => a.aligned_theme === theme.name);
    const indicator = logframeEntry?.indicator ?? '—';
    const evidenceStrength = logframeEntry?.evidence_strength ?? 'Not found';

    // Get sub-themes to pair with quotes
    const maxRows = Math.max(theme.quotes.length, theme.sub_themes.length, 1);

    for (let i = 0; i < maxRows; i++) {
      const isEven = rowIdx % 2 === 0;
      const row = ws.addRow({
        themeId:          i === 0 ? themeId : '',
        themeName:        i === 0 ? theme.name : '',
        subTheme:         theme.sub_themes[i]?.name ?? '',
        quote:            theme.quotes[i] ?? '',
        frequency:        i === 0 ? theme.frequency : '',
        source:           result.transcript_type,
        logframeIndicator: i === 0 ? indicator : '',
        evidenceStrength:  i === 0 ? evidenceStrength : '',
      });

      row.eachCell((cell, colNumber) => {
        cell.fill = altFill(isEven);
        cell.font = { name: 'Arial', size: 10, color: { argb: '1A1A1A'.padStart(8, 'FF') } };
        cell.alignment = { vertical: 'top', wrapText: colNumber === 4 };

        // Evidence strength conditional color
        if (colNumber === 8 && i === 0 && evidenceStrength) {
          cell.font = {
            ...cell.font,
            ...evidenceFont(evidenceStrength as EvidenceStrength),
          };
        }
      });

      rowIdx++;
    }
  });
}

// ── Sheet 2: Frequency Summary ───────────────────────────────────────────────

function buildFrequencySummary(wb: ExcelJS.Workbook, result: AnalysisResult, rtl: boolean): void {
  const ws = wb.addWorksheet('Frequency Summary', {
    views: [{ state: 'frozen', ySplit: 1, rightToLeft: rtl }],
  });

  ws.columns = [
    { header: 'Theme Name', key: 'name',       width: 30 },
    { header: 'Count',       key: 'count',      width: 10 },
    { header: '% of Total',  key: 'pct',        width: 12 },
    { header: 'Visual Bar',  key: 'bar',        width: 40 },
  ];

  applyHeaderRow(ws.getRow(1));

  const sorted = [...result.themes].sort((a, b) => b.frequency - a.frequency);
  const total = sorted.reduce((s, t) => s + t.frequency, 0);

  sorted.forEach((theme, idx) => {
    const rowNum = idx + 2; // 1-indexed, row 1 is header
    const row = ws.addRow({
      name:  theme.name,
      count: theme.frequency,
      pct:   theme.frequency / (total || 1),
      bar:   '',  // formula applied below
    });

    const isEven = rowNum % 2 === 0;

    row.eachCell(cell => {
      cell.fill = altFill(isEven);
      cell.font = { name: 'Arial', size: 10 };
      cell.alignment = { vertical: 'middle' };
    });

    // % format
    const pctCell = row.getCell(3);
    pctCell.numFmt = '0.0%';

    // Bar formula using REPT
    const barCell = row.getCell(4);
    barCell.value = { formula: `REPT("█",ROUND(C${rowNum}*40,0))`, result: '' };
    barCell.font = { name: 'Courier New', size: 9, color: { argb: TEAL_ARGB } };
    barCell.alignment = { horizontal: 'left', vertical: 'middle' };
  });

  // TOTAL row
  const totalRowNum = sorted.length + 2;
  const totalRow = ws.addRow({ name: 'TOTAL', count: total, pct: 1.0, bar: '' });
  totalRow.eachCell((cell, colNum) => {
    cell.fill = tealFill();
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: WHITE } };
    cell.alignment = { vertical: 'middle', horizontal: colNum === 1 ? 'left' : 'center' };
  });
  totalRow.getCell(2).value = { formula: `SUM(B2:B${totalRowNum - 1})`, result: total };
  totalRow.getCell(3).value = { formula: '1', result: 1 };
  totalRow.getCell(3).numFmt = '0%';
}

// ── Sheet 3: Logframe Alignment ──────────────────────────────────────────────

function buildLogframeAlignment(wb: ExcelJS.Workbook, result: AnalysisResult, rtl: boolean): void {
  const ws = wb.addWorksheet('Logframe Alignment', {
    views: [{ state: 'frozen', ySplit: 1, rightToLeft: rtl }],
  });

  ws.columns = [
    { header: 'Indicator',               key: 'indicator',       width: 40 },
    { header: 'Aligned Theme',           key: 'alignedTheme',    width: 28 },
    { header: 'Evidence Strength',        key: 'evidenceStrength', width: 18 },
    { header: 'Supporting Quotes Count', key: 'quotesCount',     width: 22 },
  ];

  applyHeaderRow(ws.getRow(1));

  if (result.logframe_alignment.length === 0) {
    const noDataRow = ws.addRow({
      indicator: 'No logframe indicators were provided. Re-run analysis with logframe context to see alignment.',
      alignedTheme: '',
      evidenceStrength: '',
      quotesCount: '',
    });
    ws.mergeCells(`A2:D2`);
    const mergedCell = noDataRow.getCell(1);
    mergedCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: MUTED } };
    mergedCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    noDataRow.height = 36;
    return;
  }

  result.logframe_alignment.forEach((entry, idx) => {
    const isEven = (idx + 2) % 2 === 0;
    const row = ws.addRow({
      indicator:       entry.indicator,
      alignedTheme:    entry.aligned_theme,
      evidenceStrength: entry.evidence_strength,
      quotesCount:     entry.supporting_quotes_count,
    });

    row.eachCell((cell, colNum) => {
      cell.fill = altFill(isEven);
      cell.font = { name: 'Arial', size: 10 };
      cell.alignment = { vertical: 'top', wrapText: colNum === 1 };

      // Color evidence column
      if (colNum === 3) {
        cell.font = {
          ...cell.font,
          ...evidenceFont(entry.evidence_strength as EvidenceStrength),
        };
      }
    });
  });
}

// ── Sheet 4: Analysis Metadata ───────────────────────────────────────────────

function buildMetadata(wb: ExcelJS.Workbook, result: AnalysisResult, rtl: boolean): void {
  const ws = wb.addWorksheet('Analysis Metadata', {
    views: [{ rightToLeft: rtl }],
  });

  ws.getColumn(1).width = 22;
  ws.getColumn(2).width = 50;

  const rows: [string, string | number][] = [
    ['Analysis Date',   new Date().toISOString()],
    ['Methodology',     result.methodology],
    ['Sector',          result.sector],
    ['Transcript Type', result.transcript_type],
    ['Words Analyzed',  result.word_count_analyzed],
    ['Sample Size',     result.sample_size ?? 'Not specified'],
    ['Confidence Note', result.confidence_note ?? ''],
    ['Generated By',    'Athar أثر — athar.ai'],
    ['Data Retention',  'Files processed in memory only. Nothing stored.'],
  ];

  rows.forEach(([key, value], idx) => {
    const row = ws.getRow(idx + 2); // start at row 2
    row.getCell(1).value = key;
    row.getCell(1).font = { name: 'Arial', size: 10, bold: true, color: { argb: TEAL_ARGB } };
    row.getCell(1).alignment = { vertical: 'top' };

    row.getCell(2).value = value;
    row.getCell(2).font = { name: 'Arial', size: 10 };
    row.getCell(2).alignment = { vertical: 'top', wrapText: true };

    // Auto-height for long confidence note
    if (key === 'Confidence Note') {
      row.height = 36;
    }
  });
}

// ── Main builder ─────────────────────────────────────────────────────────────

export async function buildExcelExport(
  result: AnalysisResult,
  language: 'en' | 'ar' = 'en'
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Athar أثر';
  wb.created = new Date();
  wb.modified = new Date();
  wb.properties.date1904 = false;

  const rtl = language === 'ar';

  if (rtl) {
    wb.views = [{ rightToLeft: true, x: 0, y: 0, width: 10000, height: 20000 }];
  }

  buildCodingMatrix(wb, result, rtl);
  buildFrequencySummary(wb, result, rtl);
  buildLogframeAlignment(wb, result, rtl);
  buildMetadata(wb, result, rtl);

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
