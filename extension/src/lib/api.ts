/**
 * Backend API Client
 */

export interface AnalyzeRequest {
  image: string;
  prompt: string;
  config: {
    apiKey: string;
    provider?: string;
  };
}

export interface AnalyzeResponse {
  success: boolean;
  data?: {
    content: string;
    usage?: any;
  };
  error?: string;
}

import { getApiBaseUrl } from './storage';

/**
 * Analyze image using backend API
 */
export async function analyzeImage(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  try {
    const apiBaseUrl = await getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: req.image,
        prompt: req.prompt,
        apiKey: req.config.apiKey,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '网络错误，请检查后端服务是否运行'
    };
  }
}

/**
 * Test API connection
 */
export async function testApiConnection(config: { apiKey: string; apiBaseUrl?: string }): Promise<boolean> {
  try {
    const apiBaseUrl = config.apiBaseUrl || 'http://localhost:3000';
    const response = await fetch(`${apiBaseUrl}/`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}
