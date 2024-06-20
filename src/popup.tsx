import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Card, CardResults } from "./interfaces/Card";
import CardDisplay from "./components/CardDisplay";
import process from "process";
import { render } from "react-dom";
import CardDisplayFrame from "./components/CardDisplayFrame";

const Popup = () => {
    const [cardNames, setCardNames] = useState<string[]>()

    useEffect(() => {
        const cachedCardNames = chrome.storage.sync.get(["cardNames"], (data) => {
            setCardNames(data as string[]);
        });
        getCardNames();
    }, []);

    const getCardNames = async () => {
        const url = `https://api.pokemontcg.io/v2/cards?q=legalities.standard:legal`;
        fetch(url, {
            method: "GET",
            headers: {
                "X-Auth-Token": process.env.POKEMON_SECRET as string
            }
        })
            .then(resp => resp.json())
            .then(function (cardData: CardResults) {
                const names = cardData.data.map(card => card.name);
                console.log(names);
                chrome.storage.sync.set({ "cardNames": names });
                setCardNames(names);
            });
    }

    if (!cardNames) {
        return <>
            <p>Fetching Card Names...</p>
        </>
    } else {
        return (
            <>
                <CardDisplayFrame></CardDisplayFrame>
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
