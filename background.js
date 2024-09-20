/* chrome.runtime.onInstalled.addListener(() => {
    console.log('Extensión instalada');
  }); */
/* 

  let mediaRecorder;
let audioChunks = [];
let recognition;

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("yani")
  if (message.action === "start-recording") {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'es-ES';
      recognition.continuous = true;
      recognition.interimResults = true;
      
      let finalTranscript = '';
      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        chrome.storage.local.set({ transcription: finalTranscript });
      };
      
      recognition.onerror = (event) => {
        console.error('Error de reconocimiento:', event.error);
      };
      
      mediaRecorder.start();
      recognition.start();
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        console.error('Permiso de micrófono denegado');
      } else {
        console.error('Error al acceder al micrófono:', error);
      }
    }
  } else if (message.action === "stop-recording") {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      recognition.stop();
    }
  }
});
 */