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