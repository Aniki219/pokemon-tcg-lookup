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
                getAllStandardCardNames([], 1);
            }
        })
    }, []);

    const [fetchingAllCardNames, setFetchingAllCardNames] = useState(false);
    const [fetchPage, setFetchPage] = useState(1);
    const [pagesTotal, setPagesTotal] = useState(20);

    const getAllStandardCardNames = async (cardNames: string[], page: number) => {
        setFetchingAllCardNames(true);
        new Promise<CardResults>((resolve) => {
            const url = `https://api.pokemontcg.io/v2/cards?page=${page}&q=legalities.standard:legal`;
            fetch(url, {
                method: "GET",
                headers: {
                    "X-Auth-Token": process.env.POKEMON_SECRET as string
                }
            })
                .then(resp => resp.json())
                .then(function (cardData: CardResults) {
                    return resolve(cardData);
                });
        }).then((cardData: CardResults) => {
            const pageNames = cardData.data.map(card => card.name);
            const { page, pageSize, totalCount } = cardData;
            const concatonedNames = cardNames.concat(pageNames);
            if (page * pageSize >= totalCount) {
                const uniqueNames = Array.from(new Set(concatonedNames));
                const alphabetizedNames = uniqueNames.sort((a, b) => (a > b) ? 1 : -1)
                console.log(alphabetizedNames);
                chrome.storage.local.set({ "cardNames": alphabetizedNames });
                setCardNames(alphabetizedNames);
                setFetchingAllCardNames(false);
                setFetchPage(1);
                setPagesTotal(1);
            } else {
                console.log("Got page: " + page);
                setFetchPage(page + 1);
                setPagesTotal(Math.ceil(totalCount / pageSize));
                getAllStandardCardNames(concatonedNames, page + 1);
            }
        });
    }

    const checkForNewSet = async () => {
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
                .then(function (setsData: { data: { name: string }[] }) {
                    const latestSet = setsData.data.at(-1)?.name as string;
                    console.log("current set: " + currentSet, "latest set: " + latestSet);
                    if (currentSet !== latestSet) {
                        chrome.storage.local.set({ "currentSet": latestSet });
                        chrome.storage.local.get(["currentSet"], (data) => {
                            console.log("data: " + data)
                        });
                        setFetchingReason("Fetching new Set " + latestSet);
                        getAllStandardCardNames([], 1);
                    }
                });
        });
    }

    const [fetchingReason, setFetchingReason] = useState("Initializing Card Data");

    const showFetchStatus = () => {
        if (fetchingAllCardNames) {
            return (
                <p>{fetchingReason}: {fetchPage} / {pagesTotal}</p>
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
                <CardDisplayFrame cardNames={cardNames}></CardDisplayFrame>
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
