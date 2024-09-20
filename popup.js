document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startTranscription');
    const stopButton = document.getElementById('stopTranscription');
    const transcriptDiv = document.getElementById('transcript');
  
    startButton.addEventListener('click', function() {
        console.log('click start')
      chrome.runtime.sendMessage({action: "startRecording"});
      transcriptDiv.innerHTML = "Transcripción iniciada...";
    });
  
    stopButton.addEventListener('click', function() {
      chrome.runtime.sendMessage({action: "stopTranscription"});
      transcriptDiv.innerHTML += "<br>Transcripción detenida.";
    });
  
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === "updateTranscript") {
        transcriptDiv.innerHTML += "<br>" + request.transcript;
      }
    });
  });