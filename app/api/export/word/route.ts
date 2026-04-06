import { NextRequest, NextResponse } from 'next/server';
import { buildWordExport } from '@/lib/exporters/word-exporter';
import { AnalysisResult } from '@/types/analysis-result';
import { DonorPresetId } from '@/lib/exporters/donor-presets';

export const runtime = 'nodejs';

/**
 * Word Export API Route
 * Receives: { result, structure, donorPreset, language }
 * Streams a high-fidelity .docx file directly to the browser.
 */
export async function POST(request: NextRequest) {
  try {
    const { result, structure, donorPreset, language } = await request.json();

    if (!result || !structure || !donorPreset) {
      return NextResponse.json(
        { error: 'Missing export data or configuration.', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    const docBuffer = await buildWordExport(
      result as AnalysisResult,
      structure as 'thematic' | 'indicator-led',
      donorPreset as DonorPresetId,
      language as 'en' | 'ar'
    );

    const date = new Date().toISOString().split('T')[0];
    const filename = `athar-analysis-${date}.docx`;

    return new Response(docBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, max-age=0',
        'X-Athar-Retention': 'zero'
      },
    });

  } catch (error: any) {
    console.error('Word Export Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to generate Word report. Please try again.', code: 'EXPORT_ERROR' },
      { status: 500 }
    );
  }
}
