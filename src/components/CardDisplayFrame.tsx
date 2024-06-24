import React, { useEffect, useState } from "react";
import CardDisplay from "./CardDisplay";
import { Card, CardResults } from "../interfaces/Card";
import process from "process";
import "./styles/CardDisplayFrame.css"

interface ICardDisplayFrameProps {
    cardNames: string[],
    resync: { syncing: boolean, method: () => Promise<void> }
}

export default function CardDisplayFrame(props: React.PropsWithChildren<ICardDisplayFrameProps>) {
    const [cardData, setCardData] = useState<CardResults>();
    const [cardIndex, setCardIndex] = useState(0);
    const [currentCard, setCurrentCard] = useState<Card>();

    const { cardNames } = props;

    const [searching, setSearching] = useState(false);

    const getCardData = async (name: string) => {
        const url = `https://api.pokemontcg.io/v2/cards?q=legalities.standard:legal name:"${name}*"`;
        return await fetch(url, {
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

    const [name, setName] = useState("");

    const handleSubmit = async (event: React.FormEvent<EventTarget | HTMLFormElement>) => {
        event.preventDefault();

        if (searching) {
            return;
        }
        setSearching(true);
        await getCardData(name);
        setSearching(false);
    }

    const getCardListOptions = () => {
        if (!cardNames) {
            return <></>
        }
        return (
            <datalist id="cardName">
                {
                    cardNames.map((cardName, i) => {
                        return <option key={i} value={cardName} />
                    })
                }
            </datalist>
        )
    }

    return (
        <div>
            <div style={{ minWidth: "500px", textAlign: "center" }}>
                <h2>Pokemon TCG Lookup:</h2>
                <div>
                    <form onSubmit={(e) => { handleSubmit(e) }}>
                        <label style={{ fontSize: "16px" }}>
                            Card Name:
                        </label>
                        <input
                            list="cardName"
                            autoFocus={true}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {getCardListOptions()}
                        <input type="submit" className="search" value="Search" disabled={searching} />
                        <button onClick={(e) => { e.preventDefault(); props.resync.method(); }}
                            title="Re-Fetch card names data."
                            className="resyncButton"
                            aria-disabled={props.resync.syncing}>
                            {!props.resync.syncing ? "⟳" : <img src="/icons/loading/roller.gif" style={{ width: "20px" }}></img>}
                        </button>

                    </form>
                </div>
                {showIndex()}
            </div>
            <CardDisplay card={currentCard} incrementCardIndex={incrementCardIndex}></CardDisplay>
        </div>
    );
}