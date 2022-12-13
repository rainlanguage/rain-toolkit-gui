<script lang="ts">
    import Section from "$routes/order-book/Section.svelte";
    import { img } from "$routes/assets";

    export let params: {
        wild: string;
    }; 


</script> 

<div class="flex items-center justify-center">
    <Section>
        <div class="p-10">
            <img src={img['not_found']} alt="Not Found" width="300" height="300" />
            <!-- <span class="text-lg text-black"> 404 Not Found</span> -->
        </div>
    </Section>
</div> 