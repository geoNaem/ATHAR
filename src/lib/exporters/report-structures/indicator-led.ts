import { Paragraph, HeadingLevel, TextRun, BorderStyle, AlignmentType } from 'docx';
import { AnalysisResult } from '@/types/analysis-result';
import { DonorPreset } from '../donor-presets';
import { AR_LABELS } from '../rtl-config';

export function buildIndicatorSections(
  result: AnalysisResult,
  preset: DonorPreset,
  language: 'en' | 'ar' = 'en'
): Paragraph[] {
  const isAr = language === 'ar';
  const fonts = { font: isAr ? 'Traditional Arabic' : 'Arial' };
  const sections: Paragraph[] = [];

  const t = (en: string, ar: string) => isAr ? ar : en;

  // EXECUTIVE SUMMARY & METHODOLOGY
  sections.push(
    new Paragraph({
      text: t('EXECUTIVE SUMMARY', AR_LABELS.executiveSummary),
      heading: HeadingLevel.HEADING_1,
      bidirectional: isAr
    })
  );
  result.key_findings.slice(0, 2).forEach(f => {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: f, ...fonts })],
        spacing: { after: 200 },
        bidirectional: isAr
      })
    );
  });

  sections.push(
    new Paragraph({
      text: t('METHODOLOGY NOTE', AR_LABELS.methodology),
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400 },
      bidirectional: isAr
    })
  );
  sections.push(
    new Paragraph({
      children: [new TextRun({ text: preset.methodologyNote.replace('[methodology]', result.methodology), ...fonts })],
      spacing: { after: 120 },
      bidirectional: isAr
    })
  );

  // FINDINGS BY INDICATOR
  sections.push(
    new Paragraph({
      text: t('FINDINGS BY INDICATOR', 'النتائج حسب المؤشر'),
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400 },
      bidirectional: isAr
    })
  );

  if (result.logframe_alignment.length === 0) {
    sections.push(
      new Paragraph({
        text: isAr ? 'لم يتم توفير مؤشرات إطار منطقي لهذا التحليل. انظر المحاور الناشئة أدناه.' : 'No logframe indicators were provided for this analysis. See Emerging Themes below.',
        spacing: { after: 200 },
        bidirectional: isAr
      })
    );
  }

  result.logframe_alignment.forEach((entry, idx) => {
    // Reporting Level label (EU context)
    if (preset.reportingLevels) {
      const level = preset.reportingLevels[idx % preset.reportingLevels.length];
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: t('Result level: ', 'مستوى النتيجة: ') + level, italics: true, color: 'E8A87C', size: 18, ...fonts })],
          spacing: { before: 180 },
          bidirectional: isAr
        })
      );
    }

    sections.push(
      new Paragraph({
        text: entry.indicator,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 120, after: 60 },
        bidirectional: isAr
      })
    );

    // Evidence Strength Badge
    let strengthColor = '5F5E5A';
    if (entry.evidence_strength === 'Strong') strengthColor = '3B6D11';
    if (entry.evidence_strength === 'Moderate') strengthColor = '854F0B';
    if (entry.evidence_strength === 'Not found') strengthColor = '791F1F';

    let s: string = entry.evidence_strength;
    if (isAr) {
       if (s === 'Strong') s = AR_LABELS.strong;
       else if (s === 'Moderate') s = AR_LABELS.moderate;
       else if (s === 'Weak') s = AR_LABELS.weak;
       else if (s === 'Not found') s = AR_LABELS.notFound;
    }
    const currentStrengthLabel = s;

    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: t('Evidence Strength: ', 'قوة الدليل: '), size: 20, bold: true, ...fonts }),
          new TextRun({ text: `[${currentStrengthLabel}]`, size: 20, bold: true, color: strengthColor, ...fonts })
        ],
        spacing: { after: 120 },
        bidirectional: isAr
      })
    );

    const theme = result.themes.find(t => t.name === entry.aligned_theme);
    if (theme) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: theme.description, ...fonts })],
          spacing: { after: 120 },
          bidirectional: isAr
        })
      );
      theme.quotes.slice(0, 2).forEach(quote => {
         sections.push(
          new Paragraph({
            indent: { left: 720 },
            border: { 
              left: isAr ? undefined : { style: BorderStyle.SINGLE, size: 6, color: 'C84B31', space: 20 },
              right: isAr ? { style: BorderStyle.SINGLE, size: 6, color: 'C84B31', space: 20 } : undefined
            },
            children: [new TextRun({ text: `"${quote}"`, italics: true, color: '2C1503', ...fonts })],
            spacing: { before: 60, after: 60 },
            bidirectional: isAr
          })
        );
      });
    }
  });

  // EMERGING THEMES
  const alignedThemes = result.logframe_alignment.map(e => e.aligned_theme);
  const unalignedThemes = result.themes.filter(t => !alignedThemes.includes(t.name));

  if (unalignedThemes.length > 0) {
    sections.push(
      new Paragraph({
        text: t('EMERGING THEMES', 'المحاور الناشئة'),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400 },
        bidirectional: isAr
      })
    );
    unalignedThemes.forEach(t => {
      sections.push(
        new Paragraph({
          text: t.name,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
          bidirectional: isAr
        })
      );
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: t.description, ...fonts })],
          spacing: { after: 150 },
          bidirectional: isAr
        })
      );
    });
  }

  // GAPS & RECOMMENDATIONS
  sections.push(
    new Paragraph({
      text: t('CROSS-CUTTING ISSUES', AR_LABELS.gaps),
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400 },
      bidirectional: isAr
    })
  );
  result.gaps_and_limitations.forEach(gap => {
    sections.push(new Paragraph({ text: gap, bullet: { level: 0 }, bidirectional: isAr }));
  });

  sections.push(
    new Paragraph({
      text: t('RECOMMENDATIONS', AR_LABELS.recommendations),
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400 },
      bidirectional: isAr
    })
  );
  result.recommendations.forEach(rec => {
    sections.push(new Paragraph({ text: rec, numbering: { reference: 'numbers', level: 0 }, bidirectional: isAr }));
  });

  // ANNEXES (Same as thematic)
  sections.push(new Paragraph({ text: t('ANNEXES', AR_LABELS.annexes), heading: HeadingLevel.HEADING_1, spacing: { before: 800 }, bidirectional: isAr }));
  sections.push(new Paragraph({ text: t('ANNEX A — DATA RETENTION STATEMENT', 'ملحق أ — بيان حماية البيانات'), heading: HeadingLevel.HEADING_2, bidirectional: isAr }));
  sections.push(new Paragraph({ children: [new TextRun({ text: isAr ? AR_LABELS.retentionNote : 'Professional analysis statement here...', ...fonts })], bidirectional: isAr }));

  return sections;
}
