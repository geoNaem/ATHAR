import { MethodologyId, MethodologyConfig } from '../types/methodology';

export const METHODOLOGIES: MethodologyConfig[] = [
  {
    id: MethodologyId.THEMATIC,
    name: 'Thematic Analysis (Braun & Clarke)',
    description: 'Identifies patterns of meaning across your transcript using inductive coding.',
    outputFormat: 'Themes + sub-themes + supporting quotes',
    badgeLabel: 'Most common in MEAL',
    isPopular: true
  },
  {
    id: MethodologyId.FRAMEWORK,
    name: 'Framework Analysis',
    description: 'Applies a predefined analytical framework to your data — ideal when you have logframe indicators.',
    outputFormat: 'Matrix aligned to your indicators',
    badgeLabel: 'Best with logframe'
  },
  {
    id: MethodologyId.GROUNDED,
    name: 'Grounded Theory Coding',
    description: 'Builds theory from the ground up — open coding, then axial, then selective.',
    outputFormat: 'Coding tree + category relationships',
    badgeLabel: 'For exploratory research'
  },
  {
    id: MethodologyId.CONTENT,
    name: 'Content Analysis',
    description: 'Counts and categorizes — gives you frequency data and category breakdowns.',
    outputFormat: 'Frequency table + category chart data',
    badgeLabel: 'For structured responses'
  },
  {
    id: MethodologyId.AUTO,
    name: 'Auto-detect',
    description: 'Athar reads your transcript structure and selects the most appropriate method.',
    outputFormat: 'Depends on detection result',
    badgeLabel: 'Not sure? Start here'
  }
];

export function getSystemPromptKey(id: MethodologyId): string {
  const map: Record<MethodologyId, string> = {
    [MethodologyId.THEMATIC]: 'prompt_thematic_v2',
    [MethodologyId.FRAMEWORK]: 'prompt_framework_v1',
    [MethodologyId.GROUNDED]: 'prompt_grounded_v1',
    [MethodologyId.CONTENT]: 'prompt_content_v1',
    [MethodologyId.AUTO]: 'prompt_auto_router'
  };
  return map[id];
}
