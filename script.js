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

// Playlist fixa com as três músicas já incluídas no site.
const tracks = [
  'assets/musica1.mp3',
  'assets/musica2.mp3',
  'assets/musica3.mp3'
];
const player = document.getElementById('audioPlayer');
const startMusic = document.getElementById('startMusic');
const musicTip = document.getElementById('musicTip');
const trackButtons = [...document.querySelectorAll('.track')];
let currentTrack = 0;

function updatePlaylist() {
  trackButtons.forEach((button, index) => {
    button.classList.toggle('active', index === currentTrack);
    button.setAttribute('aria-pressed', String(index === currentTrack));
  });
}

async function playTrack(index) {
  currentTrack = (index + tracks.length) % tracks.length;
  player.src = tracks[currentTrack];
  player.load();
  updatePlaylist();
  try {
    await player.play();
    startMusic.classList.remove('visible');
    musicTip.textContent = 'Tocando para você. As músicas seguem em sequência. 💜';
  } catch (error) {
    startMusic.classList.add('visible');
    musicTip.textContent = 'Seu navegador bloqueou o início automático. Toque no botão para começar a playlist. ♡';
  }
}

trackButtons.forEach(button => {
  button.addEventListener('click', () => playTrack(Number(button.dataset.track)));
});

player.addEventListener('ended', () => {
  if (currentTrack < tracks.length - 1) {
    playTrack(currentTrack + 1);
  } else {
    currentTrack = 0;
    updatePlaylist();
  }
});

startMusic.addEventListener('click', () => playTrack(currentTrack));
player.addEventListener('play', () => startMusic.classList.remove('visible'));

// O toque na tela inicial libera a música e revela o site.
const entryScreen = document.getElementById('entryScreen');
async function enterSite() {
  if (!entryScreen || entryScreen.classList.contains('leaving')) return;
  entryScreen.classList.add('leaving');
  document.body.classList.add('site-started');
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
