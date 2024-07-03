import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Card, CardResults } from "./types/Card";
import CardDisplayFrame from "./components/CardDisplayFrame/CardDisplayFrame";
import "./assets/styles/styles.css"
import { SetNamesByLegality } from "./types/Set";
import { fetchCurrentSetFromLocalStorage, fetchSetData, getSetNamesByLegality, updateLatestSetLocal } from "./services/SetService";
import { getPagesOfCards } from "./services/CardService";

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

        setStatus("Finished Syncing");
        setTimeout(() => {
            setStatus("");
        }, 4000);
    }

    const checkForNewSets = async () => {
        setStatus("Checking for new Set Data");

        const currentSet = await fetchCurrentSetFromLocalStorage();
        const standardSets = await fetchSetData();
        const latestSet = standardSets.at(-1)?.name;

        if (latestSet !== currentSet) {
            await updateLatestSetLocal(standardSets);
        }
        setStatus("");
    }

    const [syncing, setSyncing] = useState(false);
    const resyncCardNames = async () => {
        if (syncing) {
            return;
        }
        setSyncing(true);

        setStatus("Syncing card name data");
        const cardSets = await fetchSetData();
        const setNamesByLegality = getSetNamesByLegality(cardSets);
        setSetNames(setNamesByLegality);
        const latestSet = await updateLatestSetLocal(cardSets);

        const totalCards = cardSets
            .filter(s => {
                return setNamesByLegality.standard.includes(s.name);
            })
            .map(d => {
                return d.total;
            })
            .reduce((a, b) => a + b, 0);
        const totalPages = Math.ceil(totalCards / 250);

        setStatus("Fetching new set " + latestSet.name);
        await getAllCardNames(totalPages);
        setSyncing(false);
    }

    const showFetchStatus = () => {
        if (status && status.length > 0) {
            return (
                <div className="statusBar">
                    <p>
                        {status}...
                        {pagesLoaded.totalPages > 0 ? `${pagesLoaded.loaded} / ${pagesLoaded.totalPages}` : ""}
                    </p>
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
