import React, { useState } from "react";
import CardDisplay from "./CardDisplay/CardDisplay";
import { Card, CardResults } from "../../types/Card";
import "../../assets/styles/CardDisplayFrame.css"
import SearchOptions from "./SearchOptions";
import SearchForm from "./SearchForm";
import Navbar from "./Navbar";
import { SetNamesByLegality } from "types/Set";
import { getCards } from "../../services/CardService";

interface ICardDisplayFrameProps {
    cardNames: string[],
    setNames: SetNamesByLegality,
    resync: { syncing: boolean, method: () => Promise<void> }
}

export interface SearchParams {
    searchBy: string,
    searchText: string,
    standard: boolean,
    exact: boolean,
    set: string
}

export default function CardDisplayFrame({ cardNames, setNames, resync }: ICardDisplayFrameProps) {
    const [cardData, setCardData] = useState<CardResults>();

    const [currentCard, setCurrentCard] = useState<Card>();

    const [searchParams, setSearchParams] = useState<SearchParams>(
        { searchText: "", searchBy: "name", exact: false, standard: true, set: "Any" });

    const getSearchParams = () => {
        return searchParams;
    }

    const getCardData = async () => {
        const cardResults = await getCards(searchParams);
        setCardData(cardResults);
        setCurrentCard(cardResults.data[0]);
    }

    return (
        <div>
            <div style={{ minWidth: "500px", textAlign: "center" }}>
                <h2 style={{ color: "white" }}>Nidoran TCG Lookup:</h2>
                <SearchForm
                    setSearchParams={setSearchParams}
                    getSearchParams={getSearchParams}
                    cardNames={cardNames}
                    getCardData={getCardData}
                    resync={resync} />
                <SearchOptions
                    setNames={setNames}
                    setSearchParams={setSearchParams}
                    getSearchParams={getSearchParams} />
                <Navbar
                    cardData={cardData}
                    setCurrentCard={setCurrentCard} />
            </div>
            <CardDisplay card={currentCard}></CardDisplay>
        </div>
    );
}