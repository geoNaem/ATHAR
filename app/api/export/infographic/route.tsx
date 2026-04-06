import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import InfographicPDF from '../../../../lib/exporters/infographic-pdf';
import { prepareInfographicData } from '../../../../lib/exporters/infographic-builder';
import { AnalysisResult } from '../../../../types/analysis-result';

export const runtime = 'nodejs';

/**
 * Infographic PDF API Route
 * Receives: { result, language }
 * Streams a branded visual summary .pdf directly to the browser.
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

    const data = prepareInfographicData(result as AnalysisResult);
    const pdfBuffer = await renderToBuffer(
      <InfographicPDF data={data} language={language as 'en' | 'ar'} />
    );

    const date = new Date().toISOString().split('T')[0];
    const filename = `athar-infographic-${date}.pdf`;

    return new Response(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, max-age=0',
        'X-Athar-Retention': 'zero'
      },
    });

  } catch (error: any) {
    console.error('PDF Export Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to generate PDF summary. Please try again.', code: 'EXPORT_ERROR' },
      { status: 500 }
    );
  }
}
