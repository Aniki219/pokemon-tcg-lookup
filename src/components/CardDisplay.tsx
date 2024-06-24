import React, { useEffect } from "react"
import { Card } from "../interfaces/Card"
import "./styles/CardDisplay.css"

export default function CardDisplay({ card, incrementCardIndex }: { card: Card | undefined, incrementCardIndex: (inc: number) => void }) {
    const attackCostIcons = (costArray: string[]) => {
        return (
            <div className="attackCost">
                {costArray.map((costName, i) =>
                    <img key={i} src={`/icons/${costName}.png`} style={{ width: "18px" }} />
                )}
            </div>
        )
    }

    const colorByType = new Map<string, string>([
        ["Darkness", "#5a4862"],
        ["Dragon", "#e0c28b"],
        ["Fairy", "#892752"],
        ["Fighting", "#e9a983"],
        ["Fire", "#ff8737"],
        ["Grass", "green"],
        ["Lightning", "#ffd804"],
        ["Metal", "#314459"],
        ["Psychic", "#be74d0"],
        ["Water", "#72a0d8"],
    ]);

    //Change background color to match card type
    useEffect(() => {
        if (card?.types) {
            const type = card.types[0];
            document.body.style.setProperty("background-color", colorByType.get(type) || "white");
        } else {
            document.body.style.setProperty("background-color", "white");
        }
    }, [card]);

    if (!card) {
        return (
            <div style={{ display: "flex" }}>
                <div style={{ textAlign: "center", width: "54%", marginBottom: "10px" }} >
                    <img src="/cardBack.png" />
                </div>
                <div className="cardText">
                    <div className="noCardText">
                        <p style={{ textAlign: "center" }}>Enter a Card name in the Search bar above to begin.</p>
                    </div>
                </div>
            </div>
        )
    }

    const cardTypes = [card.types, card.subtypes]
        .filter(t => t?.length > 0)
        .flat();
    return (
        <div style={{ display: "flex" }}>
            <div className="cardImage" >
                <img src={card.images.small} />
            </div>
            <div className="cardText">
                <div className="cardHeading">
                    <h2>{card.name}</h2>
                    <div className="subtypes">
                        <ul>
                            {cardTypes.map((subtype, i) => {
                                return <li key={i}>[{subtype}]</li>
                            })}
                        </ul>
                    </div>
                </div>
                <ul>
                    {card.abilities?.map((ability, i) => {
                        return <li key={i} className="ability">
                            <h2>{ability.name}</h2>
                            <div className="abilityLabel">{ability.type}</div>
                            <p>{ability.text}</p>
                        </li>
                    })}
                </ul>
                <ul>
                    {card.attacks?.map((attack, i) => {
                        return <li key={i} className="attack">
                            <h2>
                                <div className="attackName">
                                    {attack.name}
                                </div>
                                <div className="damage">
                                    {attack.damage ? `${attack.damage}` : ""}
                                </div>
                            </h2>
                            {attackCostIcons(attack.cost)}
                            <p>{attack.text}</p>
                        </li>
                    })}
                </ul>
                {(card.abilities?.length > 0 || card.attacks?.length > 0 ? <hr /> : null)}
                <ul>
                    {card.rules?.map((rule, i) => {
                        return (
                            <>
                                {(i === 1 && !card.abilities && !card.attacks ? <hr /> : null)}
                                <li key={i} className="ability">
                                    <p>{rule}</p>
                                </li>
                            </>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}