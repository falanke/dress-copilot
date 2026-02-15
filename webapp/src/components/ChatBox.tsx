import React, { useState, useRef } from 'react';
import type { StylePhoto, ProductRecommendation } from '../types';
import { analyzeApi } from '../lib/api';

interface ChatBoxProps {
  isVipLoggedIn: boolean;
}

export default function ChatBox({ isVipLoggedIn }: ChatBoxProps) {
  const [stylePhotos, setStylePhotos] = useState<StylePhoto[]>([]);
  const [query, setQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<ProductRecommendation[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: StylePhoto[] = [];
    const remainingSlots = 5 - stylePhotos.length;

    Array.from(files)
      .slice(0, remainingSlots)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          newPhotos.push({
            id: Math.random().toString(36),
            url: reader.result as string,
            file,
          });

          if (newPhotos.length === Math.min(files.length, remainingSlots)) {
            setStylePhotos([...stylePhotos, ...newPhotos]);
          }
        };
        reader.readAsDataURL(file);
      });
  };

  const removePhoto = (id: string) => {
    setStylePhotos(stylePhotos.filter((p) => p.id !== id));
  };

  const captureScreenshot = async (): Promise<string> => {
    // In a real implementation, this would capture the iframe content
    // For now, we'll use html2canvas or similar library
    // This is a placeholder
    return new Promise((resolve) => {
      // Simulate screenshot capture
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000000';
        ctx.font = '20px Arial';
        ctx.fillText('唯品会商品页面截图', 50, 50);
      }
      resolve(canvas.toDataURL('image/png'));
    });
  };

  const handleAnalyze = async () => {
    if (!query.trim()) {
      alert('请输入您的需求描述');
      return;
    }

    if (stylePhotos.length === 0) {
      alert('请至少上传一张风格照片');
      return;
    }

    setAnalyzing(true);
    setResults([]);

    try {
      // Capture screenshot of the browser panel
      const screenshot = await captureScreenshot();

      // Prepare style photos as base64
      const stylePhotoUrls = stylePhotos.map((p) => p.url);

      // Call API
      const response = await analyzeApi.analyzeProducts({
        stylePhotos: stylePhotoUrls,
        screenshot,
        query,
      });

      if (response.success && response.recommendations) {
        setResults(response.recommendations);

        // Save to history
        await analyzeApi.saveHistory({
          query,
          results: response.recommendations,
          timestamp: Date.now(),
          stylePhotos: stylePhotoUrls,
        });
      } else {
        alert('分析失败: ' + (response.error || '未知错误'));
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      alert('分析出错: ' + (error.message || '网络错误'));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">AI 穿搭助手</h2>
        <p className="text-xs text-gray-500 mt-1">上传风格照片，描述需求，获取推荐</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Style Photos Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            风格参考照片 ({stylePhotos.length}/5)
          </label>

          <div className="grid grid-cols-3 gap-2 mb-2">
            {stylePhotos.map((photo) => (
              <div key={photo.id} className="relative aspect-square">
                <img
                  src={photo.url}
                  alt="Style reference"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {stylePhotos.length < 5 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors"
            >
              + 添加照片
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <p className="text-xs text-gray-500 mt-2">
            💡 上传您喜欢的穿搭风格照片，AI会据此推荐符合您风格的商品
          </p>
        </div>

        {/* Query Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            需求描述
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={4}
            placeholder="例如：帮我找几件春季外套，休闲风格，500元以内，适合日常通勤..."
          />
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={analyzing || stylePhotos.length === 0 || !query.trim()}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? '🔍 AI分析中...' : '🔍 开始分析'}
        </button>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              为您推荐了 {results.length} 件商品
            </h3>
            <div className="space-y-3">
              {results.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {item.index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-800 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.brand}</p>
                      <p className="text-sm font-semibold text-purple-600 mt-1">
                        {item.price}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {item.match_reason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIP Login Warning */}
        {!isVipLoggedIn && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-xs text-orange-700">
              ⚠️ 检测到您未登录唯品会账户，推荐的商品无法自动加入收藏
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
