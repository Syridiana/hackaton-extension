let isRecording = false;
let recordingTime = 0;
let recordingInterval;
let activeTab = 'notes';

const recordBtn = document.getElementById('recordBtn');
const notesTab = document.getElementById('notesTab');
const medicalNoteTab = document.getElementById('medicalNoteTab');
const copyBtn = document.getElementById('copyBtn');
const notesArea = document.getElementById('notesArea');
const messageEl = document.getElementById('message');

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function startRecording() {
  isRecording = true;
  recordingTime = 0;
  recordBtn.textContent = '00:00';
  recordBtn.style.backgroundColor = '#dc3545';
  notesTab.click();
  notesArea.value = '';
  notesArea.placeholder = 'Escriba sus apuntes aquí...';
  notesArea.readOnly = false;

  recordingInterval = setInterval(() => {
    recordingTime++;
    recordBtn.textContent = formatTime(recordingTime);
  }, 1000);
}

function stopRecording() {
  isRecording = false;
  clearInterval(recordingInterval);
  recordBtn.textContent = 'Grabar';
  recordBtn.style.backgroundColor = '#4b0082';
  generateMedicalNote();
}

function generateMedicalNote() {
  const notes = notesArea.value.trim();
  if (!notes) return;

  const date = new Date().toLocaleDateString();
  const duration = formatTime(recordingTime);
  const medicalNote = `NOTA MÉDICA\n\nFecha: ${date}\nDuración: ${duration}\n\nAPUNTES: ${notes}\n\nPLAN DE ACCIÓN:\n1. Realizar exámenes\n2. Seguimiento en 2 semanas`;
  
  notesArea.value = medicalNote;
  medicalNoteTab.click();
}

recordBtn.addEventListener('click', () => {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
});

notesTab.addEventListener('click', () => {
  if (!isRecording) {
    activeTab = 'notes';
    notesTab.classList.add('active');
    medicalNoteTab.classList.remove('active');
    notesArea.placeholder = 'Escriba sus apuntes aquí...';
    notesArea.readOnly = false;
  }
});

medicalNoteTab.addEventListener('click', () => {
  if (!isRecording) {
    activeTab = 'medicalNote';
    medicalNoteTab.classList.add('active');
    notesTab.classList.remove('active');
    notesArea.placeholder = 'La nota médica aparecerá aquí...';
    notesArea.readOnly = true;
  }
});

copyBtn.addEventListener('click', () => {
  const textToCopy = notesArea.value;
  navigator.clipboard.writeText(textToCopy).then(() => {
    showMessage('Copiado al portapapeles', 'success');
  }, () => {
    showMessage('Error al copiar', 'error');
  });
});

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  messageEl.style.display = 'block';
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 2000);
}
