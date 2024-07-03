export interface CardSet {
    name: string,
    series: string,
    ptcgoCode: string,
    releaseDate: string,
    images: CardSetImages,
    total: number,
    legalities: { standard?: string },
}

export interface CardSetImages {
    symbol: string,
    logo: string,
}

export interface SetNamesByLegality {
    standard: string[],
    unlimited: string[]
}