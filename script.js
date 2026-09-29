(() => {
  const entry = document.getElementById('entry');
  const invitation = document.getElementById('invitation');
  const audio = document.getElementById('weddingAudio');
  const musicButton = document.getElementById('musicButton');
  const musicLabel = musicButton.querySelector('.music-label');
  let opened = false;
  async function playMusic() {
    try {
      await audio.play();
      musicButton.setAttribute('aria-pressed', 'true');
      musicLabel.textContent = 'Pausar · Vamos bien';
    } catch {
      musicButton.setAttribute('aria-pressed', 'false');
      musicLabel.textContent = 'Reproducir · Vamos bien';
    }
  }
  function openInvitation() {
    if (opened) return;
    opened = true;
    playMusic();
    entry.classList.add('opening');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      invitation.hidden = false;
      entry.hidden = true;
      document.body.style.overflow = '';
      return;
    }
    // The invitation sits behind the opening envelope before the cover fades.
    setTimeout(() => {
      invitation.classList.add('entering');
      invitation.hidden = false;
      window.scrollTo(0, 0);
    }, 700);
    setTimeout(() => {
      entry.classList.add('revealing');
      invitation.classList.remove('entering');
    }, 1200);
    setTimeout(() => {
      entry.hidden = true;
      document.body.style.overflow = '';
    }, 2550);
  }
  document.body.style.overflow = 'hidden';
  document.getElementById('openInvitation').addEventListener('click', openInvitation);
  musicButton.addEventListener('click', () => {
    if (audio.paused) playMusic();
    else {
      audio.pause();
      musicButton.setAttribute('aria-pressed','false');
      musicLabel.textContent = 'Reproducir · Vamos bien';
    }
  });
  const wedding = new Date('2026-12-11T14:00:00+01:00').getTime();
  function updateCountdown() {
    let delta = Math.max(0, Math.floor((wedding - Date.now()) / 1000));
    const days = Math.floor(delta / 86400); delta %= 86400;
    const hours = Math.floor(delta / 3600); delta %= 3600;
    const minutes = Math.floor(delta / 60); const seconds = delta % 60;
    for (const [id, value] of Object.entries({days,hours,minutes,seconds})) document.getElementById(id).textContent = String(value).padStart(2,'0');
    if (wedding <= Date.now()) document.querySelector('.count-caption').textContent = '¡Hoy celebramos nuestro amor!';
  }
  updateCountdown(); setInterval(updateCountdown, 1000);
  const params = new URLSearchParams(location.search);
  const invitee = params.get('invitado');
  if (invitee) document.getElementById('guestName').value = invitee.slice(0, 80);
  const requestedSeats = Number(params.get('plazas'));
  const seats = Number.isInteger(requestedSeats) && requestedSeats > 0 && requestedSeats <= 20 ? requestedSeats : 1;
  document.getElementById('seatCount').textContent = String(seats);
  document.getElementById('seatNoun').textContent = seats === 1 ? 'lugar' : 'lugares';
  document.getElementById('rsvpForm').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const name = document.getElementById('guestName').value.trim();
    const attendance = new FormData(form).get('attendance');
    const note = document.getElementById('guestMessage').value.trim();
    if (!name || !attendance) return;
    const seatText = ` Invitación para ${seats} ${seats === 1 ? 'persona' : 'personas'}.`;
    const recipient = e.submitter?.dataset.recipient === 'Mística' ? 'Mística' : 'Alejandro';
    const phone = recipient === 'Mística' ? '34643230472' : '34643230361';
    const message = `Hola, ${recipient}. Soy ${name}. Mi respuesta para vuestra boda del 11 de diciembre es: ${attendance}.${seatText}${note ? '\n\nMensaje: ' + note : ''}`;
    window.location.assign(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  });
})();
