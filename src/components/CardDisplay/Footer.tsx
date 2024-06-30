import React from "react";
import { Card } from "../../interfaces/Card";

interface FooterParams {
    card: Card
}

export default function Footer(params: FooterParams) {
    const card = params.card;

    return (
        <div className="setInfo">
            <img src={card.set.images.symbol} />
            <div id="set" title={card.set.releaseDate}>
                {card.set.name}
            </div>
        </div>
    )
}