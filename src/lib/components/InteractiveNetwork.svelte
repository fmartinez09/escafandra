<script>
  import { onMount } from 'svelte';

  let canvas;
  let container;

  onMount(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = 0;
    let height = 0;
    
    // Grid system
    let grid = [];
    const spacing = 12; // Grid cell size
    let cols = 0;
    let rows = 0;
    
    let time = 0;
    let mouse = { x: -1000, y: -1000, active: false };

    let colors = {
      bg: '#0a0a0a',
      nodeBase: '120, 170, 255', // RGB for blue-violet
      kgLine: '120, 170, 255',
    };

    function updateColors() {
      if (typeof window === 'undefined') return;
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      
      colors.bg = isLight ? '#ffffff' : '#0a0a0a';
      // In light mode, a deeper blue; in dark, a bright violet-blue
      colors.nodeBase = isLight ? '37, 99, 235' : '120, 170, 255';
      colors.kgLine = isLight ? '17, 24, 39' : '255, 255, 255';
    }

    function resize() {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = 350; // slightly taller to appreciate the field
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      initSystem();
    }

    // A simple fast 2D noise approximation using harmonics
    function fbm(x, y, t) {
      let value = 0;
      let amplitude = 0.5;
      let frequency = 0.02;
      
      for(let i = 0; i < 3; i++) {
        value += amplitude * (Math.sin(x * frequency + t) * Math.cos(y * frequency - t));
        x += 100; y += 100; // shift phase
        amplitude *= 0.5;
        frequency *= 2;
        t *= 1.2;
      }
      return value; // roughly -1 to 1
    }

    function initSystem() {
      grid = [];
      cols = Math.ceil(width / spacing) + 2;
      rows = Math.ceil(height / spacing) + 2;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          grid.push({
            c, r,
            ox: c * spacing, 
            oy: r * spacing,
            x: c * spacing, 
            y: r * spacing,
            vx: 0, 
            vy: 0,
            mouseActivation: 0, // energy injected by mouse
            waveActivation: 0,  // energy from propagating waves
            phaseOffset: Math.random() * Math.PI * 2,
            isKgCapable: Math.random() < 0.05 // Only 5% of nodes can form connections
          });
        }
      }
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    updateColors();
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });

    resize();
    window.addEventListener('resize', resize);

    // Propagating waves state
    let waves = [];

    function animate() {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      const mouseRadius = 120;
      let activeKgNodes = [];

      // Randomly spawn global propagating waves
      if (Math.random() < 0.02) {
        waves.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0,
          maxRadius: 200 + Math.random() * 300,
          speed: 2 + Math.random() * 2,
          intensity: 0.5 + Math.random() * 0.5
        });
      }

      // Update waves
      for (let i = waves.length - 1; i >= 0; i--) {
        let w = waves[i];
        w.radius += w.speed;
        if (w.radius > w.maxRadius) {
          waves.splice(i, 1);
        }
      }

      // 1. UPDATE AND RENDER NODES
      for (let i = 0; i < grid.length; i++) {
        let p = grid[i];

        // Base noise field (slow moving cognitive substrate)
        let n = fbm(p.ox, p.oy, time);
        // Normalize noise to 0..1 roughly
        let noiseActivation = Math.max(0, n * 1.5); 

        // Mouse influence
        if (mouse.active) {
          const dx = mouse.x - p.ox;
          const dy = mouse.y - p.oy;
          const distSq = dx * dx + dy * dy;
          const rSq = mouseRadius * mouseRadius;
          
          if (distSq < rSq) {
            // Gaussian-like falloff
            const influence = Math.exp(-(distSq) / (rSq * 0.4));
            p.mouseActivation += influence * 0.15; // Inject energy
            
            // Reorganize: pull slightly towards mouse, creating clusters
            p.vx += (dx / Math.sqrt(distSq)) * influence * 0.5;
            p.vy += (dy / Math.sqrt(distSq)) * influence * 0.5;
          }
        }

        // Propagating waves influence
        p.waveActivation = 0;
        for (let w of waves) {
          const dx = w.x - p.ox;
          const dy = w.y - p.oy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          // Ring effect
          const ringDist = Math.abs(dist - w.radius);
          if (ringDist < 40) {
            const waveInfluence = Math.exp(-(ringDist * ringDist) / (20 * 20)) * w.intensity;
            p.waveActivation += waveInfluence;
          }
        }

        // Decay injected energies
        p.mouseActivation *= 0.92;
        p.waveActivation *= 0.95;

        // Total activation
        const totalActivation = noiseActivation + p.mouseActivation + p.waveActivation;

        // Elastic physics for position (returning to origin)
        p.vx += (p.ox - p.x) * 0.1;
        p.vy += (p.oy - p.y) * 0.1;
        p.vx *= 0.8;
        p.vy *= 0.8;
        p.x += p.vx;
        p.y += p.vy;

        // Visual properties based on activation
        // Base alpha is very low, spikes up with activation
        let alpha = 0.05 + Math.min(1, totalActivation * 0.8);
        // Size grows with activation
        let size = 1.5 + Math.min(4, totalActivation * 2.5);

        // Render node as a soft square
        ctx.fillStyle = `rgba(${colors.nodeBase}, ${alpha})`;
        ctx.fillRect(p.x - size/2, p.y - size/2, size, size);

        // Track potential KG Nodes
        if (p.isKgCapable && totalActivation > 0.8) {
          activeKgNodes.push({
            x: p.x,
            y: p.y,
            intensity: Math.min(1, totalActivation)
          });
        }
      }

      // 2. RENDER KNOWLEDGE GRAPH CONNECTIONS
      ctx.lineWidth = 0.8;
      
      for (let i = 0; i < activeKgNodes.length; i++) {
        let a = activeKgNodes[i];
        
        // Draw the KG node highlight
        ctx.fillStyle = `rgba(${colors.kgLine}, ${a.intensity})`;
        ctx.fillRect(a.x - 2, a.y - 2, 4, 4);

        // Connect to nearby active nodes
        for (let j = i + 1; j < activeKgNodes.length; j++) {
          let b = activeKgNodes[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let distSq = dx*dx + dy*dy;
          
          if (distSq < 10000) { // dist < 100
            let dist = Math.sqrt(distSq);
            let falloff = 1 - (dist / 100);
            let lineAlpha = a.intensity * b.intensity * falloff * 0.6;
            
            ctx.strokeStyle = `rgba(${colors.kgLine}, ${lineAlpha})`;
            ctx.setLineDash([2, 4]); // dashed lines for tech feel
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            // Check for triangles (triplets)
            for (let k = j + 1; k < activeKgNodes.length; k++) {
              let c = activeKgNodes[k];
              let d1 = Math.sqrt((a.x - c.x)**2 + (a.y - c.y)**2);
              let d2 = Math.sqrt((b.x - c.x)**2 + (b.y - c.y)**2);

              if (d1 < 100 && d2 < 100) {
                let polyAlpha = lineAlpha * c.intensity * 0.15;
                ctx.fillStyle = `rgba(${colors.kgLine}, ${polyAlpha})`;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.lineTo(c.x, c.y);
                ctx.closePath();
                ctx.fill();
              }
            }
          }
        }
      }

      ctx.setLineDash([]);
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  });
</script>

<div class="network-container" bind:this={container}>
  <canvas bind:this={canvas}></canvas>
  <div class="network-legend">
    <div class="legend-item">
      <span class="dot grid-dot"></span> Neural Substrate
    </div>
    <div class="legend-item">
      <span class="dot node-dot"></span> Activation Clusters
    </div>
    <div class="legend-item font-mono">
      <span>KG_SYS ACTIVE</span>
    </div>
  </div>
</div>

<style>
  .network-container {
    width: 100%;
    position: relative;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    margin: 24px 0;
    transition: background-color 0.2s, border-color 0.2s;
  }

  canvas {
    display: block;
    cursor: crosshair;
  }

  .network-legend {
    position: absolute;
    bottom: 12px;
    right: 16px;
    display: flex;
    gap: 16px;
    pointer-events: none;
    font-size: 0.625rem;
    font-family: var(--font-mono);
    color: var(--text-subtle);
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    display: inline-block;
  }

  .grid-dot {
    background: rgba(120, 170, 255, 0.45);
  }

  .node-dot {
    background: #ffffff;
    box-shadow: 0 0 4px #ffffff;
  }
</style>
