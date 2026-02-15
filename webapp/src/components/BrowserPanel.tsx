import React, { useEffect, useRef, useState } from 'react';

interface BrowserPanelProps {
  onVipLoginCheck: (isLoggedIn: boolean) => void;
}

export default function BrowserPanel({ onVipLoginCheck }: BrowserPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [url, setUrl] = useState('https://www.vip.com/');
  const [inputUrl, setInputUrl] = useState('https://www.vip.com/');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check VIP login status after iframe loads
    const checkVipLogin = () => {
      try {
        // Note: Due to CORS restrictions, we can't directly access iframe content
        // This is a simplified check - in production, you'd need a backend proxy
        // or use browser extension APIs
        const isLoggedIn = document.cookie.includes('vip_');
        onVipLoginCheck(isLoggedIn);
      } catch (error) {
        console.log('Cannot check VIP login status due to CORS:', error);
        // Assume not logged in if we can't check
        onVipLoginCheck(false);
      }
    };

    const timer = setTimeout(checkVipLogin, 3000);
    return () => clearTimeout(timer);
  }, [onVipLoginCheck]);

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleNavigate = () => {
    setUrl(inputUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Browser Controls */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <button
          onClick={() => {
            if (iframeRef.current) {
              iframeRef.current.contentWindow?.history.back();
            }
          }}
          className="px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
          title="后退"
        >
          ←
        </button>
        <button
          onClick={() => {
            if (iframeRef.current) {
              iframeRef.current.contentWindow?.history.forward();
            }
          }}
          className="px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
          title="前进"
        >
          →
        </button>
        <button
          onClick={() => {
            if (iframeRef.current) {
              iframeRef.current.src = iframeRef.current.src;
            }
          }}
          className="px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
          title="刷新"
        >
          ↻
        </button>

        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="输入网址..."
          />
          <button
            onClick={handleNavigate}
            className="px-4 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            前往
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="bg-purple-50 px-4 py-2 text-sm text-purple-700">
          加载中...
        </div>
      )}

      {/* VIP Login Warning */}
      <div className="bg-orange-50 px-4 py-2 text-sm text-orange-700 border-b border-orange-200">
        💡 提示：请先登录唯品会账户，以便AI帮您将喜欢的商品加入收藏
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          src={url}
          className="absolute inset-0 w-full h-full border-0"
          onLoad={handleLoadEnd}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          title="唯品会浏览器"
        />
      </div>
    </div>
  );
}
