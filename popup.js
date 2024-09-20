const startBtn = document.getElementById('start-btn');
const downloadLink = document.getElementById('download-link');

startBtn.addEventListener('click', async () => {
  // Parámetros para capturar solo el audio de la pestaña
  const captureOptions = {
    audio: true,
    video: false
  };

  chrome.tabCapture.capture(captureOptions, stream => {
    if (chrome.runtime.lastError || !stream) {
      console.error('Error capturando la pestaña:', chrome.runtime.lastError);
      alert('Error al intentar capturar la pestaña. Verifica los permisos.');
      return;
    }

    // Aquí manejamos el flujo de datos del stream de audio
    const mediaRecorder = new MediaRecorder(stream);
    let audioChunks = [];

    // Almacenar los fragmentos de audio a medida que están disponibles
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    // Cuando se detiene la grabación, generamos el enlace de descarga
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      downloadLink.href = audioUrl;
      downloadLink.style.display = 'block';
    };

    // Iniciar la grabación
    mediaRecorder.start();
    startBtn.disabled = true; // Deshabilitar el botón de inicio durante la grabación

    // Detener la grabación luego de 5 segundos (puedes ajustar este tiempo)
    setTimeout(() => {
      mediaRecorder.stop();
      startBtn.disabled = false; // Habilitar el botón de inicio nuevamente
    }, 5000); // Grabar durante 5 segundos
  });
});