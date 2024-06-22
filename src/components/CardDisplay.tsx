import React from "react"
import { Card } from "../interfaces/Card"
import "./CardDisplay.css"

export default function CardDisplay({ card, incrementCardIndex }: { card: Card | undefined, incrementCardIndex: (inc: number) => void }) {
    if (!card) {
        return <></>;
    }

    const attackCostIcons = (costArray: string[]) => {
        return (
            <div className="attackCost">
                {costArray.map((costName, i) =>
                    <img key={i} src={`/icons/${costName}.png`} style={{ width: "18px" }} />
                )}
            </div>
        )
    }

    return (
        <div style={{ display: "flex" }}>
            <div style={{ textAlign: "center", width: "54%", marginBottom: "10px" }} >
                <img src={card.images.small} />
            </div>
            <div className="cardText">
                <ul>
                    {card.abilities?.map(ability => {
                        return <li>
                            <h2>{ability.name} (<b style={{ color: "red" }}>{ability.type}</b>)</h2>
                            <p>{ability.text}</p>
                        </li>
                    })}
                </ul>
                <ul>
                    {card.attacks?.map(attack => {
                        return <li>
                            <h2>{attack.name} {attack.damage ? `- (${attack.damage})` : ""}</h2>
                            {attackCostIcons(attack.cost)}
                            <p>{attack.text}</p>
                        </li>
                    })}
                </ul>
            </div>
        </div>
    )
}