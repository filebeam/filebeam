import { readable, writable } from 'svelte/store';

const baseURL = "https://filebeam.xyz";

export const api = readable({
    upload: `${baseURL}/api`,
    announcements: `${baseURL}/api/anuncios`,
});

export const currFile = writable({
    file: undefined,
    icon: undefined,
    type: undefined,
    src: undefined,
});

export const upload = writable({
    disabled: true,
    uploading: false,
    link: undefined,
});