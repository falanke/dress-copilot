import React from 'react';

function App() {
  return (
    <div className="w-80 p-4 bg-gray-50 min-h-[400px]">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-gray-800">👔 DressCopilot</h1>
        <p className="text-sm text-gray-500">程序员穿搭助手 MVP</p>
      </header>
      
      <main>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            你想找什么衣服？
          </label>
          <textarea 
            className="w-full h-24 p-2 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="例如：帮我挑几件春季外套，休闲风格，500 以内..."
          ></textarea>
          
          <button className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
            🔍 开始挑选
          </button>
        </div>

        <div className="mt-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">最近搜索</h2>
          <div className="space-y-2">
             <p className="text-xs text-gray-400 italic">暂无记录</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
