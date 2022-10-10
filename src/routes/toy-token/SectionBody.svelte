<script lang="ts">
    export let direction : string  = "flex-col"
</script>

<div class={`p-4 flex ${direction} gap-y-4`}><slot /></div>