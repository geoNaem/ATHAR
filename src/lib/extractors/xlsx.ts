import * as XLSX from 'xlsx';

export async function extractXlsxText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  let fullText = '';
  
  workbook.SheetNames.forEach(sheetName => {
    fullText += `[SHEET: ${sheetName}]\n`;
    const sheet = workbook.Sheets[sheetName];
    // Convert sheet to a 2D array and pipe-delimit columns for structural integrity
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    fullText += json.map(row => row.join(' | ')).join('\n');
    fullText += '\n\n';
  });
  
  return fullText;
}
