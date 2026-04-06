/**
 * STRUCTURE A — THEMATIC
 *
 * Section order:
 *  1. Cover Page
 *  2. Table of Contents
 *  3. Executive Summary
 *  4. Methodology Note
 *  5. Themes (H2 per theme — narrative + quotes + sub-themes)
 *  6. Cross-Cutting Issues
 *  7. Recommendations
 *  8. Annex A: Data Retention Statement
 *  9. Annex B: Methodology Glossary
 */

import {
  Document,
  Paragraph,
  TableOfContents,
  SectionType,
  PageOrientation,
  convertInchesToTwip,
} from 'docx';
import type { AnalysisResult } from '../../types/analysis-result';
import type { DonorPreset } from '../exporters/donor-presets';
import {
  buildCoverPage,
  buildExecutiveSummary,
  buildMethodologyNote,
  buildRecommendations,
  buildCrossCuttingIssues,
  buildDataRetentionAnnex,
  buildMethodologyGlossary,
  buildHeader,
  buildFooter,
  h1,
  h2,
  h3,
  body,
  bullet,
  quoteParagraph,
  attribution,
  inlineLabel,
  pageBreak,
  spacer,
  TEAL,
} from '../exporters/word-exporter';
import { TextRun } from 'docx';

// ── Theme section builder ─────────────────────────────────────────────────────

function buildThemeSection(
  result: AnalysisResult,
  preset: DonorPreset
): Paragraph[] {
  const sections: Paragraph[] = [h1('Themes')];

  // Sort by frequency descending
  const sorted = [...result.themes].sort((a, b) => b.frequency - a.frequency);

  sorted.forEach((theme, idx) => {
    sections.push(h2(`Theme ${idx + 1}: ${theme.name}`));

    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Frequency: ×${theme.frequency}`, font: 'Arial', size: 20, italics: true, color: '888888' }),
        ],
        spacing: { after: 80 },
      })
    );

    sections.push(body(theme.description));

    if (theme.sub_themes.length > 0) {
      sections.push(h3('Sub-themes'));
      for (const sub of theme.sub_themes) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${sub.name}: `, font: 'Arial', size: 22, bold: true }),
              new TextRun({ text: sub.description, font: 'Arial', size: 22 }),
            ],
            bullet: { level: 0 },
            spacing: { after: 80 },
          })
        );
      }
    }

    if (theme.quotes.length > 0) {
      sections.push(h3('Representative Quotes'));
      const maxQuotes = Math.min(3, theme.quotes.length);
      for (let i = 0; i < maxQuotes; i++) {
        sections.push(quoteParagraph(theme.quotes[i]));
        sections.push(attribution(result.transcript_type === 'SSI' ? preset.ssiLabel : preset.fgdLabel));
      }
    }

    sections.push(spacer(1));
  });

  return sections;
}

// ── Main document builder ─────────────────────────────────────────────────────

export function buildThematicDocument(
  result: AnalysisResult,
  preset: DonorPreset,
  orgName = '',
  projectName = ''
): Document {
  const pageSize = {
    width: 11906,  // A4 width in DXA
    height: 16838, // A4 height in DXA
    orientation: PageOrientation.PORTRAIT,
  };

  const margins = {
    top: 1440,
    right: 1440,
    bottom: 1440,
    left: 1440,
  };

  const docTitle = 'Qualitative Analysis Report';

  return new Document({
    creator: 'Athar أثر',
    title: docTitle,
    description: `Thematic analysis report — ${result.sector} — ${result.transcript_type}`,
    styles: {
      default: {
        heading1: {
          run: {
            font: 'Arial',
            size: 36, // 18pt
            bold: true,
            color: TEAL,
          },
          paragraph: {
            spacing: { before: 300, after: 150 },
          },
        },
        heading2: {
          run: {
            font: 'Arial',
            size: 28, // 14pt
            bold: true,
            color: '333333',
          },
          paragraph: {
            spacing: { before: 240, after: 120 },
          },
        },
        heading3: {
          run: {
            font: 'Arial',
            size: 24, // 12pt
            bold: true,
            color: '1A1A1A',
          },
          paragraph: {
            spacing: { before: 180, after: 80 },
          },
        },
        listParagraph: {
          run: { font: 'Arial', size: 22 },
        },
      },
    },
    sections: [
      // ── Section 1: Cover Page (no header/footer) ──
      {
        properties: {
          page: { size: pageSize, margin: margins },
          type: SectionType.NEXT_PAGE,
        },
        children: [
          ...buildCoverPage(result, orgName, projectName, preset),
          pageBreak(),
        ],
      },

      // ── Section 2: Main Report ──
      {
        properties: {
          page: { size: pageSize, margin: margins },
          type: SectionType.NEXT_PAGE,
          pageNumberStart: 1,
          pageNumberFormatType: 'decimal',
        },
        headers: { default: buildHeader(docTitle) },
        footers: { default: buildFooter(preset) },
        children: [
          // Table of Contents
          h1('Table of Contents'),
          new TableOfContents('Table of Contents', {
            hyperlink: true,
            headingStyleRange: '1-3',
            stylesWithLevels: [
              { styleName: 'Heading 1', level: 1 },
              { styleName: 'Heading 2', level: 2 },
              { styleName: 'Heading 3', level: 3 },
            ],
          }),
          pageBreak(),

          // Executive Summary
          ...buildExecutiveSummary(result),
          pageBreak(),

          // Methodology Note
          ...buildMethodologyNote(result, preset),
          pageBreak(),

          // Themes
          ...buildThemeSection(result, preset),
          pageBreak(),

          // Cross-cutting Issues
          ...buildCrossCuttingIssues(result),
          pageBreak(),

          // Recommendations
          ...buildRecommendations(result),
          pageBreak(),

          // Annex A: Data Retention
          ...buildDataRetentionAnnex(),
          pageBreak(),

          // Annex B: Glossary
          ...buildMethodologyGlossary(),

          // Mandatory donor annex if present
          ...(preset.mandatoryAnnex
            ? [
                pageBreak(),
                h1(`Annex C: ${preset.label} Disclosure`),
                body(preset.mandatoryAnnex),
              ]
            : []),
        ],
      },
    ],
  });
}
