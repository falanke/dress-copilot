export interface AIConfig {
  apiKey: string;
  provider: 'zhipu' | 'qwen' | 'minimax' | 'custom';
  custom?: {
    baseUrl: string;
    model: string;
  };
}

export interface VisionRequest {
  image: string;
  prompt: string;
}

export interface VisionResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
