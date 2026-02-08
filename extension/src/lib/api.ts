import type { AnalyzeRequest, AnalyzeResponse } from '../types';

// Local dev URL, needs replacement in production
const API_BASE_URL = 'http://localhost:3000';

export async function analyzeImage(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
