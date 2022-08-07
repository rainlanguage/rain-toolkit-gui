<script lang="ts">
  import { fade } from "svelte/transition";
  import Button from "$components/Button.svelte";
  import type {
    CreateSteps,
    Vapour721AConfig,
  } from "$routes/vapour721a/vapour721a-types";

  import { onMount } from "svelte";
  import { prepare } from "$routes/vapour721a/vapour721a";

  export let step: CreateSteps, config: Vapour721AConfig;
  onMount(() => {
    window.scrollTo(0, 0);
  });

  const deploy721A = () => {
    const args = prepare(config);
  };
</script>

<div in:fade>
  <Button
    on:click={() => {
      step--;
    }}>Back</Button
  >
  <pre>
    {JSON.stringify(
      { ...config, currencyContract: null, erc20info: null },
      null,
      2
    )}
  </pre>
  <Button on:click={deploy721A}>Back</Button>
</div>
