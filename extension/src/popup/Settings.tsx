import React, { useState, useEffect } from 'react';
import './Settings.css';

interface Config {
  apiKey: string;
  provider: string;
}

function Settings() {
  const [config, setConfig] = useState<Config>({ apiKey: '', provider: 'zhipu' });

  useEffect(() => {
    chrome.storage.local.get('aiConfig', (result) => {
      if (result.aiConfig) {
        setConfig(result.aiConfig);
      }
    });
  }, []);

  const handleSave = () => {
    if (!config.apiKey.trim()) {
      alert('请输入 API Key');
      return;
    }

    chrome.storage.local.set({ aiConfig: config }, () => {
      alert('配置已保存');
    });
  };

  const handleTest = async () => {
    alert('测试功能开发中...');
  };

  return (
    <div className="w-80 p-4 bg-white min-h-[400px]">
      <div className="header">
        <h1>⚙️ AI 模型设置</h1>
      </div>

      <div className="section">
        <label className="label">模型提供商</label>
        <select
          className="select"
          value={config.provider}
          onChange={(e) => setConfig({ ...config, provider: e.target.value })}
        >
          <option value="zhipu">智谱 GLM (推荐)</option>
          <option value="qwen">阿里 Qwen</option>
          <option value="minimax">MiniMax</option>
          <option value="custom">自定义</option>
        </select>
      </div>

      <div className="section">
        <label className="label">API Key</label>
        <input
          type="password"
          className="input"
          value={config.apiKey}
          onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
          placeholder="输入你的 API Key..."
        />
      </div>

      <div className="actions">
        <button className="test-btn" onClick={handleTest}>
          🧪 测试连接
        </button>
        <button className="save-btn" onClick={handleSave}>
          💾 保存
        </button>
      </div>

      <div className="back-section">
        <button className="back-btn" onClick={() => window.history.back()}>
          ← 返回
        </button>
      </div>
    </div>
  );
}

export default Settings;
