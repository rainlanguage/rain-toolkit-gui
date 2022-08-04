<script>
  export let progress;
  $: angle = 360 * progress;
  export let width = 30;

  // Adapt the logic according to the approach
  $: background = `radial-gradient(black 50%, transparent 51%),
    conic-gradient(transparent 0deg ${angle}deg, black ${angle}deg 360deg),
    conic-gradient(red 0deg, orange 50deg, yellow 100deg, green 150deg, blue 200deg, indigo 250deg, violet 300deg );`;

  $: cssVarStyles = `--background:${background}; --width:${width}px`;
</script>

<div id="progress-circle" style={cssVarStyles} />

<style>
  #progress-circle {
    background: var(--background);
    border-radius: 50%;
    width: var(--width);
    height: var(--width);
    transition: all 500ms ease-in;
    will-change: transform;
    mix-blend-mode: lighten;
  }
</style>
