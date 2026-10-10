/**
 * Authentic Casio F-91W Piezo Buzzer Sound Synthesizer
 * Uses Web Audio API to create authentic 2048Hz crystal oscillator piezo tones.
 */

let audioCtx: AudioContext | null = null;
let alarmIntervalId: number | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playPiezoTone(
  frequency = 2048,
  durationSec = 0.03,
  volume = 0.15,
  waveform: OscillatorType = 'square'
) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Casio watches use a ceramic piezo disc resonant around 2-4 kHz with high pass/bandpass characteristic
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(frequency, ctx.currentTime);
    filter.Q.setValueAtTime(4.0, ctx.currentTime);

    osc.type = waveform;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Envelope for sharp piezo click/beep without pop
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.002);
    gain.gain.setValueAtTime(volume, now + durationSec - 0.003);
    gain.gain.linearRampToValueAtTime(0, now + durationSec);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationSec);
  } catch (err) {
    console.debug('Audio playback blocked or unavailable', err);
  }
}

/**
 * Normal button press beep (2048Hz, 25ms)
 */
export function playButtonBeep() {
  playPiezoTone(2048, 0.025, 0.12, 'square');
}

/**
 * Mode change beep: standard is 2048Hz, but returning to normal mode is higher pitch ~2400Hz
 */
export function playModeBeep(isReturnToNormal = false) {
  if (isReturnToNormal) {
    playPiezoTone(2400, 0.04, 0.15, 'square');
  } else {
    playPiezoTone(2048, 0.03, 0.12, 'square');
  }
}

/**
 * Hourly chime: classic double chirp (chirp - pause - chirp)
 */
export function playHourlyChime() {
  playPiezoTone(2048, 0.035, 0.15, 'square');
  setTimeout(() => {
    playPiezoTone(2048, 0.035, 0.15, 'square');
  }, 70);
}

/**
 * Start the repeating Casio F-91W alarm pattern:
 * "beep-beep ... beep-beep ... beep-beep"
 */
export function startAlarmLoop(onPulse?: () => void) {
  stopAlarmLoop();
  
  const playPulse = () => {
    playPiezoTone(2048, 0.04, 0.18, 'square');
    setTimeout(() => {
      playPiezoTone(2048, 0.04, 0.18, 'square');
      if (onPulse) onPulse();
    }, 70);
  };

  playPulse();
  alarmIntervalId = window.setInterval(playPulse, 400);
}

export function stopAlarmLoop() {
  if (alarmIntervalId !== null) {
    clearInterval(alarmIntervalId);
    alarmIntervalId = null;
  }
}

/**
 * Haptic vibration feedback for mobile Android experience
 */
export function triggerHaptic(duration = 20) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch {
      // Ignore vibration error on unsupported platforms
    }
  }
}
