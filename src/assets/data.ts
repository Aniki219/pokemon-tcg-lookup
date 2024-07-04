import darknessIcon from "@images/icons/Darkness.png"
import dragonIcon from "@images/icons/Dragon.png"
import fairyIcon from "@images/icons/Fairy.png"
import fightingIcon from "@images/icons/Fighting.png"
import fireIcon from "@images/icons/Fire.png"
import grassIcon from "@images/icons/Grass.png"
import lightningIcon from "@images/icons/Lightning.png"
import metalIcon from "@images/icons/Metal.png"
import psychicIcon from "@images/icons/Psychic.png"
import waterIcon from "@images/icons/Water.png"
import colorlessIcon from "@images/icons/Colorless.png"

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

interface TypeData {
    icon: any,
    color: string
}

const typeDataByType = new Map<string, TypeData>([
    ["darkness", { color: "#5a4862", icon: darknessIcon }],
    ["dragon", { color: "#e0c28b", icon: dragonIcon }],
    ["fairy", { color: "#892752", icon: fairyIcon }],
    ["fighting", { color: "#e9a983", icon: fightingIcon }],
    ["fire", { color: "#ff8737", icon: fireIcon }],
    ["grass", { color: "green", icon: grassIcon }],
    ["lightning", { color: "#ffd804", icon: lightningIcon }],
    ["metal", { color: "#314459", icon: metalIcon }],
    ["psychic", { color: "#be74d0", icon: psychicIcon }],
    ["water", { color: "#72a0d8", icon: waterIcon }],
    ["colorless", { color: "white", icon: colorlessIcon }],
]);

export function getColorByType(pokeType: string) {
    const standardTypeName = pokeType.toLowerCase();
    if (typeDataByType.has(standardTypeName)) {
        return typeDataByType.get(standardTypeName);
    }
    throw new Error("No PokeType found for: " + pokeType);
}

export function getIconByType(pokeType: string) {
    const standardTypeName = pokeType.toLowerCase();
    if (typeDataByType.has(standardTypeName)) {
        return typeDataByType.get(standardTypeName)?.icon;
    }
    throw new Error("No PokeType found for: " + pokeType);
}

export function isPokeType(pokeType: string) {
    const standardTypeName = pokeType.toLowerCase();
    return typeDataByType.has(standardTypeName);
}

export function spellPokemon() {
    return "Pokémon";
}