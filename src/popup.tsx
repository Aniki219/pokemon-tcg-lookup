import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Card, CardResults } from "./interfaces/Card";
import CardDisplay from "./components/CardDisplay";
import process from "process";
import { render } from "react-dom";
import CardDisplayFrame from "./components/CardDisplayFrame";
import "./styles.css"

const Popup = () => {
    const [cardNames, setCardNames] = useState<string[]>([])

    const [check, setCheck] = useState(false);
    const [apiKey, setAPIKey] = useState<string>()

    useEffect(() => {
        chrome.storage.sync.get(
            "apiKey",
            (data) => {
                setAPIKey(data.apiKey);
            }
        );
    }, []);

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
    }, [apiKey]);

    const [fetchingAllCardNames, setFetchingAllCardNames] = useState(false);
    const [pagesLoaded, setPagesLoaded] =
        useState<{ loaded: number, totalPages: number }>({ loaded: 0, totalPages: 0 });

    const getAllStandardCardNames = async (totalPages: number) => {
        setFetchingAllCardNames(true);
        var loaded = 0;

        const promises = (new Array(totalPages)).fill(0).map((_, i) => {
            return new Promise<CardResults>((resolve) => {
                const url = `https://api.pokemontcg.io/v2/cards?page=${i + 1}&q=legalities.standard:legal`;
                fetch(url)
                    .then(resp => resp.json())
                    .then(function (res: CardResults) {
                        loaded++;
                        setPagesLoaded({ ...pagesLoaded, loaded });
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
                setStatus("Finished Syncing");
                setTimeout(() => {
                    setStatus("");
                }, 4000);
            });
    }
    const resyncCardNames = async () => fetchAllCardNames();
    const checkForNewSet = async () => fetchAllCardNames(true);

    const fetchAllCardNames = async (onlyIfNewSetExists = false) => {
        setStatus("Checking for latest set...");
        chrome.storage.local.get(["currentSet"], async (set) => {
            const { currentSet } = set;
            const url = `https://api.pokemontcg.io/v2/sets?q=legalities.standard:legal`;
            fetch(url)
                .then(resp => resp.json())
                .then(function (setsData: { data: { name: string, total: number }[] }) {
                    const latestSet = setsData.data.at(-1)?.name as string;
                    const totalCards = setsData.data
                        .map(d => d.total)
                        .reduce((a, b) => a + b, 0);
                    const totalPages = Math.ceil(totalCards / 250);
                    setPagesLoaded({ ...pagesLoaded, totalPages });
                    if (currentSet !== latestSet || !onlyIfNewSetExists) {
                        chrome.storage.local.set({ "currentSet": latestSet });
                        if (currentSet !== latestSet) {
                            setFetchingReason("Fetching new set " + latestSet);
                        } else {
                            setFetchingReason("Resyncing card names up to set: " + latestSet);
                        }
                        getAllStandardCardNames(totalPages);
                    } else {
                        setStatus("")
                    }
                });
        });
    }

    const [fetchingReason, setFetchingReason] = useState("Initializing Card Data");
    const [status, setStatus] = useState<string>();
    const [showStatusBar, setShowStatusBar] = useState(false);

    useEffect(() => {
        if (status && status.length > 0) {
            setShowStatusBar(true);
        } else {
            setShowStatusBar(false);
        }
    }, [status])

    const showFetchStatus = () => {
        if (fetchingAllCardNames) {
            return (
                <div className="statusBar">
                    <p>{fetchingReason} {pagesLoaded.totalPages > 0 ? `${pagesLoaded.loaded} / ${pagesLoaded.totalPages}` : ""}...</p>
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

    if (!cardNames || cardNames.length === 0) {
        return <>
            <p>Fetching Card Names...</p>
        </>
    } else {
        return (
            <div style={{ minHeight: "200px" }}>
                <CardDisplayFrame cardNames={cardNames} resync={resyncCardNames}></CardDisplayFrame>
                {showFetchStatus()}
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
