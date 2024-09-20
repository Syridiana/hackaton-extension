chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getStreamId") {
      chrome.tabCapture.getMediaStreamId({ consumerTabId: sender.tab.id }, streamId => {
        sendResponse({ streamId: streamId });
      });
      return true; // Indica que la respuesta se enviará de forma asincrónica
    }
  });
  