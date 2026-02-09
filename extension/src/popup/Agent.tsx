import React, { useState, useEffect } from 'react';
import './Agent.css';
import { analyzeImage } from '../lib/api';
import { getAIConfig, getSearchHistory, saveSearchResult } from '../lib/storage';
import type { SearchResult } from '../lib/storage';
import type { AIRecommendation } from '../lib/types';

function Agent() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [results, setResults] = useState<AIRecommendation[]>([]);
  const [history, setHistory] = useState<SearchResult[]>([]);

  // Load search history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const h = await getSearchHistory();
    setHistory(h);
  };

  const handleStart = async () => {
    if (!query.trim()) {
      alert('请输入你的需求');
      return;
    }

    const config = await getAIConfig();
    if (!config?.apiKey) {
      alert('请先配置 API Key');
      setStatus('');
      return;
    }

    setStatus('正在分析页面...');

    try {
      // Capture current tab screenshot
      const image = await captureTab();

      // Construct prompt
      const prompt = constructPrompt(query);

      // Call backend API
      const response = await analyzeImage({
        image,
        prompt,
        config: { apiKey: config.apiKey, provider: config.provider || 'zhipu' }
      });

      if (!response.success || !response.data?.content) {
        alert('分析失败: ' + (response.error || '未知错误'));
        setStatus('');
        return;
      }

      // Parse AI response
      const aiResult = parseAIResponse(response.data.content);
      setResults(aiResult.recommendations || []);
      setStatus('分析完成！');

      // Save to history
      await saveSearchResult({
        query,
        results: aiResult.recommendations || [],
        timestamp: Date.now()
      });
      await loadHistory();

    } catch (error: any) {
      console.error('Agent error:', error);
      setStatus('');
      alert('发生错误: ' + error.message);
    }
  };

  const handleHistoryClick = async (item: SearchResult) => {
    setQuery(item.query);
    setResults(item.results);
  };

  function captureTab(): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.tabs.captureVisibleTab({ format: 'png' }, (dataUrl) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(dataUrl as string);
        }
      });
    });
  }

  function constructPrompt(userQuery: string): string {
    return `分析当前页面上的商品，找出符合用户需求的商品。

用户需求: ${userQuery}

请返回 JSON 格式，确保可以正确解析：
{
  "recommendations": [
    {
      "index": 0,
      "title": "商品标题",
      "brand": "品牌名",
      "price": "价格",
      "match_reason": "推荐理由 (20字以内)"
    }
  ]
}

只返回 JSON，不要有其他文字。`;
  }

  function parseAIResponse(content: string): { recommendations: AIRecommendation[] } {
    try {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { recommendations: [] };
    } catch {
      return { recommendations: [] };
    }
  }

  return (
    <div className="w-80 p-4 bg-white min-h-[400px]">
      <div className="header">
        <h1>👔 DressCopilot</h1>
        <p className="subtitle">程序员穿搭助手</p>
      </div>

      <div className="input-section">
        <label className="label">你想找什么衣服？</label>
        <textarea
          className="textarea"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例如：帮我挑几件春季外套，休闲风格，500 以内..."
        ></textarea>

        <button className="start-btn" onClick={handleStart}>
          {status || '🔍 开始挑选'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="results-section">
          <h3>为你推荐了 {results.length} 件商品</h3>
          <div className="results">
            {results.map((r, i) => (
              <div key={i} className="card">
                <div className="index">{r.index + 1}</div>
                <div className="info">
                  <h4>{r.title}</h4>
                  <p className="brand">{r.brand}</p>
                  <p className="price">{r.price}</p>
                  <p className="reason">{r.match_reason}</p>
                </div>
                <button className="fav-btn">⭐ 收藏</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && history.length > 0 && (
        <div className="history-section">
          <h3>最近搜索</h3>
          <div className="history">
            {history.slice(0, 3).map((item, i) => (
              <div key={i} className="history-item" onClick={() => handleHistoryClick(item)}>
                <p>{item.query}</p>
                <span className="time">{new Date(item.timestamp).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="footer">
        <button className="settings-btn" onClick={() => window.location.href = 'settings.html'}>
          ⚙️ 设置
        </button>
      </div>
    </div>
  );
}

export default Agent;
