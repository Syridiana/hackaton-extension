// background.js
let mediaRecorder;
let audioChunks = [];
let transcript = '';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startRecording") {
    startRecording();
  } else if (request.action === "stopRecording") {
    stopRecording();
  }
});

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      startSpeechRecognition();
    });
}

function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
    stopSpeechRecognition();
    
    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Crear enlace de descarga
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "downloadAudio",
          audioUrl: audioUrl,
          transcript: transcript
        });
      });
      
      audioChunks = [];
    });
  }
}

function startSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'es-ES';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    const currentTranscript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');
    transcript = currentTranscript;
    
    // Enviar transcripción en tiempo real a la página
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "updateTranscript",
        transcript: transcript
      });
    });
  };

  recognition.start();
}

function stopSpeechRecognition() {
  if (recognition) {
    recognition.stop();
  }
}