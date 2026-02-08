import React, { useState, useEffect } from 'react';
import './Settings.css';
import { getAIConfig, saveAIConfig } from '../lib/storage';
import { testApiConnection } from '../lib/api';
import type { AIConfig } from '../lib/storage';

function Settings() {
  const [config, setConfig] = useState<AIConfig>({ apiKey: '', provider: 'zhipu' });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const saved = await getAIConfig();
    if (saved) {
      setConfig(saved);
    }
  };

  const handleSave = async () => {
    if (!config.apiKey.trim()) {
      alert('请输入 API Key');
      return;
    }

    await saveAIConfig(config);
    alert('配置已保存');
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult('idle');

    try {
      // Test API connection
      const connected = await testApiConnection({
        apiKey: config.apiKey,
        apiBaseUrl: config.apiBaseUrl
      });

      if (connected) {
        setTestResult('success');
      } else {
        setTestResult('error');
      }
    } catch (error) {
      setTestResult('error');
    } finally {
      setTesting(false);
    }
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
          onChange={(e) => setConfig({ ...config, provider: e.target.value as any })}
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
        <p className="help-text">
          {config.provider === 'zhipu' && '在 智谱AI开放平台 (open.bigmodel.cn) 获取'}
          {config.provider === 'qwen' && '在 阿里云百炼 获取'}
          {config.provider === 'minimax' && '在 MiniMax 开放平台 获取'}
        </p>
      </div>

      <div className="section">
        <label className="label">后端 API 地址</label>
        <input
          type="text"
          className="input"
          value={config.apiBaseUrl || ''}
          onChange={(e) => setConfig({ ...config, apiBaseUrl: e.target.value })}
          placeholder="http://localhost:3000"
        />
        <p className="help-text">本地开发使用 localhost:3000，部署后填入实际地址</p>
      </div>

      {testResult !== 'idle' && (
        <div className={`test-result ${testResult}`}>
          {testResult === 'success' && '✅ 连接成功'}
          {testResult === 'error' && '❌ 连接失败，请检查配置'}
        </div>
      )}

      <div className="actions">
        <button className="test-btn" onClick={handleTest} disabled={testing}>
          {testing ? '测试中...' : '🧪 测试连接'}
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
