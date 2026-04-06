import * as XLSX from 'xlsx';

/**
 * Reads an Excel workbook and converts all sheets into a single
 * tab-separated string for analysis.
 */
export async function extractXlsx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    const allSheetsText = workbook.SheetNames.map((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      // Convert to tab-separated text to retain data structure context
      const sheetText = XLSX.utils.sheet_to_txt(sheet);
      return `--- SHEET: ${sheetName} ---\n${sheetText}`;
    }).join('\n\n');
    
    return allSheetsText.trim();
  } catch (error) {
    console.error('XLSX Extraction Error:', error);
    throw new Error('Failed to read Excel file. Please ensure it is a valid .xlsx file.');
  }
}
