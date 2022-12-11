<script lang="ts">
    export let outerpB = "pb-6"
    export let innerpB = "pb-4"
</script>
    
    <div class="flex flex-col items-center justify-start pt-10 {outerpB}">
        <div class="flex flex-col items-center bg-white gap-y-4 {innerpB} bRadius">
            <slot />
        </div>
    </div>

<style>
    .bRadius{
        border-radius: 20px;
    }
</style>