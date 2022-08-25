<script lang="ts">
  import Button from "$components/Button.svelte";
  import FormPanel from "$components/FormPanel.svelte";
  import Input from "$components/Input.svelte";
  import Select from "$components/Select.svelte";
  import SimpleTransactionModal from "$components/SimpleTransactionModal.svelte";
  import { addressValidate } from "$src/validation";
  import { getContext } from "svelte";
  import { roles } from "./verify";

  const { open } = getContext("simple-modal");

  export let verifyContract;

  let roleAddress, selectedRole;

  const handleClick = async () => {
    open(SimpleTransactionModal, {
      method: verifyContract.grantRole,
      args: [selectedRole.value, roleAddress],
      confirmationMsg: `${roleAddress} has been granted role '${selectedRole.label}'.`,
    });
  };
</script>

<FormPanel heading="Grant a role">
  <Input type="address" bind:value={roleAddress} validator={addressValidate}>
    <span slot="label">Address to grant the role to:</span>
  </Input>
  <Select items={roles} bind:value={selectedRole}>
    <span slot="label">The role to grant:</span>
  </Select>
  <Button shrink on:click={handleClick}>Grant role</Button>
</FormPanel>
