const hearts = document.getElementById('hearts');

function makeHeart() {
  const el = document.createElement('span');
  el.className = 'heart';
  el.textContent = ['♥', '♡', '❤', '✦'][Math.floor(Math.random() * 4)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (12 + Math.random() * 25) + 'px';
  const duration = 5 + Math.random() * 6;
  el.style.animationDuration = duration + 's';
  hearts.appendChild(el);
  setTimeout(() => el.remove(), duration * 1000);
}

setInterval(makeHeart, 420);
for (let i = 0; i < 12; i++) setTimeout(makeHeart, i * 180);

const modal = document.getElementById('loveModal');
document.getElementById('yesBtn').addEventListener('click', () => {
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById('response').textContent = 'Você acabou de deixar meu coração sorrindo! Que esse seja o começo de algo muito especial. 💜';
  for (let i = 0; i < 35; i++) setTimeout(makeHeart, i * 55);
});
document.getElementById('maybeBtn').addEventListener('click', () => {
  document.getElementById('response').textContent = 'Tudo bem! Quero que você fique à vontade. O mais importante é que sua resposta seja sincera. Estarei aqui para conversar com carinho. ♡';
});
document.getElementById('closeModal').addEventListener('click', () => {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
});
modal.addEventListener('click', e => {
  if (e.target === modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }
});

// Playlist personalizada com controles próprios.
const tracks = [
  { src: 'assets/musica1.mp3', title: 'Música 1' },
  { src: 'assets/musica2.mp3', title: 'Música 2' },
  { src: 'assets/musica3.mp3', title: 'Música 3' }
];
const player = document.getElementById('audioPlayer');
const musicTip = document.getElementById('musicTip');
const trackButtons = [...document.querySelectorAll('.track')];
const trackTitle = document.getElementById('trackTitle');
const playPause = document.getElementById('playPause');
const prevTrack = document.getElementById('prevTrack');
const nextTrack = document.getElementById('nextTrack');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');
const currentTimeLabel = document.getElementById('currentTime');
const durationLabel = document.getElementById('duration');
let currentTrack = 0;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}
function updatePlaylist() {
  trackTitle.textContent = tracks[currentTrack].title;
  trackButtons.forEach((button, index) => {
    button.classList.toggle('active', index === currentTrack);
    button.setAttribute('aria-pressed', String(index === currentTrack));
  });
}
async function playTrack(index) {
  currentTrack = (index + tracks.length) % tracks.length;
  player.src = tracks[currentTrack].src;
  player.load();
  updatePlaylist();
  try {
    await player.play();
    musicTip.textContent = 'Tocando para você. As músicas seguem em sequência. 💜';
  } catch (error) {
    musicTip.textContent = 'Toque no botão central para começar a ouvir. ♡';
  }
}
function togglePlayback() {
  if (player.paused) {
    if (!player.src) player.src = tracks[currentTrack].src;
    player.play().catch(() => musicTip.textContent = 'Não foi possível iniciar o áudio. Tente novamente.');
  } else player.pause();
}
player.addEventListener('play', () => { playPause.textContent = 'Ⅱ'; playPause.setAttribute('aria-label','Pausar'); });
player.addEventListener('pause', () => { playPause.textContent = '▶'; playPause.setAttribute('aria-label','Reproduzir'); });
player.addEventListener('timeupdate', () => {
  if (Number.isFinite(player.duration) && player.duration > 0) {
    progressBar.value = (player.currentTime / player.duration) * 100;
    currentTimeLabel.textContent = formatTime(player.currentTime);
    durationLabel.textContent = formatTime(player.duration);
  }
});
player.addEventListener('loadedmetadata', () => { durationLabel.textContent = formatTime(player.duration); });
progressBar.addEventListener('input', () => {
  if (Number.isFinite(player.duration)) player.currentTime = (Number(progressBar.value) / 100) * player.duration;
});
volumeBar.addEventListener('input', () => { player.volume = Number(volumeBar.value); });
player.volume = Number(volumeBar.value);
playPause.addEventListener('click', togglePlayback);
prevTrack.addEventListener('click', () => playTrack(currentTrack - 1));
nextTrack.addEventListener('click', () => playTrack(currentTrack + 1));
trackButtons.forEach(button => button.addEventListener('click', () => playTrack(Number(button.dataset.track))));
player.addEventListener('ended', () => {
  if (currentTrack < tracks.length - 1) playTrack(currentTrack + 1);
  else { player.currentTime = 0; player.pause(); }
});
updatePlaylist();

// A tela inicial libera a rolagem e inicia a primeira música somente após o clique.
const entryScreen = document.getElementById('entryScreen');
async function enterSite() {
  if (!entryScreen || entryScreen.classList.contains('leaving')) return;
  entryScreen.classList.add('leaving');
  document.body.classList.add('site-started');
  document.documentElement.classList.add('site-ready');
  await playTrack(0);
  setTimeout(() => entryScreen.remove(), 750);
}
entryScreen.addEventListener('click', enterSite);
entryScreen.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    enterSite();
  }
});
