<script lang="ts">
  import { formatAddress } from "$src/utils";

  export let admins, heading;
</script>

<div class="w-1/3">
  <span class="text-white">{heading}</span>
  {#each admins as admin}
    <div class="text-gray-400 flex flex-col mb-4">
      <span>Address: {formatAddress(admin.address)}</span>
      <!-- <span>Roles: {admin.roles}</span> -->
    </div>
  {/each}
</div>
