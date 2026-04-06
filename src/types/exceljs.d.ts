import 'exceljs';

declare module 'exceljs' {
  interface WorkbookView {
    rightToLeft?: boolean;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }
}
