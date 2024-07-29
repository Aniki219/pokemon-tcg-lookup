import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import CardDisplayFrame from "@components/CardDisplayFrame";
import "@styles/styles.css"
import { CardSet, SetNamesByLegality } from "@models/Set";
import { fetchCurrentSetFromLocalStorage, fetchSetData, getSetNamesByLegality, updateLatestSetLocal } from "@services/SetService";
import { getCardResultsPages } from "@services/CardService";
import StatusBar from "@components/StatusBar";
import { useMap } from "usehooks-ts";
import { createHash } from "./utils/helpers";

const Popup = () => {
    const [cardNames, setCardNames] = useState<string[]>([]);
    const [setNames, setSetNames] = useState<SetNamesByLegality>({ standard: [], unlimited: [] });

    const [status, statusActions] = useMap<string, string>();
    const DEFAULT_STATUS_TIME = 2500;

    //TODO: Maybe custom hook helps here?
    useEffect(() => {
        chrome.storage.local.get("cardNames", async (data) => {
            const { cardNames } = data;
            if (cardNames && cardNames.length > 0) {
                setCardNames(cardNames);
            }
            const { newSet, standardSets, unlimitedSets } = await checkForNewSets();
            if (newSet) {
                getAllCardNames(standardSets)
            }
        })
    }, []);

    const setStatus = (text: string, time?: number, idOverload?: string) => {
        const statusId = idOverload || createHash(text);
        statusActions.set(statusId, text);

        if (time) {
            removeStatus(statusId, time);
        }

        return statusId;
    }

    const removeStatus = async (id: string, time?: number) => {
        if (time) {
            await new Promise(resolve => setTimeout(resolve, time));
        }
        statusActions.remove(id);
    }

    const [pagesLoaded, setPagesLoaded] =
        useState<PagesLoaded>({ loaded: 0, totalPages: 0 });

    const getAllCardNames = async (sets: CardSet[]) => {
        const latestSet = sets.at(-1);

        const totalCards = sets
            .map(d => {
                return d.total;
            })
            .reduce((a, b) => a + b, 0);
        const totalPages = Math.ceil(totalCards / 250);

        const searchParams = {
            standard: true,
            page: 1,
            totalPages,
            searchBy: "name",
            searchText: "",
            exact: false,
            set: "Any"
        }

        const handlePageLoad = (loaded: number) => {
            setPagesLoaded({ loaded, totalPages });
        }

        const fetchingStatus = setStatus("Fetching autofill card names up to set: " + latestSet?.name, undefined, "Autofill");
        const cardNameResults = await getCardResultsPages(searchParams, handlePageLoad);
        removeStatus(fetchingStatus);

        await chrome.storage.local.set({ "cardNames": cardNameResults });
        setCardNames(cardNameResults);

        setStatus("Finished Syncing", DEFAULT_STATUS_TIME);
    }

    const checkForNewSets = async () => {
        const newSetData = setStatus("Checking for new Set Data");

        const currentSet = await fetchCurrentSetFromLocalStorage();
        const unlimitedSets = await fetchSetData();

        removeStatus(newSetData);

        const latestSet = unlimitedSets.at(-1)?.name;
        const newSet = latestSet !== currentSet?.name;

        if (newSet) {
            const syncingSetData = setStatus("Syncing new Set Data");
            await updateLatestSetLocal(unlimitedSets);
            removeStatus(syncingSetData);
        }

        const setNamesByLegality = getSetNamesByLegality(unlimitedSets);
        setSetNames(setNamesByLegality);

        const standardSets = unlimitedSets
            .filter(s => {
                return setNamesByLegality.standard.includes(s.name);
            });

        setStatus("Set Data up to Date!", DEFAULT_STATUS_TIME);

        return { standardSets, unlimitedSets, latestSet, newSet }
    }

    const [syncing, setSyncing] = useState(false);
    const resyncCardNames = async () => {
        if (syncing) {
            return;
        }
        setSyncing(true);

        const { standardSets } = await checkForNewSets();
        await getAllCardNames(standardSets);

        setSyncing(false);
    }

    return (
        <div style={{ minHeight: "444px" }}>
            <CardDisplayFrame
                cardNames={cardNames}
                setNames={setNames}
                resync={{ syncing, method: resyncCardNames }}
                setStatus={setStatus}
                removeStatus={removeStatus} />
            <StatusBar statusMap={status} pagesLoaded={pagesLoaded} />
        </div>
    )
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);
