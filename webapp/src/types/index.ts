export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface StylePhoto {
  id: string;
  url: string;
  file?: File;
}

export interface AnalyzeRequest {
  stylePhotos: string[]; // base64 encoded images
  screenshot: string; // base64 encoded screenshot
  query: string;
}

export interface ProductRecommendation {
  index: number;
  title: string;
  brand: string;
  price: string;
  match_reason: string;
  style_match_score?: number;
}

export interface AnalyzeResponse {
  success: boolean;
  recommendations?: ProductRecommendation[];
  error?: string;
}

export interface SearchHistory {
  id: string;
  query: string;
  results: ProductRecommendation[];
  timestamp: number;
  stylePhotos?: string[];
}
