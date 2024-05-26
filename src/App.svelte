<script>
    import { upload, currFile, api } from "./lib/stores";
    import ls from "localstorage-slim";

    import Logo from "./components/Logo.svelte";
    import Button from "./components/Button.svelte";
    import Header from "./components/Header.svelte";
    import FileDrop from "./components/FileDrop.svelte";
    import Background from "./components/Background.svelte";

    import { fade } from "svelte/transition";
    import { scaleDialog, uploadLink } from "./lib/transitions";

    import { Dialog, Checkbox, Label } from "bits-ui";
    import { Toaster, toast } from "svelte-sonner";
    import AlertDialog, {
        alert,
        showAlert,
    } from "./components/AlertDialog.svelte";

    import {
        Link,
        Info,
        Check,
        Hammer,
        OctagonX,
        CloudUpload,
        TriangleAlert,
    } from "lucide-svelte";

    import resolveConfig from "tailwindcss/resolveConfig";
    import tailwindConfig from "../tailwind.config.js";

    const version = __APP_VERSION__;
    const twCfg = resolveConfig(tailwindConfig);

    fetch("/consoleLogo.png")
        .then((response) => response.blob())
        .then((blob) => {
            const reader = new FileReader();
            reader.onload = () => {
                console.log(
                    `%cFileBeam%c\n⚠️ Antes de usar la consola, tal vez quieras echarle un vistazo a los siguientes enlaces primero%c\n\n📚 Docs: https://docs.filebeam.xyz\n🐈 GitHub: https://github.com/filebeam/filebeam`,

                    `padding: 14px;
                    font-size: 3.5em;
                    color: transparent;
                    background-size: 100%;
                    background-repeat: no-repeat;
                    background-image: url("${reader.result}");
                    `,

                    `all: initial;
                    color: #f3e590;
                    font-size: 1.5em;
                    font-weight: bold;
                    font-family: sans-serif;
                    `,

                    `font-size: 1.2em;
                    font-weight: bold;
                    font-family: sans-serif;
                    `,
                );
            };
            reader.readAsDataURL(blob);
        });

    let consentDialog = !ls.get("userConsent"),
        userConsent = false;

    function handleConsent() {
        consentDialog = false;
        ls.set("userConsent", true);
    }

    $: innerWidth = 0;
    $: toastPos =
        innerWidth >= parseInt(twCfg.theme.screens.lg)
            ? "bottom-right"
            : "top-right";

    // Cambia al modo oscuro dependiendo del tema del sistema
    /* TODO: Remplazar por una opcion entre AUTO, DARK y LIGHT al
    implementar los ajustes */

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }

    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
            document.documentElement.classList.toggle("dark", e.matches);
        });

    function uploadFile() {
        $upload.disabled = true;
        $upload.uploading = true;
        $upload.link = undefined;
        const formData = new FormData();
        formData.append("file", $currFile.file);

        let uploadTimeout = setTimeout(() => {
            toast.warning("La subida parece estar tomando más de lo esperado", {
                description:
                    "Verifica tu conexión a internet o el estado del servidor",
            });
        }, 20000);

        fetch($api.upload, {
            method: "POST",
            body: formData,
        })
            .then(async (response) => {
                $upload.disabled = false;
                $upload.uploading = false;
                clearTimeout(uploadTimeout);
                if (response.ok) {
                    const link = await response.text();
                    $upload.link = link;
                } else {
                    async function showResponse(response) {
                        showAlert({
                            title: "Detalles adicionales",
                            description: /* HTML */ `
                                <strong> Respuesta del servidor: </strong>
                                <br />
                                <code
                                    >${escapeHtml(await response.text())}
                                </code>
                                Al reportar errores a los desarrolladores,
                                asegúrate de mostrar este mensaje y,
                                adicionalmente, una captura de pantalla de la
                                consola de desarrollador
                                <br />
                                <span class="kbd-label">
                                    <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> +
                                    <kbd>J</kbd>
                                    &nbsp;&nbsp;Abrir consola de desarollador
                                </span>
                            `,
                            icon: Info,
                        });
                    }
                    switch (response.status) {
                        case 503:
                            showAlert({
                                title: "Servidor bajo mantenimiento",
                                description:
                                    "El servidor se encuentra bajo mantenimiento o no está disponible",
                                icon: Hammer,
                                actions: [
                                    {
                                        name: "Mostrar detalles",
                                        type: "secondary",
                                        action: () => showResponse(response),
                                    },
                                    {
                                        name: "Aceptar",
                                        action: () => {
                                            $alert.open = false;
                                        },
                                    },
                                ],
                            });
                            break;
                        case 403:
                            showAlert({
                                title: "Petición denegada",
                                description:
                                    "El servidor ha denegado la petición, la subida ha fallado",
                                icon: OctagonX,
                                actions: [
                                    {
                                        name: "Mostrar detalles",
                                        type: "secondary",
                                        action: () => showResponse(response),
                                    },
                                    {
                                        name: "Aceptar",
                                        action: () => {
                                            $alert.open = false;
                                        },
                                    },
                                ],
                            });
                            break;
                        case 413:
                            showAlert({
                                title: "Tamaño máximo excedido",
                                description:
                                    "El tamaño de la subida ha excedido los límites del servidor",
                                icon: OctagonX,
                                actions: [
                                    {
                                        name: "Mostrar detalles",
                                        type: "secondary",
                                        action: () => showResponse(response),
                                    },
                                    {
                                        name: "Aceptar",
                                        action: () => {
                                            $alert.open = false;
                                        },
                                    },
                                ],
                            });
                            break;
                        default:
                            showAlert({
                                title: "Error del servidor",
                                description: `El servidor ha respondido con el código de error ${response.status}`,
                                icon: OctagonX,
                                actions: [
                                    {
                                        name: "Mostrar detalles",
                                        type: "secondary",
                                        action: () => showResponse(response),
                                    },
                                    {
                                        name: "Aceptar",
                                        action: () => {
                                            $alert.open = false;
                                        },
                                    },
                                ],
                            });
                            break;
                    }
                }

                function escapeHtml(unsafe) {
                    return unsafe.replace(/[&<"']/g, function (match) {
                        switch (match) {
                            case "&":
                                return "&amp;";
                            case "<":
                                return "&lt;";
                            case ">":
                                return "&gt;";
                            case '"':
                                return "&quot;";
                            case "'":
                                return "&#039;";
                        }
                    });
                }
            })

            .catch((err) => {
                $upload.disabled = false;
                $upload.uploading = false;
                console.error(err);
                showAlert({
                    title: "La subida ha fallado",
                    description: "Ha ocurrido un error desconocido",
                    icon: OctagonX,
                    actions: [
                        {
                            name: "Mostrar detalles",
                            type: "secondary",
                            action: () => {
                                showAlert({
                                    title: "Detalles adicionales",
                                    description: /* HTML */ `
                                        <strong>Error: </strong>
                                        <br />
                                        <code>${err}</code>
                                        Al reportar errores a los
                                        desarrolladores, asegúrate de mostrar
                                        este error y preferiblemente, una
                                        captura de pantalla de la consola de
                                        desarrollador
                                        <br />
                                        <span class="kbd-label">
                                            <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> +
                                            <kbd>J</kbd>
                                            &nbsp;&nbsp;Abrir consola de
                                            desarrollador
                                        </span>
                                    `,
                                    icon: Info,
                                });
                            },
                        },
                        {
                            name: "Aceptar",
                            action: () => {
                                $alert.open = false;
                            },
                        },
                    ],
                });
            });
    }
</script>

<svelte:window bind:innerWidth />

<AlertDialog />
<Dialog.Root
    bind:open={consentDialog}
    closeOnEscape={false}
    closeOnOutsideClick={false}>
    <Dialog.Portal>
        <Dialog.Overlay
            transition={fade}
            transitionConfig={{ duration: 200 }} />
        <Dialog.Content class="md:max-w-md" transition={scaleDialog}>
            <div class="flex-center size-full flex-col gap-2">
                <Logo
                    type="default"
                    class="h-14 fill-blue-400 dark:fill-blue-300" />
                <div class="flex-center gap-2">
                    <Checkbox.Root
                        bind:checked={userConsent}
                        id="consentCheckbox"
                        aria-labelledby="consentLabel">
                        <Checkbox.Indicator let:isChecked>
                            {#if isChecked}
                                <Check class="size-4" strokeWidth={3} />
                            {/if}
                        </Checkbox.Indicator>
                    </Checkbox.Root>
                    <Label.Root
                        class="font-medium dark:text-gray-300"
                        id="consentLabel"
                        for="consentCheckbox">
                        Al hacer uso de FileBeam, aceptas los
                        <a
                            class="link"
                            target="_blank"
                            href="https://docs.filebeam.xyz/disclaimer/tos">
                            Terminos y condiciones
                        </a>
                        y la
                        <a
                            class="link"
                            target="_blank"
                            href="https://docs.filebeam.xyz/disclaimer/privacy">
                            Politica de privacidad
                        </a>
                        del servicio
                    </Label.Root>
                </div>
                <Button
                    icon={Check}
                    disabled={!userConsent}
                    on:click={handleConsent}>Continuar</Button>
            </div>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>

<main class="absolute flex flex-col text-gray-900 dark:text-gray-50">
    <Toaster
        bind:position={toastPos}
        toastOptions={{
            unstyled: true,
            duration: 5000,
        }}>
        <Info slot="info-icon" />
        <TriangleAlert slot="warning-icon" />
    </Toaster>
    <div class="z-10 size-full">
        <Header {version} />
        <div class="flex-center h-full w-full flex-col gap-6 h-sm:gap-3">
            <FileDrop />
            <div
                class="flex-center bottom-8 w-full flex-row gap-4 text-center h-sm:absolute h-md:flex-col">
                {#if $upload.link}
                    <div
                        class="flex-center flex-col"
                        out:fade={{ duration: 200 }}
                        in:uploadLink>
                        <span
                            class="font-semibold text-gray-600 dark:text-gray-200">
                            <Check class="inline-block h-[1em]" />
                            Archivo subido correctamente
                        </span>
                        <a
                            class="link font-semibold"
                            target="_blank"
                            href={$upload.link}>
                            <Link class="inline-block h-[1em]" />
                            {$upload.link}
                        </a>
                    </div>
                {/if}
                <Button
                    icon={CloudUpload}
                    loading={$upload.uploading}
                    disabled={$upload.disabled}
                    on:click={uploadFile}>
                    Subir
                </Button>
            </div>
        </div>
    </div>
    <Background />
</main>
