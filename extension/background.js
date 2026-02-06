// Background service worker for AskCat Chrome Extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('AskCat extension installed');
});

// Handle any background tasks if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'log') {
    console.log('AskCat:', request.message);
  }
  return true;
});
