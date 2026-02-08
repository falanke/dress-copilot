/**
 * Chrome Storage Utilities
 */

export interface AIConfig {
  apiKey: string;
  provider: 'zhipu' | 'qwen' | 'minimax' | 'custom';
  apiBaseUrl?: string;
  model?: string;
}

export interface SearchResult {
  query: string;
  results: any[];
  timestamp: number;
}

const STORAGE_KEYS = {
  AI_CONFIG: 'aiConfig',
  SEARCH_HISTORY: 'searchHistory',
};

/**
 * Get AI configuration from storage
 */
export async function getAIConfig(): Promise<AIConfig | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEYS.AI_CONFIG, (result) => {
      resolve(result[STORAGE_KEYS.AI_CONFIG] || null);
    });
  });
}

/**
 * Save AI configuration to storage
 */
export async function saveAIConfig(config: AIConfig): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEYS.AI_CONFIG]: config }, () => {
      resolve();
    });
  });
}

/**
 * Get search history
 */
export async function getSearchHistory(): Promise<SearchResult[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEYS.SEARCH_HISTORY, (result) => {
      resolve(result[STORAGE_KEYS.SEARCH_HISTORY] || []);
    });
  });
}

/**
 * Save search result to history
 */
export async function saveSearchResult(search: SearchResult): Promise<void> {
  const history = await getSearchHistory();
  const newHistory = [search, ...history].slice(0, 10); // Keep last 10 searches

  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEYS.SEARCH_HISTORY]: newHistory }, () => {
      resolve();
    });
  });
}

/**
 * Clear search history
 */
export async function clearSearchHistory(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove(STORAGE_KEYS.SEARCH_HISTORY, () => {
      resolve();
    });
  });
}

/**
 * Get API base URL (use local dev URL if not configured)
 */
export async function getApiBaseUrl(): Promise<string> {
  const config = await getAIConfig();
  return config?.apiBaseUrl || 'http://localhost:3000';
}
