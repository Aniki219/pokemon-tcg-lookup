import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Card, CardResults } from "./interfaces/Card";
import CardDisplay from "./components/CardDisplay";
import process from "process";
import { render } from "react-dom";
import CardDisplayFrame from "./components/CardDisplayFrame";

const Popup = () => {
    const [cardNames, setCardNames] = useState<string[]>([])

    useEffect(() => {
        chrome.storage.local.get(["cardNames"], (data) => {
            const { cardNames } = data;
            if (cardNames && cardNames.length > 0) {
                setCardNames(cardNames as string[]);
            } else {
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
                console.log(concatonedNames);
                chrome.storage.local.set({ "cardNames": concatonedNames });
                setCardNames(concatonedNames);
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

    const showFetchButton = () => {
        if (fetchingAllCardNames) {
            return (
                <p>Fetching pages: {fetchPage} / {pagesTotal}</p>
            )
        } else {
            return (
                <button onClick={() => getAllStandardCardNames([], 1)}>Sync Card Names</button>
            )
        }
    }

    if (!cardNames || cardNames.length === 0) {
        return <>
            <p>Fetching Card Names...</p>
        </>
    } else {
        return (
            <>
                {showFetchButton()}
                <CardDisplayFrame cardNames={cardNames}></CardDisplayFrame>
            </>
        )
    }
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);
