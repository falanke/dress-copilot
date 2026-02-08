export interface AIAction {
  type: 'scroll' | 'click' | 'favorite';
  target?: string;
}

export interface AIRecommendation {
  index: number;
  title: string;
  brand: string;
  price: string;
  match_reason: string;
  action: string;
}

export interface AIConfig {
  apiKey: string;
  provider: 'zhipu' | 'qwen' | 'minimax' | 'custom';
}
