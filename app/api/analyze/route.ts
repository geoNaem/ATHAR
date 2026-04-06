import { NextRequest, NextResponse } from 'next/server';
import { runAnalysis } from '../../../lib/analysis-pipeline';
import { ZeroRetentionGuard } from '../../../lib/zero-retention';

export const runtime = 'edge';

/**
 * Main Analysis Endpoint (SaaS Phase 1)
 * Receives: { text: string, config: AnalysisConfig }
 * Returns: AnalysisResult JSON
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── 1. SECURITY ASSERTIONS (Zero-Retention Architecture) ──────────
    // Verify no file objects were leaked into the JSON body
    ZeroRetentionGuard.assertNoFile(body);
    
    const { text, config } = body;
    
    if (!text || !config) {
      return NextResponse.json(
        { error: 'Missing transcript text or configuration.', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    // ── 2. EXECUTE THE ANALYTICAL PIPELINE ────────────────────────────
    const result = await runAnalysis(text, config);

    // ── 3. SANITIZED RESPONSE (With Security Headers) ────────────────
    const response = NextResponse.json(result);
    
    // Add anti-retention headers as an additional layer of security
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Athar-Retention', 'zero-memory-only');

    return response;

  } catch (error: any) {
    console.error('API Error /api/analyze:', 
      error.message, 
      '\nStack:', error.stack
    );
    
    const status = error.message?.includes('AI Analysis failed') ? 500 : 422;
    const code = error.message?.includes('malformed') ? 'PARSE_ERROR' : 'API_ERROR';

    return NextResponse.json(
      { error: error.message || 'The analytical service is currently unavailable.', code },
      { status }
    );
  }
}
