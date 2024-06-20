import React from "react"
import { Card } from "../interfaces/Card"

export default function CardDisplay({ card, incrementCardIndex }: { card: Card | undefined, incrementCardIndex: (inc: number) => void }) {
    if (!card) {
        return <></>;
    }

    return (
        <>
            <div style={{ textAlign: "center" }} >
                <img src={card.images.small} />
            </div>
            <ul style={{ listStyle: "circle" }}>
                {card.abilities?.map(ability => {
                    return <li>
                        <h2><b>{ability.name}</b> (<b style={{ color: "red" }}>{ability.type}</b>)</h2>
                        <p>{ability.text}</p>
                    </li>
                })}
            </ul>
            <ul>
                {card.attacks?.map(attack => {
                    return <li>
                        <h2><b>{attack.name}</b> - ({attack.damage})</h2>
                        <div><i>{attack.cost.join(" ")} </i></div>
                        <p>{attack.text}</p>
                    </li>
                })}
            </ul>

        </>
    )
}