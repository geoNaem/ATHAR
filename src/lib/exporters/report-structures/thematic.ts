import { Paragraph, HeadingLevel, TextRun, BorderStyle, AlignmentType, NumberFormat } from 'docx';
import { AnalysisResult } from '../../../types/analysis-result';
import { DonorPreset } from '../donor-presets';
import { AR_LABELS } from '../rtl-config';

export function buildThematicSections(
  result: AnalysisResult,
  preset: DonorPreset,
  language: 'en' | 'ar' = 'en'
): Paragraph[] {
  const isAr = language === 'ar';
  const L = isAr ? AR_LABELS : null;
  const sections: Paragraph[] = [];
  const font = isAr ? 'Traditional Arabic' : 'Arial';

  // Helper for localized text
  const t = (en: string, ar: string) => isAr ? ar : en;

  // EXECUTIVE SUMMARY
  sections.push(
    new Paragraph({
      text: t('EXECUTIVE SUMMARY', AR_LABELS.executiveSummary),
      heading: HeadingLevel.HEADING_1,
      bidirectional: isAr
    })
  );
  
  result.key_findings.slice(0, 2).forEach(finding => {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: finding, font })],
        spacing: { after: 200 },
        bidirectional: isAr
      })
    );
  });

  // METHODOLOGY NOTE
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
      children: [new TextRun({ text: preset.methodologyNote.replace('[methodology]', result.methodology), font })],
      spacing: { after: 120 },
      bidirectional: isAr
    })
  );
  sections.push(
    new Paragraph({
      children: [
        new TextRun({ text: t('Data Type: ', 'نوع النسخة: ') + result.transcript_type, bold: true, font }),
        new TextRun({ text: ` | ` + t('Methodology: ', 'المنهجية: ') + result.methodology + ` | ` + t('Words Analyzed: ', 'عدد الكلمات: ') + result.word_count_analyzed.toLocaleString(), bold: false, font })
      ],
      spacing: { after: 200 },
      bidirectional: isAr
    })
  );

  // ANALYSIS FINDINGS
  sections.push(
    new Paragraph({
      text: t('ANALYSIS FINDINGS', AR_LABELS.themes),
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400 },
      bidirectional: isAr
    })
  );

  [...result.themes].sort((a, b) => b.frequency - a.frequency).forEach(theme => {
    sections.push(
      new Paragraph({
        text: theme.name,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        bidirectional: isAr
      })
    );

    sections.push(
      new Paragraph({
        children: [new TextRun({ text: t('Frequency: ', 'التكرار: ') + `×${theme.frequency}`, italics: true, color: 'E8A87C', font })],
        spacing: { after: 120 },
        bidirectional: isAr
      })
    );

    sections.push(
      new Paragraph({
        children: [new TextRun({ text: theme.description, font })],
        spacing: { after: 200 },
        bidirectional: isAr
      })
    );

    if (theme.sub_themes.length > 0) {
      sections.push(
        new Paragraph({
          text: t('Sub-themes', AR_LABELS.subTheme),
          heading: HeadingLevel.HEADING_3,
          bidirectional: isAr
        })
      );
      theme.sub_themes.forEach(st => {
        sections.push(
          new Paragraph({
            text: `${st.name} — ${st.description}`,
            bullet: { level: 0 },
            spacing: { after: 120 },
            bidirectional: isAr
          })
        );
      });
    }

    sections.push(
      new Paragraph({
        text: t('Representative Quotes', AR_LABELS.quote),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 180 },
        bidirectional: isAr
      })
    );

    theme.quotes.slice(0, 3).forEach(quote => {
      sections.push(
        new Paragraph({
          indent: { left: 720 },
          border: {
            left: isAr ? undefined : { style: BorderStyle.SINGLE, size: 6, color: 'C84B31', space: 20 },
            right: isAr ? { style: BorderStyle.SINGLE, size: 6, color: 'C84B31', space: 20 } : undefined
          },
          children: [new TextRun({ text: `"${quote}"`, italics: true, color: '2C1503', font })],
          spacing: { before: 120, after: 60 },
          bidirectional: isAr
        })
      );
      sections.push(
        new Paragraph({
          indent: { left: 720 },
          children: [new TextRun({ text: t('— Participant, ', '— مشارك، ') + result.transcript_type, size: 18, color: 'E8A87C', font })],
          spacing: { after: 180 },
          bidirectional: isAr
        })
      );
    });
  });

  // CROSS-CUTTING ISSUES
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

  // RECOMMENDATIONS
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

  // ANNEXES
  sections.push(
    new Paragraph({
      text: t('ANNEXES', AR_LABELS.annexes),
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 800 },
      bidirectional: isAr
    })
  );

  sections.push(
    new Paragraph({
      text: t('ANNEX A — DATA RETENTION STATEMENT', 'ملحق أ — بيان حماية البيانات'),
      heading: HeadingLevel.HEADING_2,
      bidirectional: isAr
    })
  );
  sections.push(
    new Paragraph({
      children: [new TextRun({ 
        text: isAr ? AR_LABELS.retentionNote : 'This analysis was conducted by Athar (أثر). All uploaded files were processed entirely in memory and deleted immediately upon completion of analysis. No qualitative data, transcript content, or personal information was written to disk, stored in any database, or used for AI model training. This statement can be verified by the implementing organization\'s data protection officer.', 
        font 
      })],
      bidirectional: isAr
    })
  );

  if (preset.mandatoryAnnexTitle) {
     sections.push(
      new Paragraph({
        text: t(`ANNEX B — ${preset.mandatoryAnnexTitle}`, `ملحق ب — ${preset.mandatoryAnnexTitle}`),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400 },
        bidirectional: isAr
      })
    );
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: preset.mandatoryAnnexBody || '', font })],
        bidirectional: isAr
      })
    );
  }

  sections.push(
    new Paragraph({
      text: t('ANNEX C — METHODOLOGY GLOSSARY', 'ملحق ج — قاموس المنهجية'),
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400 },
      bidirectional: isAr
    })
  );
  const glossaryContent = getGlossary(result.methodology, isAr);
  sections.push(
    new Paragraph({
      children: [new TextRun({ text: glossaryContent, font })],
      bidirectional: isAr
    })
  );

  return sections;
}

function getGlossary(method: string, isAr: boolean): string {
  if (method.includes('Thematic')) {
    return isAr 
      ? 'التحليل الموضوعي هو طريقة لتحديد الأنماط وتنظيمها ووصفها بالتفصيل داخل مجموعة البيانات. يركز على تحديد الموضوعات المتكررة ذات المعنى بالنسبة لسؤال البحث. تعتبر هذه المنهجية مرنة وتسمح برؤى غنية ومعقدة من البيانات النوعية.'
      : 'Thematic analysis is a method for identifying, analyzing, and reporting patterns (themes) within data. It minimally organizes and describes your data set in (rich) detail. This approach is highly flexible and allows for a rich, complex, and potentially multi-faceted account of data.';
  }
  return isAr 
    ? 'هذه المنهجية تتبع معايير التحليل النوعي المعتمدة دولياً لضمان دقة النتائج وشفافية العملية.'
    : 'This methodology follows international standards for qualitative analysis to ensure rigor, transparency, and reliability of findings.';
}
