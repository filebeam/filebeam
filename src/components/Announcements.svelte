<script context="module">
    import ls from "localstorage-slim";
    import { api } from "../lib/stores";
    import { writable, get } from "svelte/store";

    import showdown from "showdown";
    import { Dialog } from "bits-ui";
    import { toast } from "svelte-sonner";
    import Button from "../components/Button.svelte";
    import { showAlert } from "../components/AlertDialog.svelte";

    import { fade } from "svelte/transition";
    import { scaleDialog } from "../lib/transitions";

    import { Newspaper, Megaphone, LoaderCircle } from "lucide-svelte";

    export const announcements = writable({
        data: [],
        loading: true,
        open: false,
    });

    const mdParser = new showdown.Converter();
    export function fetchAnnouncements() {
        announcements.update((currData) => ({ loading: true, ...currData }));
        fetch(get(api).announcements, {
            method: "GET",
        })
            .then(async (response) => {
                const result = await response.json();
                announcements.update((currData) => ({
                    data: result,
                    loading: false,
                    ...currData,
                }));
                if (
                    result.length > 0 &&
                    result[0].id > ls.get("FLAG_LAST_ANNOUNCEMENT")
                ) {
                    announcements.update((currData) => ({
                        open: true,
                        ...currData,
                    }));
                    ls.set("FLAG_LAST_ANNOUNCEMENT", result[0].id);
                }
            })
            .catch((err) => {
                console.error(err);
                announcements.update((currData) => ({
                    loading: false,
                    ...currData,
                }));
                if (get(announcements).open) {
                    announcements.update((currData) => ({
                        open: false,
                        ...currData,
                    }));
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
</script>

<Dialog.Root
    bind:open={$announcements.open}
    onOpenChange={(open) => {
        if (open && !$announcements.loading) {
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
                {#if $announcements.loading}
                    <LoaderCircle class="h-[1em] animate-spin" />
                {/if}
                Anuncios
            </Dialog.Title>
            {#if $announcements.data.length > 0}
                <div class="size-full overflow-y-scroll">
                    {#each $announcements.data as announcement}
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
            {:else if $announcements.loading}
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
                    on:click={() => ($announcements.open = false)}>
                    Cerrar
                </Button>
            </div>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>
