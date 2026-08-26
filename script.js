/* Simay'a Özel Estetik Büyüyen Kalpler Uygulaması - Butter Smooth 60/120 FPS Engine */

document.addEventListener('DOMContentLoaded', () => {
  const bgCanvas = document.getElementById('bgCanvas');
  const bgCtx = bgCanvas.getContext('2d');
  const heartCanvas = document.getElementById('heartCanvas');
  const ctx = heartCanvas.getContext('2d');

  const chargingIndicator = document.getElementById('chargingIndicator');
  const colorSelect = document.getElementById('colorSelect');
  const modeSelect = document.getElementById('modeSelect');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const clearCanvasBtn = document.getElementById('clearCanvasBtn');

  let soundEnabled = true;

  function resizeCanvases() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    heartCanvas.width = window.innerWidth;
    heartCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  // -------------------------------------------------------------
  // 1. Pre-Compiled Ultra-Fast Path2D Heart Form
  // -------------------------------------------------------------
  const heartPath = new Path2D();
  const step = Math.PI / 30;
  let first = true;
  for (let t = 0; t <= Math.PI * 2 + step; t += step) {
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    if (first) {
      heartPath.moveTo(hx, hy);
      first = false;
    } else {
      heartPath.lineTo(hx, hy);
    }
  }

  // -------------------------------------------------------------
  // 2. Ambient Background Starfield
  // -------------------------------------------------------------
  const bgStars = [];
  for (let i = 0; i < 60; i++) {
    bgStars.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      radius: Math.random() * 1.8 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.015 + 0.005,
      color: Math.random() > 0.5 ? '#ffffff' : '#ffd1dc'
    });
  }

  function animateBackground() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgStars.forEach(star => {
      star.alpha += star.speed;
      if (star.alpha > 1 || star.alpha < 0.2) star.speed = -star.speed;
      bgCtx.save();
      bgCtx.globalAlpha = star.alpha;
      bgCtx.fillStyle = star.color;
      bgCtx.beginPath();
      bgCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      bgCtx.fill();
      bgCtx.restore();
    });
    requestAnimationFrame(animateBackground);
  }
  animateBackground();

  // -------------------------------------------------------------
  // 3. Color Palettes
  // -------------------------------------------------------------
  const colorPalettes = {
    white: ['#ffffff', '#fffafa', '#f8f9fa', '#fff0f5', '#e6f2ff'],
    pink: ['#ff4b72', '#ff758c', '#ffd1dc', '#ff1744', '#f50057'],
    neon: ['#b000ff', '#ff007f', '#00e5ff', '#ff00d4', '#7600bc'],
    gold: ['#ffe066', '#ffd700', '#ffaa00', '#fff5cc', '#ff8c00']
  };

  function getRandomColor() {
    const paletteKey = colorSelect.value || 'white';
    const palette = colorPalettes[paletteKey];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  // High-Performance Path2D Renderer with Soft Glow
  function drawOptimizedHeart(ctx, x, y, size, color = '#ffffff', alpha = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Outer Glow Aura (Optimized shadowBlur for 60fps)
    ctx.shadowColor = (color === '#ffffff' || color.startsWith('#fff')) ? 'rgba(255, 255, 255, 0.9)' : color;
    ctx.shadowBlur = Math.min(18, size * 0.2);

    const scale = size / 32;
    ctx.scale(scale, scale);

    // Fill Path2D (Blazing fast GPU operation)
    ctx.fillStyle = color;
    ctx.fill(heartPath);

    // Glossy Specular Highlight
    ctx.beginPath();
    ctx.arc(-5, -6, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fill();

    ctx.restore();
  }

  function drawSparkle(ctx, x, y, size, color = '#ffffff', alpha = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // -------------------------------------------------------------
  // 4. Fluid Hold-to-Grow Engine (Lerp Smooth Growth)
  // -------------------------------------------------------------
  let particles = [];
  let isHolding = false;
  let holdStartTime = 0;
  let holdPos = { x: 0, y: 0 };
  let currentHoldingSize = 0;
  let targetHoldingSize = 0;
  let frameCounter = 0;

  function startHold(e) {
    if (e.target.closest('.controls-bar') || e.target.closest('.main-header')) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    isHolding = true;
    holdStartTime = performance.now();
    holdPos = { x: clientX, y: clientY };
    currentHoldingSize = 25;
    targetHoldingSize = 25;

    chargingIndicator.style.left = `${clientX}px`;
    chargingIndicator.style.top = `${clientY}px`;
    chargingIndicator.classList.add('active');

    initAudio();
  }

  function moveHold(e) {
    if (!isHolding) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    holdPos = { x: clientX, y: clientY };

    chargingIndicator.style.left = `${clientX}px`;
    chargingIndicator.style.top = `${clientY}px`;
  }

  function endHold() {
    if (!isHolding) return;

    const finalSize = Math.max(25, currentHoldingSize);
    isHolding = false;
    chargingIndicator.classList.remove('active');

    const selectedColor = getRandomColor();
    playPopSound(finalSize);

    // 1. Giant Heart Floating Up
    particles.push({
      type: 'heart',
      x: holdPos.x,
      y: holdPos.y,
      size: finalSize,
      color: selectedColor,
      vx: (Math.random() - 0.5) * 1.0,
      vy: -1.8 - (finalSize / 90),
      alpha: 1,
      fadeRate: 0.0035 + (0.002 * (150 / finalSize)),
      wobbleSpeed: Math.random() * 0.04 + 0.02
    });

    // 2. Controlled Burst of Mini Floating White Hearts (Optimized pool)
    const burstCount = Math.min(45, Math.floor(20 + (finalSize / 5)));
    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (finalSize / 20) + 1.8;
      const subColor = getRandomColor();

      particles.push({
        type: Math.random() > 0.15 ? 'heart' : 'sparkle',
        x: holdPos.x,
        y: holdPos.y,
        size: Math.random() * (finalSize / 5) + 6,
        color: subColor,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        alpha: 1,
        fadeRate: Math.random() * 0.018 + 0.008,
        wobbleSpeed: Math.random() * 0.05 + 0.02
      });
    }
  }

  // Pointer Event Bindings
  window.addEventListener('mousedown', startHold);
  window.addEventListener('mousemove', moveHold);
  window.addEventListener('mouseup', endHold);

  window.addEventListener('touchstart', startHold, { passive: true });
  window.addEventListener('touchmove', moveHold, { passive: true });
  window.addEventListener('touchend', endHold);

  // -------------------------------------------------------------
  // 5. Main 60-120 FPS Render Loop (Zero Lag)
  // -------------------------------------------------------------
  function render(timestamp) {
    ctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
    frameCounter++;

    // Smooth Lerp Growth during hold
    if (isHolding) {
      const elapsed = (timestamp - holdStartTime) / 1000;
      targetHoldingSize = Math.min(270, 25 + elapsed * 105);

      // Butter-Smooth Linear Interpolation (Lerp)
      currentHoldingSize += (targetHoldingSize - currentHoldingSize) * 0.18;

      // Draw growing heart preview
      drawOptimizedHeart(ctx, holdPos.x, holdPos.y, currentHoldingSize, getRandomColor(), 0.96);

      // Controlled sparkle emission (Once every 8 frames to prevent lag)
      if (frameCounter % 8 === 0) {
        const angle = Math.random() * Math.PI * 2;
        const dist = currentHoldingSize * 0.55 + 10;
        particles.push({
          type: 'sparkle',
          x: holdPos.x + Math.cos(angle) * dist,
          y: holdPos.y + Math.sin(angle) * dist,
          size: Math.random() * 3 + 1,
          color: '#ffffff',
          vx: Math.cos(angle) * 0.8,
          vy: Math.sin(angle) * 0.8 - 0.8,
          alpha: 1,
          fadeRate: 0.05
        });
      }
    }

    // Render Active Particles (Limited array length cap for smooth 60fps)
    if (particles.length > 120) {
      particles.splice(0, particles.length - 120);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.fadeRate;

      if (p.wobbleSpeed) {
        p.x += Math.sin(frameCounter * p.wobbleSpeed) * 0.5;
      }

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      if (p.type === 'heart') {
        drawOptimizedHeart(ctx, p.x, p.y, p.size, p.color, p.alpha);
      } else {
        drawSparkle(ctx, p.x, p.y, p.size, p.color, p.alpha);
      }
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // -------------------------------------------------------------
  // 6. Sound FX
  // -------------------------------------------------------------
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playPopSound(size) {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      const freq = 680 - Math.min(480, size * 1.5);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.28);
    } catch (e) {}
  }

  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    soundToggleBtn.style.opacity = soundEnabled ? '1' : '0.6';
  });

  clearCanvasBtn.addEventListener('click', () => {
    particles = [];
  });
});
