import { LogframeIndicator } from '../types/context';

export function parseLogframeText(text: string): LogframeIndicator[] {
  if (!text || text.trim() === '') return [];
  
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  return lines.map(line => {
    try {
      // Cleanest delimiter split isolating indicator name from metrics suffix
      const splitChar = line.includes('—') ? '—' : (line.includes('-') ? '-' : null);
      
      if (!splitChar) {
        return { indicator_name: line, raw_text: line };
      }
      
      const [namePart, ...metricsParts] = line.split(splitChar);
      const indicator_name = namePart.trim();
      const metricsText = metricsParts.join(splitChar); // recombine explicitly trailing dashes 
      
      let baseline: string | undefined;
      let target: string | undefined;
      
      const baselineMatch = metricsText.match(/Baseline:\s*([^,]+)/i);
      const targetMatch = metricsText.match(/Target:\s*([^,]+)/i);
      
      if (baselineMatch) baseline = baselineMatch[1].trim();
      if (targetMatch) target = targetMatch[1].trim();
      
      if (!baseline && !target) {
        return { indicator_name, raw_text: line };
      }
      
      return {
        indicator_name,
        baseline,
        target,
        raw_text: line
      };
    } catch {
      return { indicator_name: line, raw_text: line };
    }
  });
}
