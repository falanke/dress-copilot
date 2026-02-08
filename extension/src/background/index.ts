console.log('DressCopilot Background Service loaded');

// 监听安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('DressCopilot installed');
});
