/**
 * Canonical AnalysisResult type — shared across all exporters and API routes.
 * This is the output contract from the LLM analysis step.
 */

export type EvidenceStrength = 'Strong' | 'Moderate' | 'Weak' | 'Not found';

export type TranscriptType = 'SSI' | 'FGD' | 'Mixed';

export interface SubTheme {
  name: string;
  description: string;
}

export interface Quote {
  text: string;
  speaker?: string;
}

export interface Theme {
  name: string;
  description: string;
  frequency: number;
  quotes: string[];        // raw quote strings for simplicity
  sub_themes: SubTheme[];
}

export interface LogframeAlignment {
  indicator: string;
  aligned_theme: string;
  evidence_strength: EvidenceStrength;
  supporting_quotes_count: number;
}

export interface AnalysisResult {
  /** Sector of the intervention, e.g. "WASH", "Protection", "Livelihoods" */
  sector: string;
  /** Methodology used, e.g. "Thematic Analysis (Braun & Clarke)" */
  methodology: string;
  /** Type of primary data source */
  transcript_type: TranscriptType;
  /** Number of words in the analyzed transcript */
  word_count_analyzed: number;
  /** Flat list of key insights extracted */
  key_findings: string[];
  /** All identified themes, sorted by frequency (descending) */
  themes: Theme[];
  /** Gaps, caveats, and methodological limitations */
  gaps_and_limitations: string[];
  /** Concrete, actionable recommendations */
  recommendations: string[];
  /** Optional — logframe alignment entries (empty array if no logframe provided) */
  logframe_alignment: LogframeAlignment[];
  /** Optional note on data quality or confidence */
  confidence_note?: string;
  /** Sample size if known */
  sample_size?: number;
  /** Data collection date or period */
  collection_date?: string;
}

/**
 * Minimal mock result for development and testing of exporters.
 * Never sent to users — used only for UI state initialization.
 */
export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  sector: 'WASH',
  methodology: 'Thematic Analysis (Braun & Clarke)',
  transcript_type: 'FGD',
  word_count_analyzed: 4820,
  key_findings: [
    'Communities report significant reduction in access to clean water sources over the past 12 months.',
    'Women and girls bear disproportionate burden of water collection, averaging 4 hours daily.',
    'Existing water points require maintenance — 3 of 7 surveyed sites were non-functional.',
    'Community hygiene knowledge is strong but practice is constrained by infrastructure gaps.',
  ],
  themes: [
    {
      name: 'Access to Clean Water',
      description:
        'Participants consistently described deteriorating access to safe water sources. Key drivers include infrastructure decay, seasonal variation, and distance to functional water points. Women are primary collectors and report the highest burden.',
      frequency: 24,
      quotes: [
        'We walk two hours each way just to find water that is not clean.',
        'The borehole near the school has been broken for three months. Nobody fixed it.',
        'Before, we had water. Now we compete with livestock at the same pond.',
      ],
      sub_themes: [
        { name: 'Distance to Water Points', description: 'Average collection distance exceeds 5km for 60% of households.' },
        { name: 'Infrastructure Quality', description: '3 of 7 surveyed water points non-functional at time of data collection.' },
        { name: 'Gendered Burden', description: 'Women and girls are primary water collectors in all surveyed communities.' },
      ],
    },
    {
      name: 'Hygiene Practices',
      description:
        'Community members demonstrate strong conceptual knowledge of hygiene practices. However, sustainable practice is constrained by soap availability, water quantity, and handwashing infrastructure at key behavioral moments.',
      frequency: 17,
      quotes: [
        'We know we should wash hands, but sometimes there is not enough water even for drinking.',
        'The hygiene promoter taught us well, but we have no soap most of the time.',
      ],
      sub_themes: [
        { name: 'Knowledge Gaps', description: 'Misconceptions persist around safe water storage methods.' },
        { name: 'Soap Availability', description: 'Soap is reported as consistently unavailable in 5 of 6 communities.' },
      ],
    },
    {
      name: 'Community Governance',
      description:
        'Water management committees exist in three of six communities surveyed but lack formal mandate and capacity for fee collection and maintenance oversight.',
      frequency: 11,
      quotes: [
        'We have a committee but nobody knows what they are supposed to do.',
      ],
      sub_themes: [],
    },
  ],
  gaps_and_limitations: [
    'Sample limited to 6 communities — findings may not reflect district-wide conditions.',
    'Data collected during dry season — water access may differ during peak rainfall.',
    'Male perspectives underrepresented (30% of FGD participants).',
  ],
  recommendations: [
    'Prioritize rehabilitation of 3 non-functional boreholes before next dry season.',
    'Strengthen water management committee capacity with formal training and mandate documentation.',
    'Integrate hygiene promotion with soap distribution to address practice-knowledge gap.',
    'Conduct seasonal follow-up assessment during rainy season to validate year-round findings.',
  ],
  logframe_alignment: [
    {
      indicator: 'Output 1.1: % HH with access to safe water within 1km',
      aligned_theme: 'Access to Clean Water',
      evidence_strength: 'Strong',
      supporting_quotes_count: 3,
    },
    {
      indicator: 'Outcome 1: Improved hygiene practices among target population',
      aligned_theme: 'Hygiene Practices',
      evidence_strength: 'Moderate',
      supporting_quotes_count: 2,
    },
    {
      indicator: 'Output 2.1: # water management committees operational',
      aligned_theme: 'Community Governance',
      evidence_strength: 'Weak',
      supporting_quotes_count: 1,
    },
  ],
  confidence_note: 'Analysis based on 6 FGDs with 42 participants. Findings are indicative and should be validated through quantitative methods.',
  sample_size: 42,
  collection_date: 'March 2026',
};
