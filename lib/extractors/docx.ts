import mammoth from 'mammoth';

/**
 * Extracts raw text from a DOCX file using mammoth.
 * Processes in-memory only.
 */
export async function extractDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (result.messages.length > 0) {
      console.warn('Mammoth extraction messages:', result.messages);
    }
    
    return result.value.trim();
  } catch (error) {
    console.error('DOCX Extraction Error:', error);
    throw new Error('Failed to read DOCX file. Please ensure it is a valid Word document.');
  }
}
