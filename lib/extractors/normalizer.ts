/**
 * Cleans extracted text to remove artifacts and excessive whitespace
 * while preserving paragraph structure for analysis.
 */
export function normalizeText(raw: string): string {
  if (!raw) return '';
  
  return raw
    .replace(/\r\n/g, '\n')      // Lowercase CRLF
    .replace(/\t/g, '    ')     // Normalize tabs
    .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
    .trim();
}

/**
 * Detects the dominant language based on character range frequency.
 */
export function detectLanguage(text: string): 'en' | 'ar' | 'mixed' {
  if (!text) return 'en';
  
  // Clean text and take a sample for performance (first 10k chars)
  const sample = text.slice(0, 10000);
  
  // Count Arabic Unicode range (0600 - 06FF)
  const arabicMatch = sample.match(/[\u0600-\u06FF]/g);
  const arabicCount = arabicMatch ? arabicMatch.length : 0;
  
  // Count Latin characters (standard ASCII)
  const latinMatch = sample.match(/[a-zA-Z]/g);
  const latinCount = latinMatch ? latinMatch.length : 0;
  
  const totalRelevantChars = arabicCount + latinCount;
  
  if (totalRelevantChars === 0) return 'en'; // Default
  
  const arabicRatio = arabicCount / totalRelevantChars;
  const latinRatio = latinCount / totalRelevantChars;
  
  if (arabicRatio > 0.6) return 'ar';
  if (latinRatio > 0.6) return 'en';
  
  return 'mixed';
}
