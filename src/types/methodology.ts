export type MethodologyId = 
  'thematic' | 'framework' | 'grounded' | 'content' | 'auto'

export interface MethodologyConfig {
  id: MethodologyId
  label: string
  description: string
  outputFormat: string
  badge?: string
}
