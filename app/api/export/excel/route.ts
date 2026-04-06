import { NextRequest, NextResponse } from 'next/server';
import { buildExcelExport } from '@/lib/exporters/excel-exporter';
import { AnalysisResult } from '@/types/analysis-result';

export const runtime = 'nodejs';

/**
 * Excel Export API Route
 * Receives: { result, language }
 * Streams a structured .xlsx matrix directly to the browser.
 */
export async function POST(request: NextRequest) {
  try {
    const { result, language } = await request.json();

    if (!result) {
      return NextResponse.json(
        { error: 'Missing analysis result data.', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    const xlsxBuffer = await buildExcelExport(
      result as AnalysisResult,
      language as 'en' | 'ar'
    );

    const date = new Date().toISOString().split('T')[0];
    const filename = `athar-matrix-${date}.xlsx`;

    return new Response(xlsxBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
        'X-Athar-Retention': 'zero'
      },
    });

  } catch (error: any) {
    console.error('Excel Export Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to generate Excel matrix. Please try again.', code: 'EXPORT_ERROR' },
      { status: 500 }
    );
  }
}
