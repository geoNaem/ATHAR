import { MethodologyId } from '../types/methodology';

/**
 * Maps a front-end MethodologyId to its corresponding system prompt key.
 * Used by the analysis pipeline to select the correct analytical framework.
 */
export function getMethodologyPromptKey(id: MethodologyId): string {
  switch (id) {
    case 'thematic':
      return 'THEMATIC_ANALYSIS_PROMPT';
    case 'framework':
      return 'FRAMEWORK_ANALYSIS_PROMPT';
    case 'grounded':
      return 'GROUNDED_THEORY_PROMPT';
    case 'content':
      return 'CONTENT_ANALYSIS_PROMPT';
    case 'auto':
      return 'AUTO_DETECT_PROMPT';
    default:
      return 'THEMATIC_ANALYSIS_PROMPT';
  }
}
