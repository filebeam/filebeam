import { expoOut } from "svelte/easing";

export function uploadLink(node, { duration = 300, easing = expoOut } = {}) {
    const o = +getComputedStyle(node).opacity;

    return {
        css: (t, u) => `
        scale: ${0.9 + 0.1 * t};
        opacity: ${t * o};
        `,
        duration,
        easing,
    };
}

export function scaleDialog(node, { duration = 500, easing = expoOut } = {}) {
    const o = +getComputedStyle(node).opacity;

    return {
        css: (t, u) => `
        scale: ${1.2 - (0.2 * t)};
        opacity: ${t * o};
        `,
        duration,
        easing,
    };
}
