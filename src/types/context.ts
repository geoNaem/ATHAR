export type DataType = 'SSI' | 'FGD';

export type LogframeIndicator = {
  indicator_name: string;
  baseline?: string;
  target?: string;
  raw_text?: string;
};

export type ContextState = {
  sector: string;
  dataType: DataType | null;
  logframeText: string;
  parsedLogframe: LogframeIndicator[];
};
