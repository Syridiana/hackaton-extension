let mediaRecorder;
let audioChunks = [];
let recognition;

document.getElementById('record').onclick = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'es-ES'; // Puedes cambiar esto al idioma que necesites
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
      document.getElementById('transcription').innerHTML = 
        finalTranscript + '<i style="color:#999">' + interimTranscript + '</i>';
    };
    
    recognition.onerror = (event) => {
      console.error('Error de reconocimiento:', event.error);
    };
    
    mediaRecorder.start();
    recognition.start();
    document.getElementById('record').disabled = true;
    document.getElementById('stop').disabled = false;
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      alert('Se requiere permiso de micrófono. Por favor, permite el acceso e intenta de nuevo.');
    } else {
      console.error('Error al acceder al micrófono:', error);
      alert('Ocurrió un error al intentar acceder al micrófono.');
    }
  }
};

document.getElementById('stop').onclick = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    recognition.stop();
    document.getElementById('record').disabled = false;
    document.getElementById('stop').disabled = true;
  }
};