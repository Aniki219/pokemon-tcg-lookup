import React, { useState } from "react";
import { SearchParams } from "./CardDisplayFrame";
import { pokeTypes, subtypes } from "../data";
import { CardResults } from "../interfaces/Card";

interface SearchFormProps {
    setSearchParams: (params: SearchParams) => void,
    getSearchParams: () => SearchParams,
    getCardData: () => void,
    resync: { syncing: boolean, method: () => Promise<void> },
    cardNames: string[]
}

export default function SearchForm(props: SearchFormProps) {
    const [searching, setSearching] = useState(false);
    const handleSubmit = async (event: React.FormEvent<EventTarget | HTMLFormElement>) => {
        event.preventDefault();

        if (searching) {
            return;
        }
        setSearching(true);
        await props.getCardData();
        setSearching(false);
    }

    const getAutofillDatalist = () => {
        const searchParams = props.getSearchParams();

        const getAutofillNames = () => {
            if (searchParams.searchBy === "name" && searchParams.standard) {
                return props.cardNames;
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
                        props.setSearchParams({ ...props.getSearchParams(), searchBy: e.target.value });
                    }}>
                    <option value="name">Name</option>
                    <option value="types">Type</option>
                    <option value="subtypes">Subtype</option>
                </select>
                <input
                    list="cardName"
                    autoFocus={true}
                    type="text"
                    value={props.getSearchParams().searchText}
                    onChange={(e) => props.setSearchParams({ ...props.getSearchParams(), searchText: e.target.value })}
                />
                {getAutofillDatalist()}
                <input type="submit" className="search" value="Search" disabled={searching} />
                <button onClick={(e) => { e.preventDefault(); props.resync.method(); }}
                    title="Re-Fetch card names data."
                    className="resyncButton"
                    aria-disabled={props.resync.syncing}>
                    {!props.resync.syncing ? "⟳" : <img src="/icons/loading/roller.gif" style={{ width: "20px" }}></img>}
                </button>
            </form>
        </div>
    )
} 