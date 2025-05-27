import { CharacterStatus } from "@/app/types";

export function getStatusName(status: CharacterStatus) {
    switch (status) {
        case "Alive": return "Vivo"
        case "Dead": return "Morto"
    }

    return "Desconhecido"
}

export function hexToRgb(hex: string) {
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    const bigint = parseInt(hex, 16);

    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}