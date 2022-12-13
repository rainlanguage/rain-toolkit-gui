<script>
    import {createEventDispatcher} from 'svelte';
    import Dropdown from 'sv-bootstrap-dropdown';
    import { selectedNetwork } from "$src/stores";
    import IconLibrary from './IconLibrary.svelte';
    import { img } from '$routes/assets';

    export let options;
    export let showExpand = true;
    export let label;
    export let staticLabel = '';
    export let className;
    export let dropDownClass = '';
    // export let expandIcon = IconLibrary.
    let selected;

    const dispatch = createEventDispatcher();

    function selectOption(option) {
        dispatch('change', {
            selected: option
        });
        selected = option.label
    }


    let dropdownTrigger;

    function commitAction(option) {
        if (option.action) {
            option.action()
        }
        selectOption(option)
    }

</script>

<div class="container">
  <Dropdown triggerElement={dropdownTrigger}>

    <button
        type="button"
        class={`${className} btn dropdown-toggle`}
        bind:this={dropdownTrigger}
    >
      <slot name="icon"></slot>
      <span class="select-label">{selected && !staticLabel ? selected : label}</span>
      {#if showExpand}
        <!-- <img class="expand" src={expandIcon} alt="expand"/> -->
        <span class="expand"><IconLibrary icon="down-open-arrow" width={20} /></span>
      {/if}
    </button>
    <div slot="DropdownMenu" class={`${dropDownClass} dropdown-M`}>
      {#each options as option}
        <button class="dropdown-item" type="button" on:click={()=>commitAction(option)}>
          {#if option?.config?.icon}
            <img src={img[option.config.icon]} alt={option?.label}/>
          {/if}
          <span class="select-label">{option.label}</span>
        </button>
      {/each}
    </div>
  </Dropdown>
</div>
<style>
    /* @import url("https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"); */

    :global(.dropdown){
        position: relative;
    }
    .btn:focus {
        outline: none;
        box-shadow: none;
    }

    .btn {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: start;
        color: #212529;
        text-align: center;
        vertical-align: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-color: transparent;
        border: 1px solid transparent;
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: 0.25rem;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }

    .dropdown-item {
        width: 100%;
        clear: both;
        text-align: inherit;
        white-space: nowrap;
        /* background-color: transparent; */
        border: 0;
    }

    .expand {
        /* margin-right: 10px; */
        margin-left: 10px;
    }
    .dropdown-toggle {
        white-space: nowrap;
    }

    .dropdown-toggle::after {
        display: inline-block;
        content: '';
        border: none;
    }

    .meinMenu {
        color: #000;
    }

    .inputSelect {
        background: #f2b861;
        border-radius: 5px;
        height: 26px;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 25px;
        color: #000000;
        padding: 0;
        min-width: 180px;
    }

    .dropdown-M {
        max-height: 255px;
        height: auto;
        overflow: auto;
        /* background-color: #f2b861; */
    }

    .select-label {
        margin-left: 10px;
        width: calc(100% - 15px);
    }

    :global(.dropdown-menu.show) {
        display: block;
    }


    /* .nav-dropdown {
        background-color: #2c2c5454 !important;
        border-radius: 0 0 5px 5px !important;
        box-shadow: 0 4px 4px #00000040;
        border: none !important;
    } */

    .nav-dropdown .dropdown-item {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600 !important;
        font-size: 16px !important;
        line-height: 30px !important;
        padding: 0 40px 0 13px !important;
        background: transparent;
        color: #000;
        height: 39px;
    }

    .nav-dropdown .dropdown-item:focus,
    .nav-dropdown .dropdown-item:hover {
        text-decoration: none;
        color: #000;
        padding-top: 2px;
        padding-bottom: 2px;
        background: #f2b861 !important;
    }


    .dropdown-item {
        color: #000000;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 27px;
        padding: 0 !important;
    }

    .dropdown-item:focus, .dropdown-item:hover {
        text-decoration: none;
    }
    :global(.dropdown-menu){
        background-color: #959495 !important;
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1000;
        display: none;
        float: left;
        min-width: 10rem;
        padding: 0.5rem 0;
        margin: 0.125rem 0 0;
        font-size: 1rem;
        color: #212529;
        text-align: left;
        list-style: none;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid rgba(0,0,0,.15);
        border-radius: 0.25rem;
    }
    :global(.btn:not(:disabled):not(.disabled)) {
        cursor: pointer;
    }
</style>