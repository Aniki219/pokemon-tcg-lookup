import { Card, CardResults } from "@models/Card";
import process from "process";
import { SearchParams, getCardRequestUrl } from "@/utils/helpers";

export const getCardResultsPage = async (searchParams: SearchParams) => {
    const url = getCardRequestUrl(searchParams);
    return await fetch(url, {
        method: "GET",
        headers: {
            "X-Api-Key": process.env.POKEMON_SECRET as string
        }
    })
        .then(resp => resp.json())
        .then(function (res: CardResults) {
            return res;
        });
}

export const getCardResultsPages = async (searchParams: SearchParams, pageLoadCallback?: (loaded: number) => any) => {
    const { totalPages, page } = searchParams;

    var loaded = 0;

    const promises = (new Array(totalPages)).fill(0).map((_, i) => {
        return new Promise<CardResults>(async (resolve) => {
            const cardResults = await getCardResultsPage({ ...searchParams, page: page + i });
            loaded++;
            if (pageLoadCallback) {
                pageLoadCallback(loaded);
            }
            return resolve(cardResults);
        })
    })

    return await Promise.all<CardResults>(
        promises
    )
        .then((cardData: CardResults[]) => {
            const pagesData = cardData.map(page => {
                if (page && page.data) {
                    return page.data;
                }
                return [] as Card[];
            }); //Card[][]

            const names = pagesData
                .flat()
                .map(data => {
                    return data.name
                });
            const uniqueNames = Array.from(new Set(names));
            const alphabetizedNames = uniqueNames.sort((a, b) => (a > b) ? 1 : -1);

            return alphabetizedNames;
        });
}

export const getCards = async (searchParams: SearchParams): Promise<CardResults> => {
    const cardResults = await getCardResultsPage(searchParams);

    if (!cardResults || cardResults.data.length === 0) {
        return cardResults;
    }
    const cardDataByName = new Map<string, Card[]>();
    const cards = cardResults.data;

    cards.forEach(card => {
        const name = card.name;
        if (!cardDataByName.has(name)) {
            cardDataByName.set(name, []);
        }
        cardDataByName.get(name)?.push(card);
    });

    const sortedNames = Array.from(cardDataByName.keys()).sort((a, b) => {
        return a.length > b.length ? 1 : -1;
    })

    for (const name of sortedNames) {
        const cardsArray = cardDataByName.get(name);
        if (!cardsArray) continue;
        cardsArray.sort((a, b) => {
            return a.set.releaseDate > b.set.releaseDate ? -1 : 1;
        });
    }

    cardResults.data = Array.from(cardDataByName.values()).flat();

    return cardResults;
}