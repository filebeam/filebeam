<script>
    import { onMount } from "svelte";
    import { api } from "../lib/stores";
    import ls from "localstorage-slim";

    import { fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { scaleDialog } from "../lib/transitions";

    import showdown from "showdown";
    import "tippy.js/dist/tippy.css";
    import tippy, { createSingleton } from "tippy.js";
    import { Dialog, DropdownMenu } from "bits-ui";
    import Button from "../components/Button.svelte";
    import { toast } from "svelte-sonner";
    import Logo from "./Logo.svelte";

    import {
        Scroll,
        Shield,
        Newspaper,
        BadgeHelp,
        Megaphone,
        CircleHelp,
        LoaderCircle,
    } from "lucide-svelte/icons";
    import { showAlert } from "./AlertDialog.svelte";

    export let version;
    let announcements = {
        data: [],
        loading: true,
        open: false,
    };

    const mdParser = new showdown.Converter();
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

    export function fetchAnnouncements() {
        announcements.loading = true;
        fetch($api.announcements, {
            method: "GET",
        })
            .then(async (response) => {
                announcements.data = await response.json();
                announcements.loading = false;
                if (
                    announcements.data.length > 0 &&
                    announcements.data[0].id > ls.get("FLAG_LAST_ANNOUNCEMENT")
                ) {
                    announcements.open = true;
                    ls.set("FLAG_LAST_ANNOUNCEMENT", announcements.data[0].id);
                }
            })
            .catch(() => {
                announcements.loading = false;
                if (announcements.open) {
                    announcements.open = false;
                    showAlert({
                        title: "Ocurrio un error",
                        description: "No se pudieron cargar los anuncios",
                    });
                } else {
                    toast.warning("Ocurrio un error", {
                        description: "No se pudieron cargar los anuncios",
                    });
                }
            });
    }

    if (ls.get("FLAG_USER_CONSENT") == true) {
        fetchAnnouncements();
    }

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
        <Dialog.Root
            bind:open={announcements.open}
            onOpenChange={(open) => {
                if (open && !announcements.loading) {
                    fetchAnnouncements();
                }
            }}>
            <Dialog.Trigger
                class="flex-center cursor-pointer opacity-50 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 active:opacity-100"
                data-tippy-content="Anuncios">
                <Newspaper />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay
                    transition={fade}
                    transitionConfig={{ duration: 200 }} />
                <Dialog.Content transition={scaleDialog}>
                    <Dialog.Title>
                        {#if announcements.loading}
                            <LoaderCircle class="h-[1em] animate-spin" />
                        {/if}
                        Anuncios
                    </Dialog.Title>
                    {#if announcements.data.length > 0}
                        <div class="size-full overflow-y-scroll">
                            {#each announcements.data as announcement}
                                {@const content = mdParser.makeHtml(
                                    announcement.content,
                                )}
                                <div
                                    class="mt-4 min-h-20 w-full rounded-lg border border-gray-200 bg-gray-100 first:mt-0 dark:border-gray-700 dark:bg-gray-900">
                                    <div class="size-full p-3">
                                        <div class="flex flex-col">
                                            {#if announcement.img_url}
                                                <img
                                                    class="max-h-60 w-full rounded-lg bg-gray-300 object-cover dark:bg-gray-700"
                                                    src={announcement.img_url}
                                                    alt={announcement.title} />
                                            {/if}
                                            <span
                                                class="w-full gap-4 font-bold {announcement.img_url
                                                    ? 'text-2xl mt-3 mb-1 text-gray-600 dark:text-gray-200'
                                                    : 'text-lg text-gray-500 dark:text-gray-300'}
                                                ">
                                                {announcement.title}
                                                <span
                                                    class="hidden text-[.7em] opacity-50 sm:inline">
                                                    · {announcement.date}
                                                </span>
                                            </span>
                                            <div
                                                class="markdown {announcement.img_url
                                                    ? 'text-gray-500 dark:text-gray-300'
                                                    : 'text-gray-400 dark:text-gray-400'}">
                                                {@html content}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else if announcements.loading}
                        <div class="flex-center w-full flex-col gap-3">
                            <img
                                class="max-h-60 w-full rounded-md"
                                src="/src/assets/cat-sandwich.gif"
                                alt="Cargando Anuncios" />
                            <span class="font-bold uppercase text-gray-400">
                                <LoaderCircle
                                    class="inline-block h-[1em] animate-spin" />
                                Cargando Anuncios
                            </span>
                        </div>
                    {:else}
                        <div class="flex-center w-full flex-col">
                            <Newspaper
                                class="size-16 text-gray-400 dark:text-gray-600" />
                            <div class="flex-center mt-4 flex-col">
                                <span
                                    class="font-bold uppercase text-gray-600 dark:text-gray-400">
                                    No hay anuncios
                                </span>
                                <p class="text-gray-400 dark:text-gray-500">
                                    Vuelve luego para obtener actualizaciones...
                                </p>
                            </div>
                        </div>
                    {/if}
                    <Megaphone class="dialog-icon" />
                    <div
                        class="mt-4 flex w-full flex-row flex-wrap items-center justify-between gap-3">
                        <Button
                            target="_blank"
                            type="secondary"
                            href="https://jorge603.instatus.com">
                            Estado de los servidores
                        </Button>
                        <Button
                            tabindex="1"
                            on:click={() => (announcements.open = false)}>
                            Cerrar
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    </div>
</div>
