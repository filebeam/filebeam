<script>
    import fileExtension from "file-extension";

    import { currFile } from "../lib/stores.js";
    import { fileTypes } from "../lib/fileTypes.js";

    export { className as class };

    let alt,
        fallbackIcon,
        className = "",
        validSrc = false;

    for (const fileType of fileTypes) {
        if (fileType.extensions.includes(fileExtension($currFile.file.name))) {
            fallbackIcon = fileType.icon;
        }
    }

    const img = new Image();

    img.onload = () => {
        validSrc = true;
    };

    img.onerror = () => {
        validSrc = false;
    };

    $: if ($currFile.src !== undefined) {
        img.src = $currFile.src;
        alt = `Vista previa de ${$currFile.file.name}`;
    }
</script>

{#if img.src && validSrc}
    <img class={`rounded-md ${className}`} src={img.src} {alt} />
{:else}
    <svelte:component this={fallbackIcon} class={className} />
{/if}
