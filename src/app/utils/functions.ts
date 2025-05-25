import { CharacterStatus } from "@/app/types";

export function getStatusName(status: CharacterStatus) {
    switch (status) {
        case "Alive": return "Vivo"
        case "Dead": return "Morto"
    }

    return "Desconhecido"
}