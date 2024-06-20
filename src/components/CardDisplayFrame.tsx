import React, { useState } from "react";
import CardDisplay from "./CardDisplay";
import { Card, CardResults } from "../interfaces/Card";
import process from "process";

export default function CardDisplayFrame() {
    const [cardData, setCardData] = useState<CardResults>();
    const [cardIndex, setCardIndex] = useState(0);
    const [currentCard, setCurrentCard] = useState<Card>();

    const getCardData = async (name: string) => {
        const url = `https://api.pokemontcg.io/v2/cards?q=legalities.standard:legal name:${name}*`;
        fetch(url, {
            method: "GET",
            headers: {
                "X-Auth-Token": process.env.POKEMON_SECRET as string
            }
        })
            .then(resp => resp.json())
            .then(function (cardData: CardResults) {
                setCardData(cardData);
                setCardIndex(0);
                setCurrentCard(cardData.data[0]);
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

    const showIndex = () => {
        if (!cardData) return <></>
        return (
            <span>
                <button onClick={() => { incrementCardIndex(-1) }} style={{
                    background: "none",
                    border: "none",
                    fontSize: "16px"
                }}>🠜</button>
                <span style={{ marginLeft: "10px", marginRight: "10px" }}>
                    {cardIndex + 1} / {cardData.count}
                </span>
                <button onClick={() => { incrementCardIndex(1) }} style={{
                    background: "none",
                    border: "none",
                    fontSize: "16px"
                }}>🠞</button>
            </span>
        )
    }

    const [name, setName] = useState("");

    const handleSubmit = (event: React.FormEvent<EventTarget | HTMLFormElement>) => {
        event.preventDefault();
        getCardData(name)
    }

    return (
        <div>
            <div style={{ minWidth: "400px", textAlign: "center" }}>
                <h2>Pokemon TCG Lookup:</h2>
                <div>
                    <form onSubmit={(e) => { handleSubmit(e) }}>
                        <label>Enter your name:
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <input type="submit" />
                    </form>
                </div>
                {showIndex()}
            </div>
            <CardDisplay card={currentCard} incrementCardIndex={incrementCardIndex}></CardDisplay>
        </div>
    );
}