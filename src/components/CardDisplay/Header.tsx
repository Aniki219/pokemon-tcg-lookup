import React from "react";
import { isPokeType, spellPokemon } from "../../data";
import { getTypeIconLarge } from "../TypeIcon";

export interface HeaderParams {
    name: string,
    hp?: number,
    cardTypes: string[],
    superType: string,
    evolvesFrom?: string
}

export default function Header(card: HeaderParams) {
    const typeData = (cardTypes: string[]) => {
        if (card.superType === spellPokemon()) {
            return (
                <div>
                    {getTypeIconLarge(cardTypes[0])}
                </div>
            );
        } else {
            return (
                <h3>
                    [{card.superType}]
                </h3>
            )
        }
    }

    return (
        <div className="cardHeading">
            <h2 id="name"
                title={card.evolvesFrom ? `Evolves from: ${card.evolvesFrom}` : ""}>
                {card.name}
            </h2>
            <div className="types">
                {card.hp ? <h2 id="hp">{card.hp}</h2> : <></>}
                {typeData(card.cardTypes)}
            </div>
        </div>
    )
}
