import React from "react"
import { getIconByType } from "../data"

export function getTypeIcon(pokeType: string, key: number = 0) {
    return <img key={key} src={getIconByType(pokeType)} style={{ width: "18px" }}></img>
}

export function getTypeIconLarge(pokeType: string, key: number = 0) {
    return <img key={key} src={getIconByType(pokeType)} style={{ width: "24px" }}></img>
}