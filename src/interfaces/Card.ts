import { CardSet } from "./Set"

export interface Card {
    name: string,
    hp: number,
    resistances: { type: string, value: string }[],
    retreatCost: string[],
    supertype: string,
    types: string[],
    weaknesses: { type: string, value: string }[],
    abilities: Ability[],
    attacks: Attack[],
    rules: string[],
    subtypes: string[],
    images: { small: string, large: string },
    set: CardSet,
}

export interface Ability { name: string, text: string, type: string }

export interface Attack { cost: string[], damage: string, name: string, text: string }

export interface CardResults {
    count: number,
    data: Card[],
    page: number,
    pageSize: number,
    totalCount: number
}
