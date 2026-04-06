import { AnalysisResult } from '../../types/analysis-result';

export interface InfographicData {
  sector: string
  methodology: string
  transcript_type: string
  date: string
  top5themes: Array<{
    name: string
    frequency: number
    maxFrequency: number
  }>
  additionalThemeCount: number
  top4findings: string[]
  pullQuote: string
  wordCount: number
}

export function prepareInfographicData(
  result: AnalysisResult
): InfographicData {
  const sorted = [...result.themes]
    .sort((a, b) => b.frequency - a.frequency);
  const top5 = sorted.slice(0, 5);
  const maxFreq = top5[0]?.frequency ?? 1;
  
  return {
    sector: result.sector,
    methodology: result.methodology,
    transcript_type: result.transcript_type,
    date: new Date().toLocaleDateString('en-GB', {
      month: 'long', year: 'numeric'
    }),
    top5themes: top5.map(t => ({
      name: t.name.length > 24 ? t.name.slice(0, 24) + '…' : t.name,
      frequency: t.frequency,
      maxFrequency: maxFreq,
    })),
    additionalThemeCount: Math.max(0, result.themes.length - 5),
    top4findings: result.key_findings
      .slice(0, 4)
      .map(f => f.length > 110 ? f.slice(0, 110) + '…' : f),
    pullQuote: (
      result.themes[0]?.quotes[0] ?? result.key_findings[0] ?? ''
    ).slice(0, 200),
    wordCount: result.word_count_analyzed,
  }
}
