import React from "react";
import { Ability, Attack, Card } from "../../interfaces/Card";
import { getTypeIcon } from "../TypeIcon";

interface CardTextParams {
    abilities?: Ability[],
    attacks?: Attack[],
    rules?: string[],
    subtypes?: string[]
}

export default function CardText(card: CardTextParams) {
    const attackCostIcons = (costArray: string[]) => {
        return (
            <div className="attackCost">
                {costArray.map((costType, i) => {
                    return getTypeIcon(costType, i);
                })}
            </div>
        )
    }

    return (
        <div className="cardText">
            <div className="subtypes">
                <ul>
                    {card.subtypes?.map((subtype, i) => {
                        return <li key={i}>
                            <i style={{ fontSize: "16px" }}>{subtype}</i>
                        </li>
                    })}
                </ul>
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
            {([card.abilities, card.attacks].flat().filter(x => x).length > 0 && card.rules ? <hr /> : null)}
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
    )
}