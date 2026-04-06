export interface AnalysisResult {
  methodology: string
  sector: string
  transcript_type: 'SSI' | 'FGD'
  themes: Array<{
    id: string
    name: string
    description: string
    frequency: number
    quotes: string[]
    sub_themes: Array<{ name: string; description: string }>
  }>
  logframe_alignment: Array<{
    indicator: string
    aligned_theme: string
    evidence_strength: 'Strong' | 'Moderate' | 'Weak' | 'Not found'
  }>
  key_findings: string[]
  recommendations: string[]
  gaps_and_limitations: string[]
  word_count_analyzed: number
  confidence_note: string
}
