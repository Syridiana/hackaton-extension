const recordButton = document.getElementById('record');
const stopButton = document.getElementById('stop');
const audioElement = document.getElementById('audio');
let mediaRecorder;
let audioChunks = [];

recordButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioElement.src = audioUrl;
            audioChunks = []; // Resetear los chunks
        };

        mediaRecorder.start();
        recordButton.disabled = true;
        stopButton.disabled = false;
        console.log('Grabación iniciada...');
    } catch (err) {
        console.error('Error al acceder al micrófono:', err);
        alert('No se pudo acceder al micrófono. Verifica los permisos.');
    }
});

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    recordButton.disabled = false;
    stopButton.disabled = true;
    console.log('Grabación detenida.');
});
