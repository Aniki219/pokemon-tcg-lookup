import React, { useState } from "react";
import { SearchParams } from "@utils/helpers";
import { pokeTypes, subtypes } from "@/assets/data";
import rollerImage from "@images/loading/roller.gif";
import optionsImage from "@images/icons/optionsGear.png";

interface SearchFormProps {
    searchBarVisible: boolean,
    setSearchBarVisible: (visible: boolean) => void,
    setSearchParams: (params: SearchParams) => void,
    getSearchParams: () => SearchParams,
    getCardData: () => void,
    resync: { syncing: boolean, method: () => Promise<void> },
    cardNames: string[],
    setStatus: (status: string, time?: number) => string,
    removeStatus: (id: string) => void
}

export default function SearchForm({
    getSearchParams,
    setSearchParams,
    getCardData,
    resync,
    cardNames,
    setStatus,
    removeStatus,
    setSearchBarVisible,
    searchBarVisible
}: SearchFormProps) {
    const [searching, setSearching] = useState(false);
    const handleSubmit = async (event: React.FormEvent<EventTarget | HTMLFormElement>) => {
        event.preventDefault();

        if (searching) {
            return;
        }
        setSearching(true);

        const { searchText, searchBy, set, standard, exact } = getSearchParams()
        const statusMessage = `Searching ${searchBy}: ${searchText} ${set !== "Any" ? ` in set: ${set}` : ``} (${standard ? `Standard` : `Unlimited`})`

        const searchingStatus = setStatus(statusMessage);
        await getCardData();
        removeStatus(searchingStatus);

        setSearching(false);
    }

    const getAutofillDatalist = () => {
        const searchParams = getSearchParams();

        const getAutofillNames = () => {
            if (searchParams.searchBy === "name" && searchParams.standard) {
                return cardNames;
            }
            if (searchParams.searchBy === "types") {
                return pokeTypes;
            }
            if (searchParams.searchBy === "subtypes") {
                return subtypes;
            }
            return [];
        }

        const names = getAutofillNames();
        return (
            <datalist id="cardName">
                {
                    names.map((name, i) => {
                        return <option key={i} value={name} />
                    })
                }
            </datalist>
        )
    }

    return (
        <div>
            <form onSubmit={(e) => { handleSubmit(e) }}>
                <select
                    id="searchBy"
                    onChange={(e) => {
                        setSearchParams({ ...getSearchParams(), searchBy: e.target.value });
                    }}>
                    <option value="name">Name</option>
                    <option value="types">Type</option>
                    <option value="subtypes">Subtype</option>
                </select>
                <input
                    list="cardName"
                    autoFocus={true}
                    type="text"
                    value={getSearchParams().searchText}
                    onChange={(e) => setSearchParams({ ...getSearchParams(), searchText: e.target.value })}
                />
                {getAutofillDatalist()}
                <input type="submit" className="search" value="Search" disabled={searching} />
                <button onClick={(e) => { e.preventDefault(); resync.method(); }}
                    title="Re-Fetch card names data."
                    className="resyncButton"
                    aria-disabled={resync.syncing}>
                    {!resync.syncing ? "⟳" : <img src={rollerImage} style={{ width: "20px" }}></img>}
                </button>
                <button onClick={(e) => { e.preventDefault(); setSearchBarVisible(!searchBarVisible); }}
                    title="Toggle Options"
                    className="optionsButton">
                    <img src={optionsImage} />
                </button>
            </form>
        </div >

    )
} 