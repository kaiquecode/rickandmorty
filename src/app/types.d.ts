export interface Character {
    id: number;
    name: string;
    status: CharacterStatus;
    species: string;
    type: string;
    gender: string;
    origin: OriginOrLocation;
    location: OriginOrLocation;
    image: string;
    episode: string[];
    url: string;
    created: string;
}
export interface OriginOrLocation {
    name: string;
    url: string;
}

export type CharacterStatus = "Alive" | "Dead" | "unknown"