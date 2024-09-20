let mediaRecorder;
let audioChunks = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startRecording") {
    chrome.runtime.sendMessage({ action: "getStreamId" }, response => {
      if (response.streamId) {
        navigator.mediaDevices.getUserMedia({
          audio: {
            mandatory: {
              chromeMediaSource: 'tab',
              chromeMediaSourceId: response.streamId
            }
          },
          video: false
        }).then(stream => {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
          };
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const url = URL.createObjectURL(audioBlob);
            chrome.downloads.download({
              url: url,
              filename: 'grabacion.webm'
            });
            audioChunks = [];
          };
          mediaRecorder.start();
          sendResponse({ success: true });
        }).catch(error => {
          sendResponse({ error: error.message });
        });
      } else {
        sendResponse({ error: "No se pudo obtener el streamId" });
      }
    });
    return true; // Indica que la respuesta se enviará de forma asincrónica
  } else if (request.action === "stopRecording") {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      sendResponse({ success: true });
    } else {
      sendResponse({ error: "No hay grabación en curso" });
    }
  }
});
