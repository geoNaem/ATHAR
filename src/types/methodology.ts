export enum MethodologyId {
  THEMATIC = 'thematic',
  FRAMEWORK = 'framework',
  GROUNDED = 'grounded',
  CONTENT = 'content',
  AUTO = 'auto'
}

export type MethodologyConfig = {
  id: MethodologyId;
  name: string;
  description: string;
  outputFormat: string;
  badgeLabel: string;
  isPopular?: boolean;
};
