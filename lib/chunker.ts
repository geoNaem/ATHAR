/**
 * Splits text into manageable chunks for LLM processing while 
 * preserving paragraph and sentence boundaries.
 */
export function chunkText(text: string, maxChars = 80000): string[] {
  if (!text) return [];
  if (text.length <= maxChars) return [text];

  const paragraphs = text.split('\n\n');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    if ((currentChunk.length + para.length + 2) <= maxChars) {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      
      // If a single paragraph is too large, split it by sentence
      if (para.length > maxChars) {
        const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
        let subChunk = '';
        for (const sent of sentences) {
          if ((subChunk.length + sent.length) <= maxChars) {
            subChunk += sent;
          } else {
            if (subChunk) chunks.push(subChunk);
            subChunk = sent;
          }
        }
        currentChunk = subChunk;
      } else {
        currentChunk = para;
      }
    }
  }

  if (currentChunk) chunks.push(currentChunk);
  
  return chunks;
}
