export function normalizeText(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}

export function detectLanguage(text) {
  const arabicRegex = /[\u0600-\u06FF]/;
  const englishRegex = /[a-zA-Z]/;
  
  const hasArabic = arabicRegex.test(text);
  const hasEnglish = englishRegex.test(text);
  
  if (hasArabic && hasEnglish) return 'Mixed';
  if (hasArabic) return 'AR';
  return 'EN';
}
