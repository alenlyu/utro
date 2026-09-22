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

  // ---- 3. Sequence Tapping (Simon-style) -------------------------------------
  function runSequenceTapping(container, opts, onComplete) {
    clear(container);
    header(container, 'Sequence Tapping', 'Watch the pattern light up, then repeat it in the same order.');
    const COLORS = [
      { hex: '#c0554b' }, { hex: '#4a6fa5' }, { hex: '#5a8a5f' }, { hex: '#b8963f' }
    ];
    const pad = document.createElement('div');
    pad.style.display = 'grid';
    pad.style.gridTemplateColumns = 'repeat(2, 1fr)';
    pad.style.gap = '10px';
    pad.style.maxWidth = '280px';
    pad.style.margin = '20px auto';
    const buttons = COLORS.map((c) => {
      const b = document.createElement('button');
      b.style.height = '90px';
      b.style.borderRadius = '12px';
      b.style.border = 'none';
      b.style.background = c.hex;
      b.style.opacity = '0.55';
      b.style.transition = 'opacity 0.15s ease';
      b.style.cursor = 'pointer';
      pad.appendChild(b);
      return b;
    });
    container.appendChild(pad);

    const rounds = Math.min(6, 2 + Math.floor(opts.level / 2));
    let sequence = [], roundIndex = 0, correctRounds = 0, userInput = [], accepting = false;

    function flash(i, cb) {
      buttons[i].style.opacity = '1';
      setTimeout(() => { buttons[i].style.opacity = '0.55'; setTimeout(cb, 180); }, 380);
    }
    function playSequence(seq, cb) {
      let i = 0;
      (function step() {
        if (i >= seq.length) return cb();
        flash(seq[i], () => { i += 1; step(); });
      })();
    }
    function nextRound() {
      if (roundIndex >= rounds) return finish();
      sequence.push(Math.floor(Math.random() * COLORS.length));
      userInput = [];
      accepting = false;
      setTimeout(() => playSequence(sequence, () => { accepting = true; }), 500);
    }

    buttons.forEach((b, i) => {
      b.addEventListener('click', () => {
        if (!accepting) return;
        flash(i, () => {});
        userInput.push(i);
        const idx = userInput.length - 1;
        if (userInput[idx] !== sequence[idx]) {
          accepting = false;
          roundIndex += 1;
          setTimeout(nextRound, 500);
          return;
        }
        if (userInput.length === sequence.length) {
          accepting = false;
          correctRounds += 1;
          roundIndex += 1;
          setTimeout(nextRound, 500);
        }
      });
    });

    function finish() {
      const accuracy = correctRounds / rounds;
      pad.remove();
      showFeedback(container, accuracy, `${correctRounds}/${rounds} sequences completed · longest ${sequence.length}`);
      onComplete({ accuracy, score: Exercises.computeScore(accuracy), duration: opts.durationSec });
    }

    nextRound();
  }

  // ---- 4. Aim Trainer ---------------------------------------------------------
  function runAimTrainer(container, opts, onComplete) {
    clear(container);
    header(container, 'Aim Trainer', 'Tap each target as soon as it appears.');
    const field = document.createElement('div');
    field.style.position = 'relative';
    field.style.width = '100%';
    field.style.height = '320px';
    field.style.background = 'rgba(127,127,127,0.08)';
    field.style.borderRadius = '12px';
    field.style.overflow = 'hidden';
    container.appendChild(field);

    const trials = 8 + Math.min(6, opts.level);
    const targetSize = Math.max(28, 56 - opts.level * 3);
    let trial = 0, hits = 0, reactionTimes = [];
    let target = null, shownAt = 0, timeoutId = null;

    function spawn() {
      if (trial >= trials) return finish();
      trial += 1;
      if (target) target.remove();
      target = document.createElement('button');
      target.style.position = 'absolute';
      target.style.width = targetSize + 'px';
      target.style.height = targetSize + 'px';
      target.style.borderRadius = '50%';
      target.style.border = 'none';
      target.style.background = '#c0554b';
      target.style.cursor = 'pointer';
      // Percentage-based placement (matches Target Tracking's approach) so we
      // never depend on reading the field's pixel size at spawn time — that
      // can read as 0 if the layout hasn't settled yet, stacking every
      // target at the top-left corner.
      const marginPct = 12;
      const xPct = marginPct + Math.random() * (100 - marginPct * 2);
      const yPct = marginPct + Math.random() * (100 - marginPct * 2);
      target.style.left = xPct + '%';
      target.style.top = yPct + '%';
      target.style.transform = 'translate(-50%, -50%)';
      target.addEventListener('click', onHit);
      field.appendChild(target);
      shownAt = performance.now();
      timeoutId = setTimeout(onMiss, 1800);
    }
    function onHit() {
      clearTimeout(timeoutId);
      reactionTimes.push(performance.now() - shownAt);
      hits += 1;
      if (target) { target.remove(); target = null; }
      spawn();
    }
    function onMiss() {
      if (target) { target.remove(); target = null; }
      spawn();
    }
    function finish() {
      field.remove();
      const accuracy = hits / trials;
      const avgRt = reactionTimes.length ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 0;
      showFeedback(container, accuracy, `${hits}/${trials} hit · avg ${avgRt} ms`);
      onComplete({ accuracy, reactionTimeMs: avgRt, score: Exercises.computeScore(accuracy, avgRt), duration: opts.durationSec });
    }
    spawn();
  }

  // ---- 5. Rhythm Tap ------------------------------------------------------------
  function runRhythmTap(container, opts, onComplete) {
    clear(container);
    header(container, 'Rhythm Tap', 'Tap the button right as the circle pulses.');
    const beatIndicator = document.createElement('div');
    beatIndicator.style.width = '80px';
    beatIndicator.style.height = '80px';
    beatIndicator.style.borderRadius = '50%';
    beatIndicator.style.background = '#4a6fa5';
    beatIndicator.style.margin = '20px auto';
    beatIndicator.style.transition = 'transform 0.1s ease';
    container.appendChild(beatIndicator);
    const tapBtn = document.createElement('button');
    tapBtn.className = 'btn btn-primary tap-target';
    tapBtn.textContent = 'TAP';
    container.appendChild(tapBtn);

    const beatMs = Math.max(500, 900 - opts.level * 40);
    const totalBeats = 12 + Math.min(8, opts.level);
    let beatCount = 0, beatTime = 0, deviations = [], tapped = false, intervalId = null;

    function pulse() {
      if (beatCount >= totalBeats) return finish();
      beatCount += 1;
      beatTime = performance.now();
      tapped = false;
      AudioFx.tick();
      beatIndicator.style.transform = 'scale(1.25)';
      setTimeout(() => { beatIndicator.style.transform = 'scale(1)'; }, 150);
    }

    tapBtn.addEventListener('click', () => {
      if (tapped || beatCount === 0) return;
      tapped = true;
      deviations.push(Math.abs(performance.now() - beatTime));
    });

    intervalId = setInterval(pulse, beatMs);
    pulse();

    function finish() {
      clearInterval(intervalId);
      tapBtn.remove(); beatIndicator.remove();
      const avgDev = deviations.length ? Math.round(deviations.reduce((a, b) => a + b, 0) / deviations.length) : beatMs;
      const accuracy = Math.max(0, Math.min(1, 1 - avgDev / (beatMs * 0.6)));
      const missedBeats = totalBeats - deviations.length;
      showFeedback(container, accuracy, `avg timing offset ${avgDev} ms · ${missedBeats} missed beats`);
      onComplete({ accuracy, reactionTimeMs: avgDev, score: Exercises.computeScore(accuracy, avgDev), duration: opts.durationSec });
    }
  }

  Exercises.registerRun('reaction', runReaction);
  Exercises.registerRun('target_tracking', runTargetTracking);
  Exercises.registerRun('sequence_tapping', runSequenceTapping);
  Exercises.registerRun('aim_trainer', runAimTrainer);
  Exercises.registerRun('rhythm_tap', runRhythmTap);
})();
