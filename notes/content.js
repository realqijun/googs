chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getHighlightedText') {
    const selection = window.getSelection().toString();
    sendResponse({ highlightedText: selection });
  }
});