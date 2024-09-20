let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const downloadLink = document.getElementById('download-link');

startBtn.addEventListener('click', async () => {
  // Solicitar acceso al micrófono
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    downloadLink.style.display = 'none';
    audioChunks = [];

    mediaRecorder.addEventListener('dataavailable', event => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      downloadLink.href = audioUrl;
      downloadLink.style.display = 'block';
    });

  } catch (err) {
    console.error('Error al acceder al micrófono:', err.message);
    alert('No se pudo acceder al micrófono. Por favor, verifica los permisos y que tu dispositivo tenga un micrófono disponible.');
  }
});

stopBtn.addEventListener('click', () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
});
