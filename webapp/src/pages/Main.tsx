import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import BrowserPanel from '../components/BrowserPanel';

export default function Main() {
  const navigate = useNavigate();
  const [vipLoginChecked, setVipLoginChecked] = useState(false);
  const [isVipLoggedIn, setIsVipLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user has auth token
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">👔 DressCopilot</h1>
          <span className="text-sm text-gray-500">AI穿搭助手</span>
        </div>
        <div className="flex items-center gap-4">
          {vipLoginChecked && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">唯品会状态:</span>
              {isVipLoggedIn ? (
                <span className="text-green-600 font-medium">✓ 已登录</span>
              ) : (
                <span className="text-orange-600 font-medium">⚠ 未登录</span>
              )}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            退出登录
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Browser Panel */}
        <div className="flex-1 border-r border-gray-200">
          <BrowserPanel
            onVipLoginCheck={(isLoggedIn) => {
              setVipLoginChecked(true);
              setIsVipLoggedIn(isLoggedIn);
            }}
          />
        </div>

        {/* ChatBox Panel */}
        <div className="w-96 bg-white">
          <ChatBox isVipLoggedIn={isVipLoggedIn} />
        </div>
      </div>
    </div>
  );
}
