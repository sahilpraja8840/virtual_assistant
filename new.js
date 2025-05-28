const micBtn = document.getElementById('mic-btn');
const micIcon = document.getElementById('mic-icon');
let isListening = false;

micBtn.addEventListener('click', () => {
  isListening = !isListening;
  micIcon.className = isListening ? 'fa-solid fa-microphone-lines-slash' : 'fa-solid fa-microphone-lines';
});
