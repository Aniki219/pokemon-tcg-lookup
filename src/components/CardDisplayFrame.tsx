import React, { useEffect, useState } from "react";
import CardDisplay from "./CardDisplay/CardDisplay";
import { Card, CardResults } from "../interfaces/Card";
import process from "process";
import "./styles/CardDisplayFrame.css"
import SearchOptions from "./SearchOptions";
import { pokeTypes, subtypes } from "../data";
import SearchForm from "./SearchForm";

interface ICardDisplayFrameProps {
    cardNames: string[],
    setNames: { legal: string[], all: string[] }
    resync: { syncing: boolean, method: () => Promise<void> }
}

export interface SearchParams {
    searchBy: string,
    searchText: string,
    standard: boolean,
    exact: boolean,
    set: string
}

export default function CardDisplayFrame(props: React.PropsWithChildren<ICardDisplayFrameProps>) {
    const [cardData, setCardData] = useState<CardResults>();
    const [cardIndex, setCardIndex] = useState(0);
    const [currentCard, setCurrentCard] = useState<Card>();

    const { cardNames } = props;

    const [searchParams, setSearchParams] = useState<SearchParams>(
        { searchText: "", searchBy: "name", exact: false, standard: true, set: "Any" });

    const getSearchParams = () => {
        return searchParams;
    }

    const getCardData = async () => {
        const legalities = searchParams.standard ? "legalities.standard:legal" : "";
        const { searchText, searchBy } = searchParams;
        const set = searchParams.set === "Any" ? "" : `set.name:"${searchParams.set}"`;
        const exact = searchParams.exact ? "" : "*"

        const url = `https://api.pokemontcg.io/v2/cards?q=${legalities} ${set} ${searchBy}:"${exact}${searchText}${exact}"`;

        return await fetch(url, {
            method: "GET",
            headers: {
                "X-Auth-Token": process.env.POKEMON_SECRET as string
            }
        })
            .then(resp => resp.json())
            .then(function (cardResults: CardResults) {
                const cardDataByName = new Map<string, Card[]>();
                const cards = cardResults.data;

                cards.forEach(card => {
                    const name = card.name;
                    if (!cardDataByName.has(name)) {
                        cardDataByName.set(name, []);
                    }
                    cardDataByName.get(name)?.push(card);
                });

                const sortedNames = Array.from(cardDataByName.keys()).sort((a, b) => {
                    return a.length > b.length ? 1 : -1;
                })

                for (const name of sortedNames) {
                    const cardsArray = cardDataByName.get(name);
                    if (!cardsArray) continue;
                    cardsArray.sort((a, b) => {
                        return a.set.releaseDate > b.set.releaseDate ? -1 : 1;
                    });
                }

                cardResults.data = Array.from(cardDataByName.values()).flat();

                setCardData(cardResults);
                setCardIndex(0);
                setCurrentCard(cardResults.data[0]);
            });
    }

    const incrementCardIndex = (inc: number): void => {
        if (!cardData) {
            setCardIndex(0);
            return;
        }

        const index = ((cardIndex + inc) + cardData.count) % cardData.count;
        setCardIndex(index);
        setCurrentCard(cardData.data[index]);
    }

    const showNavbar = () => {
        if (!cardData) {
            return (
                <span className="navbar"></span>
            )
        }

        if (cardData.data.length === 0) {
            return (
                <span className="navbar">
                    <p>No card data found!</p>
                </span>
            )
        }

        return (
            <span className="navbar">
                <button onClick={() => { incrementCardIndex(-1) }}>🠜</button>
                <span style={{ marginLeft: "10px", marginRight: "10px" }}>
                    {cardIndex + 1} / {cardData.count}
                </span>
                <button onClick={() => { incrementCardIndex(1) }}>🠞</button>
            </span>
        )
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
                    resync={props.resync} />
                <SearchOptions
                    setNames={props.setNames}
                    setSearchParams={setSearchParams}
                    getSearchParams={getSearchParams} />
                {showNavbar()}
            </div>
            <CardDisplay card={currentCard} incrementCardIndex={incrementCardIndex}></CardDisplay>
        </div>
    );
}