/**
 * STRUCTURE B — INDICATOR-LED
 *
 * Section order:
 *  1. Cover Page
 *  2. Table of Contents
 *  3. Executive Summary
 *  4. Methodology Note
 *  5. Findings by Indicator (one H2 per logframe_alignment entry)
 *  6. Emerging Themes Not Captured by Logframe
 *  7. Gaps and Data Limitations
 *  8. Recommendations
 *  9. Annex A: Full Theme Coding Summary (table)
 * 10. Annex B: Data Retention Statement
 */

import {
  Document,
  Paragraph,
  TableOfContents,
  SectionType,
  PageOrientation,
  TextRun,
} from 'docx';
import type { AnalysisResult, EvidenceStrength } from '../../types/analysis-result';
import type { DonorPreset } from '../exporters/donor-presets';
import {
  buildCoverPage,
  buildExecutiveSummary,
  buildMethodologyNote,
  buildRecommendations,
  buildCrossCuttingIssues,
  buildDataRetentionAnnex,
  buildFullThemeCodingTable,
  buildHeader,
  buildFooter,
  evidenceBadge,
  h1,
  h2,
  h3,
  body,
  quoteParagraph,
  attribution,
  pageBreak,
  spacer,
  bullet,
  TEAL,
} from '../exporters/word-exporter';

// ── Indicator findings builder ────────────────────────────────────────────────

function buildIndicatorSection(
  result: AnalysisResult,
  preset: DonorPreset
): Paragraph[] {
  const sections: Paragraph[] = [h1('Findings by Indicator')];

  if (result.logframe_alignment.length === 0) {
    sections.push(
      body(
        'No logframe indicators were provided or aligned during analysis. ' +
        'Consider re-running the analysis with logframe context pasted in the configuration step.'
      )
    );
    return sections;
  }

  for (const alignment of result.logframe_alignment) {
    sections.push(h2(alignment.indicator));

    // Evidence strength badge
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Evidence Strength: ', font: 'Arial', size: 20, bold: true, color: TEAL }),
          evidenceBadge(alignment.evidence_strength as EvidenceStrength, preset),
        ],
        spacing: { after: 80 },
      })
    );

    // Body narrative
    sections.push(
      body(
        `Analysis identified "${alignment.aligned_theme}" as the primary theme ` +
        `aligned to this indicator. ${alignment.supporting_quotes_count} supporting quote(s) were extracted.`
      )
    );

    // Find matching theme and render details
    const matchedTheme = result.themes.find(t => t.name === alignment.aligned_theme);

    if (matchedTheme) {
      sections.push(body(matchedTheme.description));

      if (matchedTheme.sub_themes.length > 0) {
        sections.push(h3('Supporting Sub-themes'));
        for (const sub of matchedTheme.sub_themes) {
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

      // Top 2 quotes
      const topQuotes = matchedTheme.quotes.slice(0, 2);
      if (topQuotes.length > 0) {
        sections.push(h3('Supporting Evidence'));
        for (const q of topQuotes) {
          sections.push(quoteParagraph(q));
          sections.push(attribution(result.transcript_type === 'SSI' ? preset.ssiLabel : preset.fgdLabel));
        }
      }
    }

    sections.push(spacer(1));
  }

  return sections;
}

// ── Emerging themes (no logframe alignment) ───────────────────────────────────

function buildEmergingThemes(
  result: AnalysisResult,
  preset: DonorPreset
): Paragraph[] {
  // Find themes not referenced in any logframe_alignment entry
  const alignedThemeNames = new Set(result.logframe_alignment.map(a => a.aligned_theme));
  const emerging = result.themes.filter(t => !alignedThemeNames.has(t.name));

  if (emerging.length === 0) return [];

  const sections: Paragraph[] = [
    h1('Emerging Themes Not Captured by Logframe'),
    body(
      'The following themes emerged from the data but were not directly linked to any logframe indicator. ' +
      'These may represent important contextual factors, enabling conditions, or areas for future programming consideration.'
    ),
  ];

  for (const theme of emerging) {
    sections.push(h2(theme.name));
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Frequency: ×${theme.frequency}`, font: 'Arial', size: 20, italics: true, color: '888888' }),
        ],
        spacing: { after: 80 },
      })
    );
    sections.push(body(theme.description));
    const topQuote = theme.quotes[0];
    if (topQuote) {
      sections.push(quoteParagraph(topQuote));
      sections.push(attribution(result.transcript_type === 'SSI' ? preset.ssiLabel : preset.fgdLabel));
    }
    sections.push(spacer(1));
  }

  return sections;
}

// ── Main document builder ─────────────────────────────────────────────────────

export function buildIndicatorLedDocument(
  result: AnalysisResult,
  preset: DonorPreset,
  orgName = '',
  projectName = ''
): Document {
  const pageSize = {
    width: 11906,
    height: 16838,
    orientation: PageOrientation.PORTRAIT,
  };

  const margins = { top: 1440, right: 1440, bottom: 1440, left: 1440 };
  const docTitle = 'Qualitative Analysis Report — Indicator-Led';

  return new Document({
    creator: 'Athar أثر',
    title: docTitle,
    description: `Indicator-led analysis report — ${result.sector} — ${result.transcript_type}`,
    styles: {
      default: {
        heading1: {
          run: { font: 'Arial', size: 36, bold: true, color: TEAL },
          paragraph: { spacing: { before: 300, after: 150 } },
        },
        heading2: {
          run: { font: 'Arial', size: 28, bold: true, color: '333333' },
          paragraph: { spacing: { before: 240, after: 120 } },
        },
        heading3: {
          run: { font: 'Arial', size: 24, bold: true, color: '1A1A1A' },
          paragraph: { spacing: { before: 180, after: 80 } },
        },
        listParagraph: { run: { font: 'Arial', size: 22 } },
      },
    },
    sections: [
      // ── Section 1: Cover Page ──
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
        },
        headers: { default: buildHeader(docTitle) },
        footers: { default: buildFooter(preset) },
        children: [
          // Table of Contents
          h1('Table of Contents'),
          new TableOfContents('Table of Contents', {
            hyperlink: true,
            headingStyleRange: '1-3',
          }),
          pageBreak(),

          // Executive Summary
          ...buildExecutiveSummary(result),
          pageBreak(),

          // Methodology Note
          ...buildMethodologyNote(result, preset),
          pageBreak(),

          // Findings by Indicator
          ...buildIndicatorSection(result, preset),
          pageBreak(),

          // Emerging Themes
          ...buildEmergingThemes(result, preset),
          ...(buildEmergingThemes(result, preset).length > 0 ? [pageBreak()] : []),

          // Gaps and Limitations
          ...buildCrossCuttingIssues(result),
          pageBreak(),

          // Recommendations
          ...buildRecommendations(result),
          pageBreak(),

          // Annex A: Full Theme Coding Table
          ...buildFullThemeCodingTable(result),
          pageBreak(),

          // Annex B: Data Retention
          ...buildDataRetentionAnnex(),

          // Mandatory donor annex
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
