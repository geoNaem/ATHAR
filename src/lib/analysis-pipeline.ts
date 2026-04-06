import { AnalysisResult } from '../types/analysis-result';
import { MethodologyId } from '../types/methodology';
import { chunkText } from './chunker';
import * as thematic from './prompts/thematic';
import * as framework from './prompts/framework';
import * as grounded from './prompts/grounded';
import * as content from './prompts/content';
import * as auto from './prompts/auto';

interface AnalysisConfig {
  methodology: MethodologyId;
  sector: string;
  logframe: string;
  donorPreset: string;
  outputLanguage: 'en' | 'ar';
  transcriptType: 'SSI' | 'FGD';
}

/**
 * Orchestrates the full AI analysis pipeline: chunking, 
 * prompt selection, LLM invocation, and JSON parsing.
 */
export async function runAnalysis(
  text: string,
  config: AnalysisConfig
): Promise<AnalysisResult> {
  
  // 1. Chunking (Phase 1: Process first chunk only)
  const chunks = chunkText(text, 80000);
  const textToAnalyze = chunks[0];
  
  // 2. Select Prompt Module
  let promptModule: any;
  switch (config.methodology) {
    case 'thematic': promptModule = thematic; break;
    case 'framework': promptModule = framework; break;
    case 'grounded': promptModule = grounded; break;
    case 'content': promptModule = content; break;
    case 'auto': promptModule = auto; break;
    default: promptModule = thematic;
  }

  // 3. Build AI Message
  const systemPrompt = promptModule.SYSTEM_PROMPT;
  const userMessage = promptModule.buildUserMessage(textToAnalyze, config);

  // 4. Invoke LLM (Assuming Anthropic API)
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Analysis Error: Environment configuration missing.');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4000,
      temperature: 0,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(`AI Analysis failed: ${errData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const rawJson = data.content[0].text;

  // 5. Safe Parse & Return
  const result = safeParseAnalysis(rawJson);
  
  // Append metadata
  if (chunks.length > 1) {
    result.confidence_note += ` (Note: Analysis based on first 80,000 characters of a larger transcript.)`;
  }
  
  return result;
}

/**
 * Strips code fences and parses JSON safely.
 */
function safeParseAnalysis(raw: string): AnalysisResult {
  try {
    const clean = raw
      .replace(/^```json\n?/, '')
      .replace(/\n?```$/, '')
      .trim();
    
    const parsed = JSON.parse(clean) as AnalysisResult;
    
    // Ensure word count is populated
    if (!parsed.word_count_analyzed) {
      parsed.word_count_analyzed = 0; // Default
    }
    
    return parsed;
  } catch (error) {
    console.error('JSON Parse Error:', error, '\nRaw output:', raw);
    throw new Error('Analysis completed but the response was malformed. Please try again.');
  }
}
