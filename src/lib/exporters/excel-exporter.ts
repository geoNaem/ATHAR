import ExcelJS from 'exceljs';
import { AnalysisResult } from '@/types/analysis-result';
import { AR_LABELS } from './rtl-config';

/**
 * Builds the Athar Excel Coding Matrix & Frequency Summary.
 * Streams a structured .xlsx file suitable for MEAL metadata auditing.
 */
export async function buildExcelExport(
  result: AnalysisResult,
  language: 'en' | 'ar' = 'en'
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const isAr = language === 'ar';
  
  if (isAr) {
    (workbook as any).views = [{ rightToLeft: true }];
  }

  // Define brand colors
  const SIENNA = 'FFC84B31';
  const BONE = 'FFF5EDD9';
  const DARK = 'FF2C1503';
  const ACCENT = 'FFE8A87C';

  const L = isAr ? AR_LABELS : null;

  // 1. SHEET: Coding Matrix
  const matrixSheet = workbook.addWorksheet(
    L ? L.codingMatrix : 'Coding Matrix', 
    { views: [{ rightToLeft: isAr }] }
  );
  
  matrixSheet.columns = [
    { header: L ? L.themeId : 'Theme ID', key: 'id', width: 10 },
    { header: L ? L.themeName : 'Theme Name', key: 'name', width: 30 },
    { header: L ? L.subTheme : 'Sub-theme', key: 'sub', width: 25 },
    { header: L ? L.quote : 'Quote', key: 'quote', width: 60 },
    { header: L ? L.frequency : 'Frequency', key: 'freq', width: 12 },
    { header: L ? L.source : 'Source', key: 'source', width: 12 },
    { header: L ? L.logframeIndicator : 'Logframe Indicator', key: 'indicator', width: 35 },
    { header: L ? L.evidenceStrength : 'Evidence Strength', key: 'strength', width: 22 }
  ];

  // Header styling
  matrixSheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SIENNA } };
    cell.font = { color: { argb: BONE }, bold: true, name: 'Arial', size: 10 };
    cell.alignment = { horizontal: isAr ? 'right' : 'center', vertical: 'middle' };
  });

  // Populate data
  let rowIdx = 2;
  result.themes.forEach((theme, i) => {
    const themeId = `T${i + 1}`;
    const indicator = result.logframe_alignment.find(e => e.aligned_theme === theme.name);
    
    // Mapping strength to AR labels
    let strengthVal: string = indicator?.evidence_strength || '';
    if (isAr && strengthVal) {
      if (strengthVal === 'Strong') strengthVal = L!.strong;
      else if (strengthVal === 'Moderate') strengthVal = L!.moderate;
      else if (strengthVal === 'Weak') strengthVal = L!.weak;
      else if (strengthVal === 'Not found') strengthVal = L!.notFound;
    }

    const baseRowValues = {
      id: themeId,
      name: theme.name,
      sub: theme.sub_themes.map(st => st.name).join(', '),
      freq: theme.frequency,
      source: result.transcript_type,
      indicator: indicator?.indicator || '',
      strength: strengthVal
    };

    if (theme.quotes.length > 0) {
      theme.quotes.forEach(quote => {
        const row = matrixSheet.addRow({ ...baseRowValues, quote });
        styleMatrixRow(row, rowIdx % 2 === 0, BONE, isAr, L);
        rowIdx++;
      });
    } else {
      const row = matrixSheet.addRow({ 
        ...baseRowValues, 
        quote: isAr ? '(لم يستخرج أي اقتباس)' : '(No quotes extracted)' 
      });
      styleMatrixRow(row, rowIdx % 2 === 0, BONE, isAr, L);
      rowIdx++;
    }
  });

  // 2. SHEET: Frequency Summary
  const freqSheet = workbook.addWorksheet(
    L ? L.frequencySummary : 'Frequency Summary', 
    { views: [{ rightToLeft: isAr }] }
  );

  freqSheet.columns = [
    { header: L ? L.themeName : 'Theme Name', key: 'name', width: 35 },
    { header: L ? L.frequency : 'Count', key: 'count', width: 12 },
    { header: isAr ? 'النسبة' : '% of Total', key: 'pct', width: 15 },
    { header: isAr ? 'الرسم البياني' : 'Visual Bar', key: 'bar', width: 45 }
  ];

  freqSheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SIENNA } };
    cell.font = { color: { argb: BONE }, bold: true };
    cell.alignment = { horizontal: isAr ? 'right' : 'center' };
  });

  const totalFreq = result.themes.reduce((acc, t) => acc + t.frequency, 0);
  const sortedThemes = [...result.themes].sort((a, b) => b.frequency - a.frequency);

  sortedThemes.forEach((t, i) => {
    const rowNum = i + 2;
    const row = freqSheet.addRow([
      t.name,
      t.frequency,
      { formula: `B${rowNum}/SUM($B$2:$B$${sortedThemes.length + 1})`, result: t.frequency / totalFreq },
      { formula: `REPT("█",ROUND(C${rowNum}*40,0))`, result: '' }
    ]);
    row.getCell(4).font = { name: 'Courier New', size: 9, color: { argb: SIENNA } };
    row.eachCell(cell => {
      cell.alignment = { horizontal: isAr ? 'right' : 'left' };
    });
  });

  const totalRow = freqSheet.addRow([isAr ? 'المجموع' : 'TOTAL', totalFreq, '100%', '']);
  totalRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SIENNA } };
    cell.font = { color: { argb: BONE }, bold: true };
    cell.alignment = { horizontal: isAr ? 'right' : 'left' };
  });

  // 3. SHEET: Logframe Alignment
  const logSheet = workbook.addWorksheet(
    L ? L.logframeAlignment : 'Logframe Alignment', 
    { views: [{ rightToLeft: isAr }] }
  );

  logSheet.columns = [
    { header: L ? L.logframeIndicator : 'Indicator', key: 'indicator', width: 45 },
    { header: L ? L.themeName : 'Aligned Theme', key: 'theme', width: 32 },
    { header: L ? L.evidenceStrength : 'Evidence Strength', key: 'strength', width: 22 },
    { header: isAr ? 'عدد الاقتباسات الداعمة' : 'Supporting Quotes Count', key: 'quotesCount', width: 24 }
  ];

  logSheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SIENNA } };
    cell.font = { color: { argb: BONE }, bold: true };
    cell.alignment = { horizontal: isAr ? 'right' : 'center' };
  });

  if (result.logframe_alignment.length === 0) {
    logSheet.mergeCells('A2:D2');
    const noteCell = logSheet.getCell('A2');
    noteCell.value = isAr ? 'لم يتم توفير مؤشرات إطار منطقي لهذا التحليل.' : 'No logframe indicators were provided.';
    noteCell.font = { italic: true, color: { argb: 'FF5F5E5A' } };
    noteCell.alignment = { horizontal: 'center' };
  } else {
    result.logframe_alignment.forEach((entry, i) => {
      const theme = result.themes.find(t => t.name === entry.aligned_theme);
      let s: string = entry.evidence_strength;
      if (isAr) {
         if (s === 'Strong') s = L!.strong;
         else if (s === 'Moderate') s = L!.moderate;
         else if (s === 'Weak') s = L!.weak;
         else if (s === 'Not found') s = L!.notFound;
      }
      const row = logSheet.addRow([ entry.indicator, entry.aligned_theme, s, theme?.quotes.length || 0 ]);
      row.eachCell((cell) => {
         if (i % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BONE } };
         cell.alignment = { horizontal: isAr ? 'right' : 'left' };
      });
    });
  }

  // 4. SHEET: Metadata
  const metaSheet = workbook.addWorksheet(
    L ? L.metadata : 'Analysis Metadata', 
    { views: [{ rightToLeft: isAr }] }
  );

  metaSheet.getColumn('A').width = 28;
  metaSheet.getColumn('B').width = 60;

  metaSheet.mergeCells('A1:B1');
  const metaHeader = metaSheet.getCell('A1');
  metaHeader.value = isAr ? 'أثر ATHAR — البيانات الوصفية للتحليل' : 'ATHAR أثر — ANALYSIS METADATA';
  metaHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
  metaHeader.font = { bold: true, color: { argb: BONE }, size: 10 };
  metaHeader.alignment = { horizontal: 'center' };

  const metaItems = [
    [isAr ? 'تاريخ التحليل' : 'Analysis Date', new Date().toISOString().split('T')[0]],
    [isAr ? 'المنهجية' : 'Methodology', result.methodology],
    [isAr ? 'القطاع' : 'Sector', result.sector],
    [isAr ? 'نوع النسخة' : 'Transcript Type', result.transcript_type],
    [isAr ? 'عدد الكلمات' : 'Word Count', result.word_count_analyzed],
    [isAr ? 'ملاحظة الثقة' : 'Confidence Note', result.confidence_note],
    [isAr ? 'أُنتج بواسطة' : 'Generated By', 'Athar أثر — athar.ai'],
    [isAr ? 'حفظ البيانات' : 'Data Retention', isAr ? L!.retentionNote : 'Files processed in memory only. Nothing stored.']
  ];

  metaItems.forEach((item) => {
    const row = metaSheet.addRow(item);
    row.getCell(1).font = { bold: true, color: { argb: SIENNA }, name: 'Arial', size: 10 };
    row.getCell(1).alignment = { horizontal: isAr ? 'right' : 'left' };
    row.getCell(2).alignment = { wrapText: true, horizontal: isAr ? 'right' : 'left' };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer as ArrayBuffer);
}

function styleMatrixRow(row: ExcelJS.Row, isEven: boolean, boneColor: string, isAr: boolean, L: any) {
  row.eachCell((cell) => {
    if (isEven) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: boneColor } };
    cell.alignment = { horizontal: isAr ? 'right' : 'left' };
  });
  
  const strengthCell = row.getCell(8);
  const strength = strengthCell.value as string;
  let color = 'FF5F5E5A';
  
  // Checking for both English and AR values since we populated with L or raw
  const isStrong = strength === 'Strong' || (L && strength === L.strong);
  const isModerate = strength === 'Moderate' || (L && strength === L.moderate);
  const isNotFound = strength === 'Not found' || (L && strength === L.notFound);

  if (isStrong) color = 'FF3B6D11';
  if (isModerate) color = 'FFB07800';
  if (isNotFound) color = 'FFCC0000';

  strengthCell.font = { color: { argb: color }, bold: isStrong };
}
