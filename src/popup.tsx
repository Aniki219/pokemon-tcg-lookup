import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Card, CardResults } from "./types/Card";
import CardDisplayFrame from "./components/CardDisplayFrame/CardDisplayFrame";
import "./assets/styles/styles.css"
import { SetNamesByLegality } from "./types/Set";
import { fetchCurrentSetFromLocalStorage, fetchSetData, getSetNamesByLegality, updateLatestSetLocal } from "./services/SetService";
import { getPagesOfCards } from "./services/CardService";
import StatusBar from "./components/StatusBar";

const Popup = () => {
    const [cardNames, setCardNames] = useState<string[]>([]);
    const [setNames, setSetNames] = useState<SetNamesByLegality>({ standard: [], unlimited: [] });
    const [status, setStatus] = useState<string>("");

    useEffect(() => {
        chrome.storage.local.get("cardNames", (data) => {
            const { cardNames } = data;
            if (cardNames && cardNames.length > 0) {
                setCardNames(cardNames);
                checkForNewSets();
            } else {
                resyncCardNames();
            }
        })
    }, []);

    const [pagesLoaded, setPagesLoaded] =
        useState<PagesLoaded>({ loaded: 0, totalPages: 0 });

    const getAllCardNames = async (totalPages: number) => {
        const cardNameResults = await getPagesOfCards(totalPages, setPagesLoaded);

        await chrome.storage.local.set({ "cardNames": cardNameResults });
        setCardNames(cardNameResults);
    }

    const checkForNewSets = async () => {
        setStatus("Checking for new Set Data");

        const currentSet = await fetchCurrentSetFromLocalStorage();
        const unlimitedSets = await fetchSetData();
        const setNamesByLegality = getSetNamesByLegality(unlimitedSets);
        setSetNames(setNamesByLegality);
        const latestSet = unlimitedSets.at(-1)?.name;

        if (latestSet !== currentSet) {
            setStatus("Syncing with new Set Data");
            await updateLatestSetLocal(unlimitedSets);
        }

        const standardSets = unlimitedSets
            .filter(s => {
                return setNamesByLegality.standard.includes(s.name);
            });

        setStatus("");
        return { standardSets, unlimitedSets, latestSet }
    }

    const [syncing, setSyncing] = useState(false);
    const resyncCardNames = async () => {
        if (syncing) {
            return;
        }
        setSyncing(true);

        const { standardSets, latestSet } = await checkForNewSets();

        const totalCards = standardSets
            .map(d => {
                return d.total;
            })
            .reduce((a, b) => a + b, 0);
        const totalPages = Math.ceil(totalCards / 250);

        setStatus("Fetching autofill card names up to set: " + latestSet);
        await getAllCardNames(totalPages);
        setSyncing(false);

        setStatus("Finished Syncing");
        setTimeout(() => {
            setStatus("");
        }, 4000);
    }

    return (
        <div style={{ minHeight: "444px" }}>
            <CardDisplayFrame
                cardNames={cardNames}
                setNames={setNames}
                resync={{ syncing, method: resyncCardNames }}
                setStatus={setStatus} />
            <StatusBar status={status} pagesLoaded={pagesLoaded} />
        </div>
    )
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);
