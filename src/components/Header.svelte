<script lang="ts">
    import { onMount } from "svelte";
    import "tippy.js/dist/tippy.css";
    import { fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import tippy, { createSingleton } from "tippy.js";
    import { DropdownMenu } from "bits-ui";
    import {
        CircleHelp,
        Newspaper,
        BadgeHelp,
        Shield,
        Scroll,
    } from "lucide-svelte/icons";
    import Logo from "./Logo.svelte";

    export let version: string;

    const helpMenu = [
        {
            name: "Preguntas Frecuentes",
            link: "https://docs.filebeam.xyz/faq/introduccion",
            icon: BadgeHelp,
        },
        {},
        {
            name: "Términos y condiciones",
            link: "https://docs.filebeam.xyz/disclaimer/tos",
            icon: Scroll,
        },
        {
            name: "Política de privacidad",
            link: "https://docs.filebeam.xyz/disclaimer/privacy",
            icon: Shield,
        },
    ];

    tippy.setDefaultProps({
        zIndex: 20,
        arrow: false,
        delay: [0, 200],
        offset: [0, 10],
        theme: "default",
        touch: ["hold", 500],
        moveTransition: "transform 0.2s ease",
    });

    onMount(() => {
        const tippyInstances = tippy("[data-tippy-content]");
        createSingleton(tippyInstances);
    });
</script>

<div
    class="fixed hidden h-14 w-full items-center justify-between px-5 py-2 h-sm:flex">
    <div class="group flex h-full w-fit items-center gap-1">
        <Logo
            class="h-full fill-gray-900 transition-colors dark:fill-gray-50"
            type="header" />
        <span
            class="hidden whitespace-nowrap pt-2 font-bold opacity-0 transition-opacity duration-200 group-hover:opacity-40 sm:block">
            {import.meta.env.DEV === true ? `v${version}-dev` : `v${version}`}
        </span>
    </div>
    <div class="flex h-full w-fit items-center gap-5">
        <DropdownMenu.Root loop={true}>
            <DropdownMenu.Trigger
                class="flex-center cursor-pointer opacity-50 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 active:opacity-100"
                data-tippy-content="Ayuda">
                <CircleHelp />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
                sideOffset={10}
                collisionPadding={20}
                transition={fade}
                transitionConfig={{
                    duration: 400,
                    easing: cubicOut,
                }}>
                {#each helpMenu as entry}
                    {#if Object.keys(entry).length > 0}
                        <DropdownMenu.Item href={entry.link} target="_blank">
                            <span>
                                <svelte:component this={entry.icon} />
                                {entry.name}
                            </span>
                        </DropdownMenu.Item>
                    {:else}
                        <DropdownMenu.Separator />
                    {/if}
                {/each}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
        <button
            class="cursor-pointer opacity-50 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 active:opacity-100"
            data-tippy-content="Anuncios">
            <Newspaper />
        </button>
    </div>
</div>
