<script>
    import { filesize } from "filesize";
    import fileExtension from "file-extension";
    import * as audioMeta from "music-metadata-browser";

    import { fileTypes } from "../lib/fileTypes";
    import { currFile, upload } from "../lib/stores";

    import { toast } from "svelte-sonner";
    import { alert, showAlert } from "./AlertDialog.svelte";

    import { CloudUpload, LoaderCircle, FileIcon } from "lucide-svelte";

    import resolveConfig from "tailwindcss/resolveConfig";
    import tailwindConfig from "../../tailwind.config.js";
    import FilePreview from "./FilePreview.svelte";

    const twCfg = resolveConfig(tailwindConfig);

    let dropArea,
        x,
        y,
        fileInput,
        active,
        readingFile = false;

    $: innerWidth = 0;

    function followCursor(e) {
        let rect = dropArea.getBoundingClientRect();
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        dropArea.style.setProperty("--mouse-x", `${x}px`);
        dropArea.style.setProperty("--mouse-y", `${y}px`);
    }

    function handleDrag(e) {
        e.preventDefault();
        followCursor(e);
        active = true;
    }

    function handleDrop(e) {
        e.preventDefault();
        active = false;
        readingFile = true;

        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            if (e.dataTransfer.items.length > 1) {
                toast.info("No se permiten archivos múltiples", {
                    description: "Se usará el primer archivo",
                });
            }

            const item = e.dataTransfer.items[0];

            if (item.kind === "file") {
                const file = item.getAsFile();
                handleFile(file);
            } else {
                showAlert({
                    title: "Archivo no válido",
                    description:
                        "El archivo no puede ser leído, posiblemente sea una carpeta",
                });
                readingFile = false;
            }
        }
    }

    function handlePaste(e) {
        if (!$upload.uploading) {
            const data = e.clipboardData;
            if (data.files.length > 1) {
                toast.info("No se permiten archivos multiples", {
                    description: "Se usara el primer archivo",
                });
            }

            const file = data.files[0];
            if (file) {
                handleFile(file);
            }
        }
    }

    function dragLeave(e) {
        e.preventDefault();
        active = false;
    }

    function handleFile(file) {
        function setCurrFile(file) {
            $upload.disabled = false;
            for (const fileType of fileTypes) {
                if (fileType.extensions.includes(fileExtension(file.name))) {
                    $currFile.file = file;
                    $currFile.icon = fileType.icon;
                    $currFile.type = fileType.name;

                    switch (fileType.type) {
                        case "img":
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = () => {
                                $currFile.src = reader.result;
                                $currFile.icon = FilePreview;
                                readingFile = false;
                            };

                            break;
                        case "audio":
                            audioMeta
                                .parseBlob(file)
                                .then((metadata) => {
                                    if (metadata.common.picture) {
                                        const base64 = toBase64(
                                            metadata.common.picture[0].data,
                                        );

                                        if (base64) {
                                            $currFile.src = `data:image/png;base64, ${base64}`;
                                            $currFile.icon = FilePreview;
                                        }
                                    }

                                    readingFile = false;
                                })
                                .catch((err) => {
                                    readingFile = false;
                                });
                            break;

                            function toBase64(data) {
                                const stringChar = data.reduce((str, byte) => {
                                    return str + String.fromCharCode(byte);
                                }, "");
                                return btoa(stringChar);
                            }
                        default:
                            readingFile = false;
                            break;
                    }

                    return;
                }
            }

            $currFile.file = file;
            $currFile.icon = FileIcon;
            $currFile.type = "Archivo";
            readingFile = false;
        }

        if (fileInput) {
            $alert.open = false;
            readingFile = true;
            fileInput.files = undefined;
            const reader = new FileReader();

            reader.onloadstart = () => {
                $upload.disabled = true;
                let fileList = new DataTransfer();
                fileList.items.add(file);
                fileInput.files = fileList.files;
                setCurrFile(file);
                reader.abort();

                $currFile.src = undefined;
            };

            reader.onerror = () => {
                showAlert({
                    title: "Archivo no válido",
                    description:
                        "El archivo no puede ser leído, posiblemente sea una carpeta",
                });

                readingFile = false;
                if ($currFile.file) $upload.disabled = false;
            };

            if (!(file instanceof Blob)) {
                file = this.files[0];
            }

            if (file == undefined) {
                readingFile = false;
                return;
            }

            reader.readAsDataURL(file);
        }
    }

    window.addEventListener("paste", handlePaste);
</script>

<svelte:window bind:innerWidth />

<button
    class:active
    class="dropArea"
    disabled={$upload.uploading}
    on:mousemove={!$upload.uploading ? followCursor : undefined}
    on:dragleave={!$upload.uploading ? dragLeave : undefined}
    on:dragover={!$upload.uploading ? handleDrag : undefined}
    on:drop={!$upload.uploading ? handleDrop : undefined}
    bind:this={dropArea}
    on:click={() => {
        fileInput.click();
    }}>
    <div
        class="flex-center size-full flex-row gap-5 p-6 text-left h-sm:flex-col h-sm:gap-2 h-sm:text-center">
        <svelte:component
            this={$currFile.icon != undefined ? $currFile.icon : CloudUpload}
            class="h-auto max-h-20 w-auto min-w-20" />
        <div class="flex max-w-[80%] flex-col">
            <span class="truncate text-lg font-bold">
                {#if readingFile}
                    <LoaderCircle class="inline-block h-[1em] animate-spin" />
                {/if}
                {#if $currFile.file != undefined}
                    {$currFile.file.name}
                {:else if innerWidth >= parseInt(twCfg.theme.screens.sm)}
                    Selecciona o arrastra un archivo
                {:else}
                    Pulsa para seleccionar un archivo
                {/if}
            </span>
            <span class="truncate font-semibold opacity-50">
                {#if $currFile.file != undefined}
                    {`${$currFile.type}, ${filesize($currFile.file.size)} (${fileExtension($currFile.file.name)})`}
                {:else}
                    Ningún archivo seleccionado
                {/if}
            </span>
        </div>
    </div>
</button>

<input
    type="file"
    class="hidden"
    bind:this={fileInput}
    on:change={handleFile} />

<style>
    .dropArea {
        width: 50rem;
        height: 18rem;
        display: flex;
        max-width: 85%;
        max-height: 60%;
        cursor: pointer;
        position: relative;
        text-align: center;
        border-width: 1.8px;
        background-repeat: repeat;
        color: theme("colors.gray.500");
        border-radius: theme("borderRadius.xl");
        border-color: theme("colors.gray.200");
        background-color: theme("colors.gray.100/.3");
        transition:
            all 300ms cubic-bezier(0.4, 0, 0.2, 1),
            transform 500ms ease;
    }

    .dropArea:active,
    .dropArea.active {
        scale: 0.96;
    }

    .dropArea:active,
    .dropArea:focus-visible {
        color: theme("colors.gray.600");
        border-color: theme("colors.gray.300");
        background-color: theme("colors.gray.200/.6");
    }

    @media (pointer: fine) {
        .dropArea:hover::before,
        .dropArea.active::before {
            opacity: 1;
        }
    }

    .dropArea::before {
        opacity: 0;
        width: 100%;
        height: 100%;
        content: " ";
        position: absolute;
        transition-duration: 700ms;
        transition-property: opacity;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        background: radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            theme("colors.gray.400/0.25"),
            transparent 45%
        );
    }

    @media (pointer: fine) and (hover: hover) {
        .dropArea:hover,
        .dropArea.active {
            color: theme("colors.gray.600");
            border-color: theme("colors.gray.300");
            background-color: theme("colors.gray.200/.6");
        }
    }

    :global(.dark) .dropArea {
        border-color: theme("colors.gray.700");
        background-color: theme("colors.gray.800/.3");
    }

    :global(.dark) .dropArea:active,
    :global(.dark) .dropArea:focus-visible,
    :global(.dark) .dropArea.active {
        color: theme("colors.gray.300");
        border-color: theme("colors.gray.600");
        background-color: theme("colors.gray.800/.6");
    }

    :global(.dark) .dropArea::before {
        background: radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            theme("colors.gray.50/0.03"),
            transparent 60%
        );
    }

    @media (pointer: fine) and (hover: hover) {
        :global(.dark) .dropArea:hover,
        :global(.dark) .dropArea.active {
            color: theme("colors.gray.300");
            border-color: theme("colors.gray.600");
            background-color: theme("colors.gray.800/.6");
        }
    }
</style>
