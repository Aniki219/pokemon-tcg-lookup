export interface CardSet {
    name: string,
    series: string,
    ptcgoCode: string,
    releaseDate: string,
    images: CardSetImages,
    total: number
}

export interface CardSetImages {
    symbol: string,
    logo: string
}
