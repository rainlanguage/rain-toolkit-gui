<script lang="ts">
  import type { StateConfig } from "rain-sdk";

  export let vmStateConfig: StateConfig;
  $: console.log(vmStateConfig);
</script>
