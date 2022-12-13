<script lang="ts">
    import Section from "$routes/order-book/Section.svelte";
    import { img } from "$routes/assets";

    export let params: {
        wild: string;
    }; 


</script> 

<div class="flex items-center justify-center">
    <Section>
        <div class="p-12">
            <img src={img['sloshy_comic']} alt="Sloshy Comic" />
        </div>
    </Section>
</div> 