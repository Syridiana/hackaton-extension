let mediaRecorder;
let audioChunks = [];
let recognition;
let stream;

document.getElementById('requestPermission').onclick = async () => {
  try {
    // Solo solicitamos el permiso sin iniciar la grabación
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    document.getElementById('requestPermission').style.display = 'none';
    document.getElementById('record').style.display = 'inline-block';
    document.getElementById('status').textContent = 'Permiso concedido. Listo para grabar.';
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      alert('Se requiere permiso de micrófono. Por favor, permite el acceso e intenta de nuevo.');
    } else {
      console.error('Error al acceder al micrófono:', error);
      alert('Ocurrió un error al intentar acceder al micrófono.');
    }
  }
};

document.getElementById('record').onclick = () => {
  if (!stream) {
    alert('Por favor, concede el permiso de micrófono primero.');
    return;
  }

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
  document.getElementById('status').textContent = 'Grabando...';
};

document.getElementById('stop').onclick = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    recognition.stop();
    document.getElementById('record').disabled = false;
    document.getElementById('stop').disabled = true;
    document.getElementById('status').textContent = 'Grabación detenida.';
  }
};