import React, { useEffect, useState } from "react";
import { Card, CardResults } from "../../types/Card";

interface NavbarProps {
    cardData: CardResults | undefined,
    setCurrentCard: (card: Card) => void,
}

export default function Navbar({ cardData, setCurrentCard }: NavbarProps) {
    const [cardIndex, setCardIndex] = useState(0);

    useEffect(() => {
        setCardIndex(0);
    }, [cardData])

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

    return showNavbar();
}