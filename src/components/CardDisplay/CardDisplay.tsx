import React, { useEffect } from "react"
import { Card } from "../../interfaces/Card"
import "../styles/CardDisplay.css"
import { getColorByType, getIconByType, isPokeType } from "../../data"
import { getTypeIcon, getTypeIconLarge } from "../TypeIcon"
import Header, { HeaderParams } from "./Header"
import CardText from "./CardText"
import Footer from "./Footer"

export default function CardDisplay({ card, incrementCardIndex }: { card: Card | undefined, incrementCardIndex: (inc: number) => void }) {
    //Change background color to match card type
    useEffect(() => {
        if (card?.types) {
            const type = card.types[0];
            document.body.style.setProperty("background-color", getColorByType(type) || "white");
        } else {
            document.body.style.setProperty("background-color", "white");
        }
    }, [card]);

    if (!card) {
        return (
            <div style={{ display: "flex" }}>
                <div className="cardImage" >
                    <img src="/cardBack.png" />
                </div>
                <div className="cardInfo">
                    <div className="noCardText">
                        <p>Enter a Card name in the Search bar above to begin.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ display: "flex" }}>
            <div className="cardImage" >
                <img src={card.images.small} />
            </div>
            <div className="cardInfo">
                <Header
                    name={card.name}
                    hp={card.hp}
                    cardTypes={card.types}
                    superType={card.supertype} />
                <CardText
                    abilities={card.abilities}
                    attacks={card.attacks}
                    rules={card.rules}
                    subtypes={card.subtypes} />
                <Footer
                    card={card} />
            </div>
        </div>
    )
}