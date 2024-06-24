export interface Card {
    name: string,
    hp: number,
    resistances: { type: string, value: string }[],
    retreatCost: string[],
    types: string[],
    weaknesses: { type: string, value: string }[],
    abilities: { name: string, text: string, type: string }[],
    attacks: { cost: string[], damage: string, name: string, text: string }[],
    rules: string[],
    subtypes: string[],
    images: { small: string, large: string },
}

export interface CardResults {
    count: number,
    data: Card[],
    page: number,
    pageSize: number,
    totalCount: number
}