<script>
    import { LoaderCircle } from "lucide-svelte";
    export let icon = undefined,
        loading = false,
        href = undefined,
        disabled = false,
        type = "primary",
        target = undefined,
        tabindex = undefined;
</script>

{#if href}
    <a
        class="button {type ? type : 'primary'}"
        {href}
        {target}
        {disabled}
        {tabindex}>
        {#if loading}
            <LoaderCircle class="animate-spin" />
        {:else if icon}
            <svelte:component this={icon} />
        {/if}
        <slot />
    </a>
{:else}
    <button
        class="button {type ? type : 'primary'}"
        on:click
        {disabled}
        {tabindex}>
        {#if loading}
            <LoaderCircle class="animate-spin" />
        {:else if icon}
            <svelte:component this={icon} />
        {/if}
        <slot />
    </button>
{/if}

<style lang="postcss">
    .button.primary {
        gap: 4px;
        display: flex;
        font-weight: bold;
        align-items: center;
        letter-spacing: 0.05em;
        justify-content: center;
        transition-property: all;
        text-transform: uppercase;
        transition-duration: 300ms;
        font-size: theme(size.[3.5]);
        color: theme(colors.gray.700);
        transition-timing-function: ease-out;
        border-radius: theme("borderRadius.md");
        padding: theme(spacing.2) theme(spacing.4);
        background-color: theme("colors.gray.100");
        border: 1px solid theme("colors.gray.200");
    }

    :global(.dark) .button.primary {
        color: theme(colors.gray.200);
        background-color: theme("colors.gray.800");
        border: 1px solid theme("colors.gray.700");
    }

    .button.primary:active {
        gap: 6px;
        scale: 0.9;
        letter-spacing: 0.1em;
        background-color: theme("colors.gray.200");
        padding: theme(spacing.2) calc(theme(spacing.4) + 2px);
    }

    :global(.dark) .button.primary:active {
        background-color: theme("colors.gray.700");
    }

    @media (pointer: fine) and (hover: hover) {
        .button.primary:hover {
            gap: 6px;
            letter-spacing: 0.1em;
            background-color: theme("colors.gray.200");
            padding: theme(spacing.2) calc(theme(spacing.4) + 2px);
        }

        :global(.dark) .button.primary:hover {
            background-color: theme("colors.gray.700");
        }
    }

    .button.primary :global(svg) {
        height: 1.3em;
    }

    .button.secondary {
        color: theme(colors.gray.500);
    }

    :global(.dark) .button.secondary {
        color: theme(colors.gray.400);
    }

    @media (pointer: fine) and (hover: hover) {
        .button.secondary:hover {
            text-decoration: underline;
        }

        :global(.dark) .button.secondary:hover {
            color: theme(colors.gray.200);
        }
    }
</style>
