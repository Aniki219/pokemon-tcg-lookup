import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Card, CardResults } from "./interfaces/Card";
import CardDisplay from "./components/CardDisplay";
import process from "process";
import { render } from "react-dom";
import CardDisplayFrame from "./components/CardDisplayFrame";

const Popup = () => {
    const [cardNames, setCardNames] = useState<string[]>([])

    const [check, setCheck] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(["cardNames"], (data) => {
            const { cardNames } = data;
            if (cardNames && cardNames.length > 0) {
                setCardNames(cardNames);
                checkForNewSet();
            } else {
                setFetchingReason("Initializing Card Data");
                resyncCardNames();
            }
        })
    }, []);

    const [fetchingAllCardNames, setFetchingAllCardNames] = useState(false);
    const [fetchPage, setFetchPage] = useState(1);
    const [pagesTotal, setPagesTotal] = useState(20);

    const getAllStandardCardNames = async (totalPages: number) => {
        setFetchingAllCardNames(true);

        const promises = (new Array(totalPages)).fill(0).map((_, i) => {
            return new Promise<CardResults>((resolve) => {
                const url = `https://api.pokemontcg.io/v2/cards?page=${i + 1}&q=legalities.standard:legal`;
                fetch(url, {
                    method: "GET",
                    headers: {
                        "X-Auth-Token": process.env.POKEMON_SECRET as string
                    }
                })
                    .then(resp => resp.json())
                    .then(function (res: CardResults) {
                        console.log("promise " + i + ": ", res);
                        return resolve(res);
                    });
            })
        })

        Promise.all<CardResults>(
            promises
        )
            .then((cardData: CardResults[]) => {
                console.log("promiseAll: ", cardData);
                const pagesData = cardData.map(page => {
                    if (page && page.data) {
                        return page.data;
                    }
                    return [] as Card[];
                }); //Card[][]
                const names = pagesData.flat().map(data => data.name);
                const uniqueNames = Array.from(new Set(names));
                const alphabetizedNames = uniqueNames.sort((a, b) => (a > b) ? 1 : -1)
                chrome.storage.local.set({ "cardNames": alphabetizedNames });
                setCardNames(alphabetizedNames);
                setFetchingAllCardNames(false);
            }
            );
    }
    const resyncCardNames = async () => fetchAllCardNames();
    const checkForNewSet = async () => fetchAllCardNames(true);

    const fetchAllCardNames = async (onlyIfNewSetExists = false) => {
        chrome.storage.local.get(["currentSet"], async (set) => {
            const { currentSet } = set;
            const url = `https://api.pokemontcg.io/v2/sets?q=legalities.standard:legal`;
            fetch(url, {
                method: "GET",
                headers: {
                    "X-Auth-Token": process.env.POKEMON_SECRET as string
                }
            })
                .then(resp => resp.json())
                .then(function (setsData: { data: { name: string, total: number }[] }) {
                    const latestSet = setsData.data.at(-1)?.name as string;
                    console.log("current set: " + currentSet, "latest set: " + latestSet);
                    const totalCards = setsData.data
                        .map(d => d.total)
                        .reduce((a, b) => a + b, 0);
                    const totalPages = Math.ceil(totalCards / 250);
                    if (currentSet !== latestSet || !onlyIfNewSetExists) {
                        chrome.storage.local.set({ "currentSet": latestSet });
                        if (currentSet !== latestSet) {
                            setFetchingReason("Fetching new set " + latestSet);
                        } else {
                            setFetchingReason("Resyncing card names up to set: " + latestSet);
                        }
                        getAllStandardCardNames(totalPages);
                    }
                });
        });
    }

    const [fetchingReason, setFetchingReason] = useState("Initializing Card Data");

    const showFetchStatus = () => {
        if (fetchingAllCardNames) {
            return (
                <p>{fetchingReason}...</p>
            )
        }
    }

    if (!cardNames || cardNames.length === 0) {
        return <>
            <p>Fetching Card Names...</p>
        </>
    } else {
        return (
            <div style={{ minHeight: "200px" }}>
                {showFetchStatus()}
                <CardDisplayFrame cardNames={cardNames} resync={resyncCardNames}></CardDisplayFrame>
            </div>
        )
    }
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);
