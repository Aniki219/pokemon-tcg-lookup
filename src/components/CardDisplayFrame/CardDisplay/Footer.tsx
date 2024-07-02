import React from "react";
import { Card } from "../../../types/Card";

interface FooterParams {
    card: Card
}

export default function Footer({ card }: FooterParams) {
    return (
        <div className="setInfo">
            <img src={card.set.images.symbol} />
            <div id="set" title={card.set.releaseDate}>
                {card.set.name}
            </div>
        </div>
    )
}