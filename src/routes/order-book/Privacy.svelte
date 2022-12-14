<script lang="ts">
    import Section from "$routes/order-book/Section.svelte";
    import { img } from "$routes/assets";

    export let params: {
        wild: string;
    }; 


</script> 

<div class="flex items-center justify-center">
    <Section>
        <div class="p-8 pb-12 px-16">
            <div class="flex flex-col items-center justify-center gap-y-2 px-2 pt-2 ">
                <div class="flex justify-between pb-6">
                    <span class="font-semibold text-black mr-5">Privacy</span>
                </div>
                <div class="width gap-y-4">
                    <div class="text-black">
                        Sloshy uses automated SENTRY bug report software. (It logs IP addresses anonymously with the bug reports, we don’t control how that works).
                    </div>
                    <div class="text-black mt-5 ml-1">
                        Read more at: <span class="hover:text-blue-500 underline"><a target="_blank" href="https://sentry.io/">https://sentry.io/</a></span>
                    </div>
                </div>
            </div>
        </div>
    </Section>
</div> 

<style>
    .width{
        width: 30rem;
    }
</style>