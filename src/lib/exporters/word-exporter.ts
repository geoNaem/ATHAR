import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  TableOfContents,
  PageBreak,
  ShadingType,
  WidthType,
  TableRow,
  TableCell,
  Table,
  Footer,
  Header,
  PageNumber,
  NumberFormat,
  LineRuleType,
  ExternalHyperlink,
} from 'docx';
import type { AnalysisResult, EvidenceStrength } from '../../types/analysis-result';
import type { DonorPreset } from '../exporters/donor-presets';

// ── Design tokens ────────────────────────────────────────────────────────────
export const TEAL      = '1A5C5A';
export const DARK_GRAY = '333333';
export const LIGHT_GRAY = '888888';
export const BLACK     = '1A1A1A';
export const AMBER     = 'B07800';
export const RED       = 'CC0000';
export const WHITE     = 'FFFFFF';

export const FONT = 'Arial';

// DXA units (1 inch = 1440 DXA)
export const INDENT_QUOTE = 720;

// ── Shared paragraph factories ───────────────────────────────────────────────

export function h1(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 150 },
  });
}

export function h2(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
  });
}

export function h3(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
  });
}

export function body(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        font: FONT,
        size: 22, // 11pt in half-points
        color: BLACK,
      }),
    ],
    spacing: {
      after: 120,
      line: 276, // 1.15 line spacing (240 * 1.15)
      lineRule: LineRuleType.AUTO,
    },
  });
}

export function quoteParagraph(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `"${text}"`,
        font: FONT,
        size: 22,
        italics: true,
        color: TEAL,
      }),
    ],
    indent: { left: INDENT_QUOTE },
    border: {
      left: {
        color: TEAL,
        space: 12,
        style: BorderStyle.SINGLE,
        size: 18, // 3pt in eighths of a point
      },
    },
    spacing: { before: 120, after: 120 },
  });
}

export function attribution(transcriptType: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `— Participant, ${transcriptType}`,
        font: FONT,
        size: 18, // 9pt
        italics: true,
        color: LIGHT_GRAY,
      }),
    ],
    indent: { left: INDENT_QUOTE },
    spacing: { before: 0, after: 120 },
  });
}

export function bullet(text: string): Paragraph {
  return new Paragraph({
    text,
    bullet: { level: 0 },
    spacing: { after: 80 },
    style: 'ListParagraph',
  });
}

export function numberedItem(index: number, text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `${index}. `, font: FONT, size: 22, bold: true, color: TEAL }),
      new TextRun({ text, font: FONT, size: 22, color: BLACK }),
    ],
    spacing: { after: 100 },
  });
}

export function pageBreak(): Paragraph {
  return new Paragraph({ children: [new PageBreak()] });
}

export function inlineLabel(label: string, value: string, color = LIGHT_GRAY): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, font: FONT, size: 20, bold: true, color: TEAL }),
      new TextRun({ text: value, font: FONT, size: 20, italics: true, color }),
    ],
    spacing: { after: 80 },
  });
}

/** Evidence badge with semantic color coding */
export function evidenceBadge(strength: EvidenceStrength, preset: DonorPreset): TextRun {
  const colorMap: Record<EvidenceStrength, string> = {
    Strong: TEAL,
    Moderate: AMBER,
    Weak: LIGHT_GRAY,
    'Not found': RED,
  };

  const labelMap: Record<EvidenceStrength, string> = {
    Strong: preset.evidenceScale.strong,
    Moderate: preset.evidenceScale.moderate,
    Weak: preset.evidenceScale.weak,
    'Not found': preset.evidenceScale.notFound,
  };

  return new TextRun({
    text: `[${labelMap[strength]}]`,
    font: FONT,
    size: 20,
    bold: true,
    color: colorMap[strength],
  });
}

/** Rule line separator */
export function ruleLine(color = TEAL): Paragraph {
  return new Paragraph({
    border: {
      bottom: {
        color,
        space: 1,
        style: BorderStyle.SINGLE,
        size: 16, // ~2pt
      },
    },
    spacing: { before: 0, after: 200 },
  });
}

export function centeredText(text: string, sizePt: number, bold = false, color = BLACK): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text,
        font: FONT,
        size: sizePt * 2, // half-points
        bold,
        color,
      }),
    ],
  });
}

export function spacer(lines = 1): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: '' })],
    spacing: { after: 240 * lines },
  });
}

// ── Cover page builder ───────────────────────────────────────────────────────

export function buildCoverPage(
  result: AnalysisResult,
  orgName: string,
  projectName: string,
  preset: DonorPreset
): Paragraph[] {
  const dateStr = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  return [
    // Organization name — right-aligned, gray
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({ text: orgName || 'Your Organization', font: FONT, size: 22, color: LIGHT_GRAY }),
      ],
      spacing: { after: 0 },
    }),

    // Whitespace ~3cm
    spacer(4),

    // Logo placeholder — centered rectangle (simulated with a bordered paragraph)
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: '[ Organization Logo ]', font: FONT, size: 20, color: TEAL }),
      ],
      border: {
        top: { color: TEAL, style: BorderStyle.SINGLE, size: 8, space: 4 },
        bottom: { color: TEAL, style: BorderStyle.SINGLE, size: 8, space: 4 },
        left: { color: TEAL, style: BorderStyle.SINGLE, size: 8, space: 4 },
        right: { color: TEAL, style: BorderStyle.SINGLE, size: 8, space: 4 },
      },
      spacing: { before: 200, after: 200 },
    }),

    spacer(2),

    // Report Title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'Qualitative Analysis Report', font: FONT, size: 48, bold: true, color: BLACK }),
      ],
      spacing: { before: 200, after: 120 },
    }),

    // Subtitle
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `${result.sector} | ${result.transcript_type}`,
          font: FONT, size: 28, color: LIGHT_GRAY,
        }),
      ],
      spacing: { after: 280 },
    }),

    // Project Name
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: projectName || 'Project Name', font: FONT, size: 24, color: BLACK }),
      ],
      spacing: { after: 120 },
    }),

    // Date
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: `Analysis Date: ${dateStr}`, font: FONT, size: 22, color: LIGHT_GRAY }),
      ],
      spacing: { after: 480 },
    }),

    // Confidentiality notice
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'CONFIDENTIAL — For internal use only.\nThis document contains analysis of primary qualitative data.\nPlease handle in accordance with your organization\'s data protection policy.',
          font: FONT, size: 18, italics: true, color: LIGHT_GRAY,
        }),
      ],
      spacing: { before: 0, after: 240 },
    }),

    // Teal rule
    ruleLine(TEAL),

    // Footer branding
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: preset.coverFooterText || 'Generated by Athar أثر · athar.ai · Zero data retention policy',
          font: FONT, size: 16, color: LIGHT_GRAY,
        }),
      ],
    }),
  ];
}

// ── Document headers / footers ───────────────────────────────────────────────

export function buildHeader(title: string): Header {
  return new Header({
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: title, font: FONT, size: 18, color: LIGHT_GRAY }),
          new TextRun({ children: ['\t', new PageNumber()], font: FONT, size: 18, color: LIGHT_GRAY }),
        ],
        tabStops: [{ type: 'right', position: convertInchesToTwip(6.5) }],
        border: {
          bottom: { color: 'E0E0E0', style: BorderStyle.SINGLE, size: 4, space: 4 },
        },
      }),
    ],
  });
}

export function buildFooter(preset: DonorPreset): Footer {
  const dateStr = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  return new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: 'Athar أثر — Confidential', font: FONT, size: 16, color: LIGHT_GRAY }),
          new TextRun({ text: `\t${dateStr}`, font: FONT, size: 16, color: LIGHT_GRAY }),
        ],
        tabStops: [{ type: 'right', position: convertInchesToTwip(6.5) }],
        border: {
          top: { color: 'E0E0E0', style: BorderStyle.SINGLE, size: 4, space: 4 },
        },
      }),
    ],
  });
}

// ── Standard sections ─────────────────────────────────────────────────────────

export function buildExecutiveSummary(result: AnalysisResult): Paragraph[] {
  const sections: Paragraph[] = [h1('Executive Summary')];

  // 2-3 paragraphs from key_findings
  const chunks: string[][] = [];
  const perChunk = Math.ceil(result.key_findings.length / 3);
  for (let i = 0; i < result.key_findings.length; i += perChunk) {
    chunks.push(result.key_findings.slice(i, i + perChunk));
  }

  for (const chunk of chunks.slice(0, 3)) {
    sections.push(body(chunk.join(' ')));
  }

  return sections;
}

export function buildMethodologyNote(result: AnalysisResult, preset: DonorPreset): Paragraph[] {
  return [
    h1('Methodology Note'),
    body(preset.methodologyNote),
    spacer(1),
    inlineLabel('Data Collection Method', result.transcript_type === 'SSI' ? preset.ssiLabel : preset.fgdLabel),
    inlineLabel('Sample Size', result.sample_size ? `${result.sample_size} participants` : 'Not specified'),
    inlineLabel('Words Analyzed', result.word_count_analyzed.toLocaleString()),
    inlineLabel('Analysis Approach', result.methodology),
    ...(result.collection_date ? [inlineLabel('Collection Period', result.collection_date)] : []),
    ...(result.confidence_note ? [spacer(1), body(result.confidence_note)] : []),
  ];
}

export function buildRecommendations(result: AnalysisResult): Paragraph[] {
  const sections: Paragraph[] = [h1('Recommendations')];
  result.recommendations.forEach((rec, i) => {
    sections.push(numberedItem(i + 1, rec));
  });
  return sections;
}

export function buildCrossCuttingIssues(result: AnalysisResult): Paragraph[] {
  const sections: Paragraph[] = [h1('Cross-Cutting Issues and Limitations')];
  result.gaps_and_limitations.forEach(gap => {
    sections.push(bullet(gap));
  });
  return sections;
}

export function buildDataRetentionAnnex(): Paragraph[] {
  return [
    h1('Annex A: Data Retention Statement'),
    body(
      'This report was generated by Athar (أثر), a qualitative data analysis platform built with a zero-retention architecture. The following technical measures were in place during the analysis:'
    ),
    bullet('All transcript text was processed entirely in browser memory and was never transmitted as a file.'),
    bullet('The analysis API endpoint runs on an Edge runtime with no persistent filesystem access.'),
    bullet('No transcript data, extracted text, or analysis outputs were stored in any database or log system.'),
    bullet('The generated report was assembled in server memory and streamed directly to the user. No file was written to disk.'),
    bullet('Response headers (Cache-Control: no-store, X-Athar-Retention: zero) were applied to all API responses.'),
    spacer(1),
    body(
      'Users are advised to store this report in accordance with their organization\'s data governance policy. Once downloaded, the document is the sole responsibility of the receiving organization.'
    ),
    spacer(1),
    new Paragraph({
      children: [
        new TextRun({ text: 'Platform: ', font: FONT, size: 20, bold: true, color: TEAL }),
        new TextRun({ text: 'Athar أثر · athar.ai', font: FONT, size: 20 }),
      ],
    }),
  ];
}

export function buildMethodologyGlossary(): Paragraph[] {
  const terms = [
    ['Thematic Analysis', 'An inductive qualitative method for identifying, analyzing, and interpreting patterns of meaning (themes) within a dataset. Based on the Braun & Clarke (2006) framework.'],
    ['Framework Analysis', 'A structured deductive approach that organizes data within a predefined analytical matrix, ideal for policy-aligned research with predetermined indicators.'],
    ['Grounded Theory Coding', 'An approach that builds theory from data through iterative open coding, axial coding, and selective coding stages.'],
    ['Content Analysis', 'A systematic method for quantifying and categorizing qualitative content, producing frequency counts and category distributions.'],
    ['SSI / KII', 'Semi-Structured Interview / Key Informant Interview — individual conversations guided by a topic list but allowing for exploratory follow-up.'],
    ['FGD', 'Focus Group Discussion — a moderated group conversation (typically 6–10 participants) designed to surface collective perspectives and community-level insights.'],
    ['MEAL', 'Monitoring, Evaluation, Accountability, and Learning — the organizational function responsible for tracking program performance and generating adaptive management evidence.'],
    ['Logframe', 'Logical Framework — a project management tool that maps inputs, activities, outputs, outcomes, and indicators into a structured matrix.'],
    ['Evidence Strength', 'A judgment of how well the qualitative data substantiates a finding, based on frequency of mention, consistency across participants, and depth of elaboration.'],
  ];

  const sections: Paragraph[] = [h1('Annex B: Methodology Glossary')];

  for (const [term, definition] of terms) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${term}: `, font: FONT, size: 22, bold: true, color: TEAL }),
          new TextRun({ text: definition, font: FONT, size: 22, color: BLACK }),
        ],
        spacing: { after: 120 },
      })
    );
  }

  return sections;
}

export function buildFullThemeCodingTable(result: AnalysisResult): Paragraph[] {
  const rows: TableRow[] = [
    new TableRow({
      children: ['Theme', 'Frequency', 'Sub-themes', 'Quotes'].map(header =>
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: header, bold: true, color: WHITE, font: FONT, size: 20 })],
          })],
          shading: { type: ShadingType.SOLID, color: TEAL },
          width: { size: 25, type: WidthType.PERCENTAGE },
        })
      ),
      tableHeader: true,
    }),
    ...result.themes.map(theme =>
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: theme.name, font: FONT, size: 20 })] })],
            width: { size: 25, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: `×${theme.frequency}`, font: FONT, size: 20 })] })],
            width: { size: 25, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: theme.sub_themes.map(s => s.name).join(', ') || '—', font: FONT, size: 20 })] })],
            width: { size: 25, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: `${theme.quotes.length}`, font: FONT, size: 20 })] })],
            width: { size: 25, type: WidthType.PERCENTAGE },
          }),
        ],
      })
    ),
  ];

  return [
    h1('Annex A: Full Theme Coding Summary'),
    new Table({
      rows,
      width: { size: 100, type: WidthType.PERCENTAGE },
    }),
  ];
}

// ── Document assembly ─────────────────────────────────────────────────────────

export interface WordExportOptions {
  result: AnalysisResult;
  structure: 'thematic' | 'indicator-led';
  donorPreset: DonorPreset;
  language: 'en' | 'ar';
  orgName?: string;
  projectName?: string;
}
