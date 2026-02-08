/**
 * DressCopilot Content Script
 * Runs on e-commerce pages to enable AI-powered analysis
 */

console.log('DressCopilot Content Script loaded on:', window.location.href);

// Store current page info for the popup
let pageInfo: {
  url: string;
  title: string;
  productElements: number;
} = {
  url: window.location.href,
  title: document.title,
  productElements: 0
};

/**
 * Count product elements on the page
 * Different selectors for different e-commerce platforms
 */
function countProductElements(): number {
  const selectors = [
    '[class*="product"]',
    '[class*="item"]',
    '[class*="goods"]',
    '[data-product-id]',
    '.J-product-item',
    '.goods-item'
  ];

  let count = 0;
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > count) {
      count = elements.length;
    }
  }

  return count;
}

// Initialize page info
pageInfo.productElements = countProductElements();

/**
 * Highlight product elements (for debugging/future features)
 */
function highlightProducts() {
  const products = document.querySelectorAll('[class*="product"], [class*="item"]');
  products.forEach((el, i) => {
    if (i < 10) { // Limit to first 10
      (el as HTMLElement).style.outline = '2px solid #3b82f6';
      (el as HTMLElement).style.outlineOffset = '-2px';
    }
  });
}

/**
 * Remove highlights
 */
function removeHighlights() {
  const products = document.querySelectorAll('[class*="product"], [class*="item"]');
  products.forEach((el) => {
    (el as HTMLElement).style.outline = '';
    (el as HTMLElement).style.outlineOffset = '';
  });
}

/**
 * Message listener
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received:', request);

  switch (request.action) {
    case 'PING':
      sendResponse({ status: 'PONG', pageInfo });
      break;

    case 'GET_PAGE_INFO':
      pageInfo.productElements = countProductElements();
      sendResponse({ success: true, pageInfo });
      break;

    case 'HIGHLIGHT_PRODUCTS':
      highlightProducts();
      sendResponse({ success: true });
      break;

    case 'REMOVE_HIGHLIGHTS':
      removeHighlights();
      sendResponse({ success: true });
      break;

    default:
      sendResponse({ error: 'Unknown action' });
  }

  return true;
});

// Log page info
console.log('Page info:', pageInfo);
