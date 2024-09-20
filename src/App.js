import React, { useState, useEffect } from 'react';

const App = () => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState('');

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            
            recorder.ondataavailable = (event) => {
                setAudioChunks((prevChunks) => [...prevChunks, event.data]);
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                setAudioChunks([]); // Resetear los chunks
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
            console.log('Grabación iniciada...');
        } catch (err) {
            console.error('Error al acceder al micrófono:', err);
            alert('No se pudo acceder al micrófono. Verifica los permisos.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
            console.log('Grabación detenida.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Grabador de Audio</h1>
            {isRecording ? (
                <button onClick={stopRecording}>Detener Grabación</button>
            ) : (
                <button onClick={startRecording}>Iniciar Grabación</button>
            )}
            {audioUrl && (
                <div>
                    <h2>Grabación:</h2>
                    <audio controls src={audioUrl}></audio>
                </div>
            )}
        </div>
    );
};

export default App;
