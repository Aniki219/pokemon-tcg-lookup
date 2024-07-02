import React, { useEffect } from "react"
import { Card } from "../../../types/Card"
import "../../../assets/styles/CardDisplay.css"
import { getColorByType, getIconByType, isPokeType } from "../../../assets/data"
import { getTypeIcon, getTypeIconLarge } from "../../TypeIcon"
import Header, { HeaderParams } from "./Header"
import CardText from "./CardText"
import Footer from "./Footer"

interface CardDisplayProps {
    card: Card | undefined
}

export default function CardDisplay({ card }: CardDisplayProps) {
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
                    superType={card.supertype}
                    evolvesFrom={card.evolvesFrom} />
                <CardText
                    abilities={card.abilities}
                    attacks={card.attacks}
                    rules={card.rules}
                    subtypes={card.subtypes}
                    weaknesses={card.weaknesses}
                    resistances={card.resistances}
                    retreatCost={card.retreatCost}
                    supertype={card.supertype} />
                <Footer
                    card={card} />
            </div>
        </div>
    )
}