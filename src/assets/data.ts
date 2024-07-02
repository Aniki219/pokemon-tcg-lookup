export const pokeTypes = [
    "darkness",
    "dragon",
    "fairy",
    "fighting",
    "fire",
    "grass",
    "lightning",
    "metal",
    "psychic",
    "water",
    "colorless",
];

export const subtypes = [
    "ACE SPEC",
    "Ancient",
    "BREAK",
    "Baby",
    "Basic",
    "EX",
    "Eternamax",
    "Fusion Strike",
    "Future",
    "GX",
    "Goldenrod Game Corner",
    "Item",
    "LEGEND",
    "Level-Up",
    "MEGA",
    "Pokémon Tool",
    "Pokémon Tool F",
    "Prime",
    "Prism Star",
    "Radiant",
    "Rapid Strike",
    "Restored",
    "Rocket's Secret Machine",
    "SP",
    "Single Strike",
    "Special",
    "Stadium",
    "Stage 1",
    "Stage 2",
    "Star",
    "Supporter",
    "TAG TEAM",
    "Team Plasma",
    "Technical Machine",
    "Tera",
    "Ultra Beast",
    "V",
    "V-UNION",
    "VMAX",
    "VSTAR",
    "ex"
]

const colorByType = new Map<string, string>([
    ["darkness", "#5a4862"],
    ["dragon", "#e0c28b"],
    ["fairy", "#892752"],
    ["fighting", "#e9a983"],
    ["fire", "#ff8737"],
    ["grass", "green"],
    ["lightning", "#ffd804"],
    ["metal", "#314459"],
    ["psychic", "#be74d0"],
    ["water", "#72a0d8"],
    ["colorless", "white"],
]);

export function getColorByType(pokeType: string) {
    const standardTypeName = pokeType.toLowerCase();
    if (colorByType.has(standardTypeName)) {
        return colorByType.get(standardTypeName);
    }
    throw new Error("No PokeType found for: " + pokeType);
}

export function getIconByType(pokeType: string) {
    const standardTypeName = pokeType.toLowerCase();
    if (colorByType.has(standardTypeName)) {
        return `/icons/${standardTypeName}.png`;
    }
    throw new Error("No PokeType found for: " + pokeType);
}

export function isPokeType(pokeType: string) {
    const standardTypeName = pokeType.toLowerCase();
    return colorByType.has(standardTypeName);
}

export function spellPokemon() {
    return "Pokémon";
}