import { CardSet } from "./Set"

export interface Card {
    name: string,
    hp: number,
    retreatCost: string[],
    supertype: string,
    types: string[],
    weaknesses: { type: string, value: string }[],
    resistances: { type: string, value: string }[],
    abilities: Ability[],
    attacks: Attack[],
    rules: string[],
    subtypes: string[],
    images: { small: string, large: string },
    set: CardSet,
    evolvesTo?: string,
    evolvesFrom?: string
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
