<script lang="ts">
  import { CreateSteps, type Vapour721AConfig } from "./vapour721a-types";
  import Configure from "./Configure.svelte";
  import Confirm from "$routes/vapour721a/Confirm.svelte";

  let config: Vapour721AConfig;
  let step: CreateSteps = CreateSteps.Configure;
</script>

{#if step == CreateSteps.Configure}
  <Configure bind:config bind:step />
{:else if step == CreateSteps.Confirm}
  <Confirm {config} bind:step />
{/if}
