<script lang="ts">
    import Button from '$components/Button.svelte';
    import Input from 'rain-svelte-components/package/Input.svelte'
</script>
<div class="flex items-center justify-center py-6">
    <div class="flex flex-col items-center bg-white gap-y-4 p-4 rounded-lg">
        <span>Swap</span>
        <div class="flex flex-col items-stretch bg-gray-300 border border-orange-400 rounded-lg">
            <div class="flex justify-between gap-x-14 border-b p-4 border-orange-400">
                <span class="bg-white rounded-lg text-2xl px-6 py-1 ">0.0</span>
                <span>dghujfdh</span>
            </div>
            <div class="flex justify-between gap-x-14 p-4">
                <span class="bg-white rounded-lg text-2xl px-6 py-1 ">0.0</span>
                <span>dghujfdh</span>
            </div>
        </div>
        <!-- <span class="flex w-full"> -->
            <!-- <Button variant="bg-orange-300">Ok</Button> -->
            <button class="bg-orange-400 w-full rounded-full text-base leading-none py-3 px-5 text-white" >Ok</button>
        <!-- </span> -->
    </div>
    <!-- <Input /> -->
</div>