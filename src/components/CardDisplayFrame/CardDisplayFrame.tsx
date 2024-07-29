import React, { useState } from "react";
import CardDisplay from "@components/CardDisplay";
import { Card, CardResults } from "@/models/Card";
import "@styles/CardDisplayFrame.css"
import SearchOptions from "./SearchOptions";
import SearchForm from "./SearchForm";
import Navbar from "./Navbar";
import { SetNamesByLegality } from "@/models/Set";
import { getCards } from "@services/CardService";
import { SearchParams } from "@utils/helpers";

interface CardDisplayFrameProps {
    cardNames: string[],
    setNames: SetNamesByLegality,
    resync: { syncing: boolean, method: () => Promise<void> }
    setStatus: (status: string, time?: number) => string,
    removeStatus: (id: string) => void
}

export default function CardDisplayFrame({
    cardNames,
    setNames,
    resync,
    setStatus,
    removeStatus
}: CardDisplayFrameProps) {
    const [cardData, setCardData] = useState<CardResults>();
    const [currentCard, setCurrentCard] = useState<Card>();

    const [searchBarVisible, setSearchBarVisibile] = useState(false);

    const [searchParams, setSearchParams] = useState<SearchParams>(
        { searchText: "", searchBy: "name", exact: false, standard: true, set: "Any", page: 1, totalPages: 1 });

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
                    resync={resync}
                    setStatus={setStatus}
                    removeStatus={removeStatus}
                    setSearchBarVisible={setSearchBarVisibile}
                    searchBarVisible={searchBarVisible} />
                <SearchOptions
                    setNames={setNames}
                    setSearchParams={setSearchParams}
                    getSearchParams={getSearchParams}
                    visible={searchBarVisible} />
                <Navbar
                    cardData={cardData}
                    setCurrentCard={setCurrentCard} />
            </div>
            <CardDisplay card={currentCard}></CardDisplay>
        </div>
    );
}