/* motor.js — reaction time & hand-eye coordination exercises
 * Note: measures and trains reaction performance only. No claims about
 * broader intelligence gains are made anywhere in this module's UI text.
 */
(function () {

  function clear(container) { container.innerHTML = ''; }
  function header(container, title, sub) {
    const h = document.createElement('div');
    h.className = 'ex-header';
    h.innerHTML = `<h2>${title}</h2>${sub ? `<p class="ex-sub">${sub}</p>` : ''}`;
    container.appendChild(h);
  }
  function showFeedback(container, accuracy, detail) {
    const good = accuracy >= 0.6;
    if (good) AudioFx.success(); else AudioFx.error();
    const fb = document.createElement('div');
    fb.className = 'feedback ' + (good ? 'feedback-good' : 'feedback-bad');
    fb.innerHTML = `<div class="feedback-pct">${Math.round(accuracy * 100)}%</div><div class="feedback-detail">${detail}</div>`;
    container.appendChild(fb);
  }

  // ---- 1. Reaction Test ---------------------------------------------------
  function runReaction(container, opts, onComplete) {
    clear(container);
    const trials = 5;
    header(container, 'Reaction Test', 'Wait for GO, then tap as fast as you can.');
    const pad = document.createElement('button');
    pad.className = 'reaction-pad waiting';
    pad.textContent = 'WAIT…';
    container.appendChild(pad);

    let trial = 0, times = [], falseStarts = 0, goAt = 0, state = 'idle';

    function startTrial() {
      if (trial >= trials) return finish();
      state = 'waiting';
      pad.className = 'reaction-pad waiting';
      pad.textContent = 'WAIT…';
      const delay = 1200 + Math.random() * 2500;
      setTimeout(() => {
        if (state !== 'waiting') return;
        state = 'go';
        goAt = performance.now();
        pad.className = 'reaction-pad go';
        pad.textContent = 'GO!';
      }, delay);
    }

    pad.addEventListener('click', () => {
      if (state === 'waiting') {
        falseStarts += 1;
        pad.className = 'reaction-pad early';
        pad.textContent = 'Too soon — wait for GO';
        state = 'idle';
        setTimeout(startTrial, 900);
        return;
      }
      if (state === 'go') {
        const rt = performance.now() - goAt;
        times.push(rt);
        trial += 1;
        pad.textContent = `${Math.round(rt)} ms`;
        state = 'idle';
        setTimeout(startTrial, 700);
      }
    });

    function finish() {
      const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      const accuracy = Math.max(0, Math.min(1, (700 - avg) / 500)); // lower time = higher accuracy score
      pad.remove();
      showFeedback(container, accuracy, `Avg reaction: ${avg} ms · ${falseStarts} early taps`);
      onComplete({ accuracy, reactionTimeMs: avg, score: Exercises.computeScore(accuracy, avg), duration: opts.durationSec });
    }

    startTrial();
  }

  // ---- 2. Target Tracking ---------------------------------------------------
  function runTargetTracking(container, opts, onComplete) {
    clear(container);
    header(container, 'Target Tracking', 'Keep your cursor / finger on the moving dot.');
    const field = document.createElement('div');
    field.className = 'tracking-field';
    const dot = document.createElement('div');
    dot.className = 'tracking-dot';
    field.appendChild(dot);
    container.appendChild(field);

    const durationMs = 12000;
    const speed = 0.6 + opts.level * 0.15;
    let x = 50, y = 50, vx = speed, vy = speed * 0.8;
    let onTargetFrames = 0, totalFrames = 0;
    let pointer = { x: 50, y: 50, active: false };
    let raf, startTime;

    function pointerMove(e) {
      const rect = field.getBoundingClientRect();
      const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      pointer.x = (cx / rect.width) * 100;
      pointer.y = (cy / rect.height) * 100;
      pointer.active = true;
    }
    field.addEventListener('mousemove', pointerMove);
    field.addEventListener('touchmove', pointerMove, { passive: true });

    function frame(t) {
      if (!startTime) startTime = t;
      const elapsed = t - startTime;
      x += vx; y += vy;
      if (x < 5 || x > 95) vx *= -1;
      if (y < 10 || y > 90) vy *= -1;
      dot.style.left = x + '%';
      dot.style.top = y + '%';

      totalFrames += 1;
      if (pointer.active) {
        const dist = Math.hypot(pointer.x - x, pointer.y - y);
        if (dist < 8) onTargetFrames += 1;
      }

      if (elapsed < durationMs) {
        raf = requestAnimationFrame(frame);
      } else {
        finish();
      }
    }

    function finish() {
      cancelAnimationFrame(raf);
      field.removeEventListener('mousemove', pointerMove);
      field.removeEventListener('touchmove', pointerMove);
      const accuracy = totalFrames ? onTargetFrames / totalFrames : 0;
      field.remove();
      showFeedback(container, accuracy, `On target ${Math.round(accuracy * 100)}% of the time`);
      onComplete({ accuracy, score: Exercises.computeScore(accuracy), duration: opts.durationSec });
    }

    raf = requestAnimationFrame(frame);
  }

  Exercises.registerRun('reaction', runReaction);
  Exercises.registerRun('target_tracking', runTargetTracking);
})();
