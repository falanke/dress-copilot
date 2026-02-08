/**
 * DressCopilot Background Service Worker
 */

console.log('DressCopilot Background Service loaded');

/**
 * Handle extension installation
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('DressCopilot installed/updated:', details.reason);

  // Set default config on first install
  if (details.reason === 'install') {
    chrome.storage.local.set({
      aiConfig: {
        apiKey: '',
        provider: 'zhipu',
        apiBaseUrl: 'http://localhost:3000'
      },
      searchHistory: []
    });
  }
});

/**
 * Handle extension icon click (alternative to popup)
 */
chrome.action.onClicked.addListener((tab) => {
  // Popup is set in manifest, this is for potential future features
  console.log('Extension clicked on tab:', tab.id);
});

/**
 * Listen for tab updates
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if we're on a supported e-commerce site
    const supportedSites = [
      'https://www.vip.com',
      'https://category.vip.com',
      'https://list.vip.com'
    ];

    const isSupported = supportedSites.some(site => tab.url!.startsWith(site));

    if (isSupported) {
      // Optionally set badge or other indicators
      chrome.action.setBadgeText({
        tabId,
        text: 'AI'
      });
      chrome.action.setBadgeBackgroundColor({
        tabId,
        color: '#3b82f6'
      });
    }
  }
});

/**
 * Message handler for communication with content scripts and popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received:', request);

  switch (request.action) {
    case 'GET_CONFIG':
      chrome.storage.local.get('aiConfig', (result) => {
        sendResponse({ success: true, config: result.aiConfig });
      });
      return true;

    case 'SAVE_CONFIG':
      chrome.storage.local.set({ aiConfig: request.config }, () => {
        sendResponse({ success: true });
      });
      return true;

    default:
      sendResponse({ error: 'Unknown action' });
  }

  return true;
});
