/* audio.js
 * Subtle sound feedback (WebAudio, no asset files needed), French text-to-speech
 * via SpeechSynthesis, and voice recording via MediaRecorder. All APIs are
 * feature-detected with graceful fallback if unavailable.
 */

const AudioFx = (() => {
  let ctx = null;
  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    return ctx;
  }

  function soundEnabled() {
    return Storage.getSettings().sound !== false;
  }

  function tone(freq, durationMs, type = 'sine', gainVal = 0.06) {
    if (!soundEnabled()) return;
    const c = getCtx();
    if (!c) return;
    try {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = gainVal;
      osc.connect(gain).connect(c.destination);
      const now = c.currentTime;
      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
      osc.start(now);
      osc.stop(now + durationMs / 1000);
    } catch (e) { /* silent fallback */ }
  }

  function success() { tone(660, 140, 'sine', 0.05); setTimeout(() => tone(880, 160, 'sine', 0.05), 90); }
  function error() { tone(220, 180, 'sine', 0.05); }
  function tick() { tone(440, 60, 'sine', 0.03); }
  function complete() {
    tone(523, 140, 'sine', 0.05);
    setTimeout(() => tone(659, 140, 'sine', 0.05), 120);
    setTimeout(() => tone(784, 220, 'sine', 0.05), 240);
  }

  return { success, error, tick, complete };
})();

const Speech = (() => {
  const supported = 'speechSynthesis' in window;

  function speakFrench(text, rate = 0.9) {
    if (!supported) return false;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'fr-FR';
      utter.rate = rate;
      const voices = window.speechSynthesis.getVoices();
      const frVoice = voices.find((v) => v.lang && v.lang.startsWith('fr'));
      if (frVoice) utter.voice = frVoice;
      window.speechSynthesis.speak(utter);
      return true;
    } catch (e) {
      console.warn('Speech synthesis failed', e);
      return false;
    }
  }

  return { supported, speakFrench };
})();

const Recorder = (() => {
  const supported = !!(navigator.mediaDevices && window.MediaRecorder);
  let mediaRecorder = null;
  let chunks = [];
  let stream = null;

  async function start() {
    if (!supported) throw new Error('MediaRecorder not supported in this browser.');
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    mediaRecorder.start();
  }

  function stop() {
    return new Promise((resolve, reject) => {
      if (!mediaRecorder) { reject(new Error('Not recording.')); return; }
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        if (stream) stream.getTracks().forEach((t) => t.stop());
        resolve(URL.createObjectURL(blob));
      };
      mediaRecorder.stop();
    });
  }

  return { supported, start, stop };
})();
