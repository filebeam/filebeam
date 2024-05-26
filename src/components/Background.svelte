<script>
    import { currFile } from "../lib/stores";
    import { extractColors } from "extract-colors";
    import resolveConfig from "tailwindcss/resolveConfig";
    import tailwindConfig from "../../tailwind.config.js";

    let validSrc, bgColors;

    const img = new Image();
    const twCfg = resolveConfig(tailwindConfig);

    img.onload = () => {
        extractColors(img)
            .then((colors) => {
                validSrc = true;
                while (colors.length < 4) {
                    colors.push(
                        colors[Math.floor(Math.random() * colors.length)],
                    );
                }

                bgColors = colors;
            })
            .catch((validSrc = false));
    };

    img.onerror = () => {
        validSrc = false;
    };

    $: if ($currFile.src !== undefined) {
        img.src = $currFile.src;
    } else {
        validSrc = false;
    }
</script>

<bgContainer
    style:--bg-col-1={validSrc ? bgColors[0].hex : twCfg.theme.colors.blue[600]}
    style:--bg-col-2={validSrc ? bgColors[1].hex : twCfg.theme.colors.blue[400]}
    style:--bg-col-3={validSrc ? bgColors[2].hex : twCfg.theme.colors.blue[800]}
    style:--bg-col-4={validSrc
        ? bgColors[3].hex
        : twCfg.theme.colors.blue[900]}>
    <bgBlob></bgBlob>
    <bgBlob></bgBlob>
    <bgBlob></bgBlob>
    <bgBlob></bgBlob>
</bgContainer>
<bgBackdrop />

<style>
    @keyframes blob1 {
        0%,
        100% {
            transform: translate(10%, 30%) scale(0.99, 1.21) rotate(0deg);
        }

        10% {
            transform: translate(50%, 20%) scale(1.43, 2.42) rotate(15deg);
        }

        20% {
            transform: translate(25%, -50%) scale(1.43, 1.87) rotate(30deg);
        }

        30% {
            transform: translate(85%, 40%) scale(0.88, 1.21) rotate(45deg);
        }

        40% {
            transform: translate(-20%, 80%) scale(1.21, 0.99) rotate(60deg);
        }

        50% {
            transform: translate(40%, 10%) scale(1.87, 2.42) rotate(75deg);
        }

        60% {
            transform: translate(-10%, -20%) scale(1.87, 1.87) rotate(90deg);
        }

        70% {
            transform: translate(70%, 50%) scale(1.43, 0.99) rotate(105deg);
        }

        80% {
            transform: translate(0%, 60%) scale(1.32, 2.2) rotate(120deg);
        }

        90% {
            transform: translate(30%, -10%) scale(1.54, 0.88) rotate(135deg);
        }
    }

    @keyframes blob2 {
        0%,
        100% {
            transform: translate(20%, 60%) scale(0.77, 0.99) rotate(0deg);
        }

        10% {
            transform: translate(-30%, 40%) scale(1.98, 3.08) rotate(15deg);
        }

        20% {
            transform: translate(40%, -80%) scale(2.31, 1.43) rotate(30deg);
        }

        30% {
            transform: translate(95%, -30%) scale(0.55, 1.76) rotate(45deg);
        }

        40% {
            transform: translate(-40%, 100%) scale(1.32, 0.77) rotate(60deg);
        }

        50% {
            transform: translate(60%, -10%) scale(2.53, 2.75) rotate(75deg);
        }

        60% {
            transform: translate(-30%, -50%) scale(2.75, 2.09) rotate(90deg);
        }

        70% {
            transform: translate(-90%, 70%) scale(2.09, 0.77) rotate(105deg);
        }

        80% {
            transform: translate(0%, -80%) scale(1.65, 2.42) rotate(120deg);
        }

        90% {
            transform: translate(50%, -30%) scale(2.53, 0.55) rotate(135deg);
        }
    }

    @keyframes blob3 {
        0%,
        100% {
            transform: translate(-10%, -70%) scale(0.66, 0.88) rotate(0deg);
        }

        10% {
            transform: translate(20%, -50%) scale(1.76, 2.42) rotate(15deg);
        }

        20% {
            transform: translate(-60%, 90%) scale(2.09, 1.54) rotate(30deg);
        }

        30% {
            transform: translate(-85%, 40%) scale(0.44, 1.98) rotate(45deg);
        }

        40% {
            transform: translate(50%, -120%) scale(1.32, 0.66) rotate(60deg);
        }

        50% {
            transform: translate(-40%, -20%) scale(2.2, 2.86) rotate(75deg);
        }

        60% {
            transform: translate(10%, 70%) scale(2.97, 1.87) rotate(90deg);
        }

        70% {
            transform: translate(80%, -80%) scale(2.2, 0.66) rotate(105deg);
        }

        80% {
            transform: translate(-30%, 80%) scale(1.54, 2.53) rotate(120deg);
        }

        90% {
            transform: translate(-20%, 50%) scale(2.86, 0.44) rotate(135deg);
        }
    }

    @keyframes blob4 {
        0%,
        100% {
            transform: translate(30%, 40%) scale(0.99, 1.1) rotate(0deg);
        }

        10% {
            transform: translate(-10%, 20%) scale(1.54, 1.87) rotate(15deg);
        }

        20% {
            transform: translate(50%, -60%) scale(1.76, 1.43) rotate(30deg);
        }

        30% {
            transform: translate(75%, 20%) scale(0.99, 1.43) rotate(45deg);
        }

        40% {
            transform: translate(-30%, 80%) scale(1.43, 0.77) rotate(60deg);
        }

        50% {
            transform: translate(60%, 0%) scale(2.2, 2.2) rotate(75deg);
        }

        60% {
            transform: translate(-20%, -50%) scale(2.53, 1.76) rotate(90deg);
        }

        70% {
            transform: translate(-70%, 60%) scale(1.76, 0.88) rotate(105deg);
        }

        80% {
            transform: translate(40%, -70%) scale(1.54, 1.98) rotate(120deg);
        }

        90% {
            transform: translate(10%, -40%) scale(1.98, 0.99) rotate(135deg);
        }
    }

    bgBackdrop {
        width: 100%;
        height: 100%;
        position: absolute;
        pointer-events: none;
        backdrop-filter: blur(70px);
    }

    bgContainer {
        width: 100%;
        height: 100%;
        opacity: 0.3;
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        position: absolute;
        align-items: center;
        pointer-events: none;
        align-content: center;
        justify-content: center;
        transition: opacity 0.4s ease-in-out;
    }

    :global(.dark bgContainer) {
        opacity: 0.1;
    }

    bgBlob {
        width: 30%;
        height: 30%;
        display: flex;
        transition: all 1s ease;
        animation-duration: 100s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
        border-radius: 30% 80% 75% 40% / 40% 40% 70% 50%;
    }

    bgBlob:nth-child(1) {
        animation-name: blob1;
        background-color: var(--bg-col-1);
    }

    bgBlob:nth-child(2) {
        animation-name: blob2;
        background-color: var(--bg-col-2);
    }

    bgBlob:nth-child(3) {
        animation-name: blob3;
        background-color: var(--bg-col-3);
    }

    bgBlob:nth-child(4) {
        animation-name: blob4;
        background-color: var(--bg-col-4);
    }
</style>
