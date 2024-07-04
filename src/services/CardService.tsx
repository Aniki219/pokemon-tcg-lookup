import { SearchParams } from "components/CardDisplayFrame/CardDisplayFrame";
import { Card, CardResults } from "@/models/Card";
import process from "process";

export const getPagesOfCards = async (totalPages: number, setPagesLoaded: (pagesLoaded: PagesLoaded) => void) => {
    var loaded = 0;
    setPagesLoaded({ loaded: 0, totalPages });

    const promises = (new Array(totalPages)).fill(0).map((_, i) => {
        return new Promise<CardResults>((resolve) => {
            const url = `https://api.pokemontcg.io/v2/cards?page=${i + 1}&q=legalities.standard:legal`;
            fetch(url, {
                method: "GET",
                headers: {
                    "X-Api-Key": process.env.POKEMON_SECRET as string
                }
            })
                .then(resp => resp.json())
                .then(function (res: CardResults) {
                    loaded++;
                    setPagesLoaded({ loaded, totalPages });
                    return resolve(res);
                });
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
    const legalities = searchParams.standard ? "legalities.standard:legal" : "";
    const { searchText, searchBy } = searchParams;
    const set = searchParams.set === "Any" ? "" : `set.name:"${searchParams.set}"`;
    const exact = searchParams.exact ? "" : "*"

    const url = `https://api.pokemontcg.io/v2/cards?q=${legalities} ${set} ${searchBy}:"${searchText}${exact}"`;

    return await fetch(url, {
        method: "GET",
        headers: {
            "X-Api-Key": process.env.POKEMON_SECRET as string
        }
    })
        .then(resp => resp.json())
        .then(function (cardResults: CardResults) {
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
        });
}