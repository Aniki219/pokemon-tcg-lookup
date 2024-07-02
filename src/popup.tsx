import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Card, CardResults } from "./types/Card";
import CardDisplay from "./components/CardDisplayFrame/CardDisplay/CardDisplay";
import process from "process";
import { render } from "react-dom";
import CardDisplayFrame from "./components/CardDisplayFrame/CardDisplayFrame";
import "./assets/styles/styles.css"
import { CardSet } from "./types/Set";

const Popup = () => {
    const [cardNames, setCardNames] = useState<string[]>([]);
    const [setNames, setSetNames] = useState<{ legal: string[], all: string[] }>({ legal: [], all: [] });
    const [fetchingReason, setFetchingReason] = useState("Initializing Card Data");
    const [status, setStatus] = useState<string>();

    useEffect(() => {
        chrome.storage.local.get("cardNames", (data) => {
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
    const [pagesLoaded, setPagesLoaded] =
        useState<{ loaded: number, totalPages: number }>({ loaded: 0, totalPages: 0 });

    const getAllCardNames = async (totalPages: number) => {
        setFetchingAllCardNames(true);
        var loaded = 0;
        setPagesLoaded({ loaded: 0, totalPages });

        const promises = (new Array(totalPages)).fill(0).map((_, i) => {
            return new Promise<CardResults>((resolve) => {
                const url = `https://api.pokemontcg.io/v2/cards?page=${i + 1}&q=legalities.standard:legal`;
                fetch(url)
                    .then(resp => resp.json())
                    .then(function (res: CardResults) {
                        loaded++;
                        setPagesLoaded({ loaded, totalPages });
                        return resolve(res);
                    });
            })
        })

        await Promise.all<CardResults>(
            promises
        )
            .then((cardData: CardResults[]) => {
                const pagesData = cardData.map(page => {
                    if (page && page.data) {
                        return page.data;
                    }
                    return [] as Card[];
                }); //Card[][]

                const names = pagesData.flat().map(data => data.name);
                const uniqueNames = Array.from(new Set(names));
                const alphabetizedNames = uniqueNames.sort((a, b) => (a > b) ? 1 : -1);

                chrome.storage.local.set({ "cardNames": alphabetizedNames });
                setCardNames(alphabetizedNames);

                setFetchingAllCardNames(false);
                setStatus("Finished Syncing");
                setTimeout(() => {
                    setStatus("");
                }, 4000);
            });
    }

    const checkForNewSet = async () => {
        setStatus("Checking for new Set Data");

        const currentSet = await fetchCurrentSetFromLocalStorage();
        const standardSets = await fetchSetData();
        const latestSet = standardSets.at(-1)?.name;

        if (currentSet !== latestSet) {
            updateToLatestSet(standardSets);
        } else {
            setStatus("");
        }
    }

    const fetchSetData = async (): Promise<CardSet[]> => {
        const url = `https://api.pokemontcg.io/v2/sets`;
        return await fetch(url)
            .then(res => res.json())
            .then((setsData: { data: CardSet[] }) => {
                const all = setsData.data.map(d => {
                    return d.name;
                });

                const legalSetsData = setsData.data
                    .filter(set => {
                        return set.legalities.standard
                    });

                const legalNames = legalSetsData.map(d => {
                    return d.name;
                });

                setSetNames({ legal: legalNames, all });
                return setsData.data;
            })
    }

    const [syncing, setSyncing] = useState(false);
    const resyncCardNames = async () => {
        if (syncing) {
            return;
        }
        setSyncing(true);
        setStatus("Resyncing card name data...");
        const standardSets = await fetchSetData();
        await updateToLatestSet(standardSets);
        setSyncing(false);
    }

    const fetchCurrentSetFromLocalStorage = async (): Promise<string | undefined> => {
        const currentSet = await chrome.storage.local.get("currentSet");
        return currentSet.currentSet as string | undefined;
    }

    const updateToLatestSet = async (setsData: CardSet[]) => {
        const latestSet = setsData.at(-1)?.name as string;
        const totalCards = setsData
            .map(d => d.total)
            .reduce((a, b) => a + b, 0);
        const totalPages = Math.ceil(totalCards / 250);

        setFetchingReason("Fetching new set " + latestSet);
        chrome.storage.local.set({ "currentSet": latestSet }); //TODO: move?

        return await getAllCardNames(totalPages);
    }


    const showFetchStatus = () => {
        if (fetchingAllCardNames) {
            return (
                <div className="statusBar">
                    <p>
                        {fetchingReason}
                        {pagesLoaded.totalPages > 0 ? `... ${Math.floor(100 * pagesLoaded.loaded / pagesLoaded.totalPages)}%` : "..."}
                    </p>
                </div>
            )
        }
        if (status && status.length > 0) {
            return (
                <div className="statusBar">
                    <p className="fadeOut">{status}</p>
                </div>
            )
        }
    }

    return (
        <div style={{ minHeight: "444px" }}>
            <CardDisplayFrame
                cardNames={cardNames}
                setNames={setNames}
                resync={{ syncing, method: resyncCardNames }} />
            {showFetchStatus()}
        </div>
    )
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);
