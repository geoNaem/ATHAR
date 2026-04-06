import * as mammoth from 'mammoth';

export async function extractDocxText(file) {
  const arrayBuffer = await file.arrayBuffer();
  // mammoth extracts raw text, preserving paragraph structure natively
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}
