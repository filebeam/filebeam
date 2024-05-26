<script context="module">
    import { writable, get } from "svelte/store";

    import Button from "./Button.svelte";
    import { AlertDialog } from "bits-ui";
    import { LoaderCircle, TriangleAlert } from "lucide-svelte";

    import { fade } from "svelte/transition";
    import { scaleDialog } from "../lib/transitions";

    export const alert = writable({
        title: "",
        description: "",
        icon: undefined,
        raw: false,
        actions: undefined,
        loading: false,
        useEsc: true,
        open: false,
    });

    export function showAlert(options = {}) {
        alert.set({
            title: "",
            description: "",
            actions: undefined,
            icon: undefined,
            loading: false,
            useEsc: true,
            raw: false,
            ...options,
            open: true,
        });
    }
</script>

<AlertDialog.Root bind:open={$alert.open} closeOnEscape={$alert.useEsc}>
    <AlertDialog.Portal>
        <AlertDialog.Overlay
            transition={fade}
            transitionConfig={{ duration: 200 }} />
        <AlertDialog.Content transition={scaleDialog}>
            <AlertDialog.Title>
                {#if $alert.loading}
                    <LoaderCircle class="h-[1em] animate-spin" />
                {/if}
                {$alert.title}
            </AlertDialog.Title>
            <AlertDialog.Description>
                {#if !$alert.raw}
                    {@html $alert.description}
                {:else}
                    {$alert.description}
                {/if}
            </AlertDialog.Description>
            <div
                class="mt-4 flex flex-row flex-wrap justify-end gap-3 self-end">
                {#if $alert.actions}
                    {#each $alert.actions as button, index (button)}
                        <Button
                            tabindex={index === $alert.actions.length - 1
                                ? 1
                                : ""}
                            disabled={$alert.loading}
                            type={button.type}
                            on:click={button.action}>
                            {button.name}
                        </Button>
                    {/each}
                {:else}
                    <Button on:click={() => ($alert.open = false)}
                        >Aceptar</Button>
                {/if}
            </div>
            <svelte:component
                this={$alert.icon ? $alert.icon : TriangleAlert}
                class="dialog-icon" />
        </AlertDialog.Content>
    </AlertDialog.Portal>
</AlertDialog.Root>
