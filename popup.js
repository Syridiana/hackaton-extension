const recordButton = document.getElementById('record');
let mediaRecorder;
let audioChunks = [];
let recognition;

recordButton.addEventListener('click', () => {
    console.log("Intentando grabar audio...");

    try {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                mediaRecorder = new MediaRecorder(stream);
                
                mediaRecorder.addEventListener("dataavailable", event => {
                    audioChunks.push(event.data);
                    console.log('Chunks de audio:', audioChunks);
                });

                mediaRecorder.start();
                console.log('Grabación iniciada...');
            })
            .catch((err) => {
                if (err.name === 'NotAllowedError') {
                    console.error('Permiso de micrófono denegado. Por favor, verifica la configuración de tu navegador.');
                    alert('Permiso de micrófono denegado. Ve a la configuración de tu navegador para habilitarlo.');
                } else {
                    console.error('Error al acceder al micrófono:', err);
                }
            });
    } catch (error) {
        console.error('Error inesperado:', error);
    }
});