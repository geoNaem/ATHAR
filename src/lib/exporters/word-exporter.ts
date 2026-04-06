import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Header, 
  Footer, 
  PageNumber, 
  Table, 
  TableRow, 
  TableCell, 
  VerticalAlign, 
  AlignmentType, 
  HeadingLevel, 
  BorderStyle, 
  PageBreak, 
  ShadingType,
  WidthType,
  SectionType
} from 'docx';
import { AnalysisResult } from '@/types/analysis-result';
import { DonorPresetId, getDonorPreset, DonorPreset } from './donor-presets';
import { buildThematicSections } from './report-structures/thematic';
import { buildIndicatorSections } from './report-structures/indicator-led';
import { AR_LABELS } from './rtl-config';

const COLORS = {
  SIENNA: 'C84B31',
  BONE: 'F5EDD9',
  DARK: '2C1503',
  ACCENT: 'E8A87C'
};

export async function buildWordExport(
  result: AnalysisResult,
  structureId: 'thematic' | 'indicator-led',
  donorPresetId: DonorPresetId,
  language: 'en' | 'ar'
): Promise<Buffer> {
  const preset = getDonorPreset(donorPresetId);
  const isAr = language === 'ar';
  
  const coverChildren = buildCoverPage(result, preset, 'Organization Name', 'Project Title Placeholder', isAr);
  
  const bodyContent = structureId === 'thematic'
    ? buildThematicSections(result, preset, language)
    : buildIndicatorSections(result, preset, language);

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'bullets',
          levels: [{ level: 0, format: 'bullet', text: '•', alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
        },
        {
          reference: 'numbers',
          levels: [{ level: 0, format: 'decimal', text: '%1.', alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
        }
      ]
    },
    sections: [
      {
        properties: { type: SectionType.CONTINUOUS },
        children: coverChildren
      },
      {
        properties: { 
          type: SectionType.NEXT_PAGE,
          page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: isAr ? AlignmentType.LEFT : AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: isAr ? `تحليل أثر — ${result.sector}` : `Athar Analysis — ${result.sector} `, size: 18, color: '888888', font: isAr ? 'Traditional Arabic' : 'Arial' }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '888888' })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
                children: [
                  new TextRun({ text: isAr ? AR_LABELS.retentionNote : 'Athar أثر — Confidential | Zero data retention platform', size: 16, color: '888888', font: isAr ? 'Traditional Arabic' : 'Arial' })
                ]
              })
            ]
          })
        },
        children: bodyContent
      }
    ]
  });

  return await Packer.toBuffer(doc);
}

function buildCoverPage(result: AnalysisResult, preset: DonorPreset, org: string, project: string, isAr: boolean): (Paragraph | Table)[] {
  const align = isAr ? AlignmentType.RIGHT : AlignmentType.RIGHT; // Org name always right
  const center = AlignmentType.CENTER;
  const font = isAr ? 'Traditional Arabic' : 'Arial';

  const elements: (Paragraph | Table)[] = [
    new Paragraph({
      alignment: align,
      bidirectional: isAr,
      children: [new TextRun({ text: org, size: 22, color: '888888', font })]
    }),
    ...Array(6).fill(0).map(() => new Paragraph({})),
    new Table({
      alignment: center,
      width: { size: 30, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: COLORS.BONE, type: ShadingType.CLEAR },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 2, color: COLORS.ACCENT },
                bottom: { style: BorderStyle.SINGLE, size: 2, color: COLORS.ACCENT },
                left: { style: BorderStyle.SINGLE, size: 2, color: COLORS.ACCENT },
                right: { style: BorderStyle.SINGLE, size: 2, color: COLORS.ACCENT }
              },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  alignment: center,
                  children: [new TextRun({ text: isAr ? 'شعار المنظمة' : 'Organization Logo', size: 18, italics: true, color: '888888', font })]
                })
              ]
            })
          ]
        })
      ]
    }),
    ...Array(3).fill(0).map(() => new Paragraph({})),
    new Paragraph({
      alignment: center,
      bidirectional: isAr,
      children: [new TextRun({ text: isAr ? 'تقرير التحليل النوعي' : 'Qualitative Analysis Report', size: 48, bold: true, color: COLORS.DARK, font })],
      spacing: { after: 120 }
    }),
    new Paragraph({
      alignment: center,
      bidirectional: isAr,
      children: [new TextRun({ text: `${result.sector} | ${result.transcript_type}`, size: 28, color: COLORS.ACCENT, font })],
      spacing: { after: 240 }
    }),
    new Paragraph({
      alignment: center,
      bidirectional: isAr,
      children: [new TextRun({ text: project, size: 24, color: COLORS.DARK, font })],
      spacing: { after: 120 }
    }),
    new Paragraph({
      alignment: center,
      bidirectional: isAr,
      children: [new TextRun({ text: isAr ? `تاريخ التحليل: ${new Date().toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}` : `Analysis Date: ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`, size: 20, color: '888888', font })],
      spacing: { after: 480 }
    }),
    new Paragraph({
      alignment: center,
      bidirectional: isAr,
      children: [
        new TextRun({ text: isAr ? 'سري — للاستخدام الداخلي فقط.' : 'CONFIDENTIAL — For internal use only.', size: 18, italics: true, color: '888888', font }),
        new TextRun({ break: 1, text: isAr ? 'تعامل مع هذا المستند حسب سياسة حماية بيانات منظمتك.' : 'Handle in accordance with your organization’s data protection policy.', size: 18, italics: true, color: '888888', font })
      ],
      spacing: { after: 480 }
    }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.SIENNA, space: 1 } }
    }),
    new Paragraph({
      alignment: center,
      bidirectional: isAr,
      children: [new TextRun({ text: isAr ? AR_LABELS.generatedBy : preset.coverFooterText, size: 16, color: '888888', font })],
      spacing: { before: 120 }
    })
  ];

  return elements;
}
