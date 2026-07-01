<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  // Data for the two datasets
  const datasets = {
    diamond: [
      { name: "Gemini 2.1 Flash", score: 0.7, color: "#4dabf7" },
      { name: "GPT-4.0", score: 4.6, color: "#37b24d" },
      { name: "Claude Opus 4.8", score: 5.2, color: "#f76707" },
      { name: "Claude Opus 4.9", score: 13.4, color: "#e64980" }
    ],
    main: [
      { name: "Gemini 2.1 Flash", score: 8.5, color: "#4dabf7" },
      { name: "GPT-4.0", score: 23.4, color: "#37b24d" },
      { name: "Claude Opus 4.8", score: 45.2, color: "#f76707" },
      { name: "Claude Opus 4.9", score: 54.1, color: "#e64980" }
    ]
  };

  let activeDataset = 'diamond';
  let data = datasets[activeDataset];
  $: data = datasets[activeDataset];

  // Animated values for bars as a single tweened array store
  const animatedScores = tweened(data.map(item => item.score), {
    duration: 600,
    easing: cubicOut
  });

  // Reactive statement to trigger animation on dataset switch
  $: {
    animatedScores.set(data.map(item => item.score));
  }

  // Dimensions
  const width = 600;
  const height = 300;
  const padding = { top: 40, right: 20, bottom: 40, left: 50 };

  $: maxVal = activeDataset === 'diamond' ? 15 : 60;
</script>

<div class="chart-container">
  <div class="chart-header">
    <span class="chart-title">FrontierCode Score (%)</span>
    <div class="dataset-selector">
      <button 
        class:active={activeDataset === 'diamond'} 
        on:click={() => activeDataset = 'diamond'}
      >
        Diamond (Hardest)
      </button>
      <button 
        class:active={activeDataset === 'main'} 
        on:click={() => activeDataset = 'main'}
      >
        Main Subset
      </button>
    </div>
  </div>

  <svg viewBox="0 0 {width} {height}" class="chart-svg">
    <!-- Grid Lines -->
    {#each Array(5) as _, i}
      {@const yVal = (maxVal / 4) * i}
      {@const yPos = height - padding.bottom - ((height - padding.top - padding.bottom) / 4) * i}
      <line 
        x1={padding.left} 
        y1={yPos} 
        x2={width - padding.right} 
        y2={yPos} 
        class="grid-line" 
      />
      <text 
        x={padding.left - 12} 
        y={yPos + 4} 
        class="axis-text axis-y"
      >
        {yVal.toFixed(1)}%
      </text>
    {/each}

    <!-- Bar Elements -->
    {#each data as item, i}
      {@const barWidth = 50}
      {@const xPos = padding.left + ((width - padding.left - padding.right) / data.length) * i + 30}
      {@const currentScore = $animatedScores[i] || 0}
      {@const barHeight = ((height - padding.top - padding.bottom) * currentScore) / maxVal}
      {@const yPos = height - padding.bottom - barHeight}

      <!-- Bar rect -->
      <rect 
        x={xPos} 
        y={yPos} 
        width={barWidth} 
        height={barHeight} 
        rx="4"
        fill={item.color}
        class="chart-bar"
      />

      <!-- Score Text above Bar -->
      <text 
        x={xPos + barWidth / 2} 
        y={yPos - 8} 
        class="bar-value"
      >
        {currentScore.toFixed(1)}%
      </text>

      <!-- X Axis Label -->
      <text 
        x={xPos + barWidth / 2} 
        y={height - padding.bottom + 22} 
        class="axis-text axis-x"
      >
        {item.name}
      </text>
    {/each}
  </svg>
</div>

<style>
  .chart-container {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 24px;
    margin: 2em 0;
    font-family: var(--font-body);
    transition: background-color 0.2s, border-color 0.2s;
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .chart-title {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text);
  }

  .dataset-selector {
    display: flex;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    padding: 2px;
    border-radius: 6px;
  }

  .dataset-selector button {
    background: none;
    border: none;
    padding: 6px 12px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.15s, color 0.15s;
  }

  .dataset-selector button:hover {
    color: var(--text);
  }

  .dataset-selector button.active {
    background: var(--bg-surface);
    color: var(--text);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .chart-svg {
    width: 100%;
    height: auto;
    overflow: visible;
  }

  .grid-line {
    stroke: var(--border);
    stroke-width: 1;
    stroke-dasharray: 4 4;
  }

  .axis-text {
    font-size: 0.6875rem;
    fill: var(--text-subtle);
    font-family: var(--font-mono);
  }

  .axis-y {
    text-anchor: end;
  }

  .axis-x {
    text-anchor: middle;
  }

  .chart-bar {
    opacity: 0.85;
    transition: opacity 0.15s, transform 0.2s;
    cursor: pointer;
  }

  .chart-bar:hover {
    opacity: 1;
  }

  .bar-value {
    text-anchor: middle;
    font-size: 0.6875rem;
    font-weight: 600;
    fill: var(--text);
    font-family: var(--font-mono);
  }
</style>
