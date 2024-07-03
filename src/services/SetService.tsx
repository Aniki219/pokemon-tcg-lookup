import { CardSet, SetNamesByLegality } from "types/Set";

export const fetchSetData = async (): Promise<CardSet[]> => {
    const url = `https://api.pokemontcg.io/v2/sets`;
    return await fetch(url)
        .then(res => res.json())
        .then((setsData: { data: CardSet[] }) => {
            if (setsData?.data) {
                return setsData.data;
            }
            throw new Error("No Set Data Found!");
        }).catch((e) => {
            throw new Error(e);
        })
}

export const fetchCurrentSetFromLocalStorage = async (): Promise<string | undefined> => {
    const data = await chrome.storage.local.get("currentSet");
    return data.currentSet as string | undefined; //TODO: or ""
}

export const updateLatestSetLocal = async (setsData: CardSet[]): Promise<CardSet> => {
    const latestSet = setsData.at(-1);
    await chrome.storage.local.set({ "currentSet": latestSet });

    if (latestSet) {
        return latestSet;
    } else {
        throw new Error("No Set Data Found!");
    }
}

export const getSetNamesByLegality = (setsData: CardSet[]): SetNamesByLegality => {
    const unlimited = setsData.map(d => {
        return d.name;
    });

    const standardSetsData = setsData
        .filter(set => {
            return set.legalities.standard
        });

    const standard = standardSetsData.map(d => {
        return d.name;
    });

    return { standard, unlimited }
}