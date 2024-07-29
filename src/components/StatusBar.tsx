import React, { useState } from "react"

interface StatusBarProps {
    statusMap: Omit<Map<string, string>, "set" | "clear" | "delete">,
    pagesLoaded: PagesLoaded
}

export default function StatusBar({ statusMap, pagesLoaded }: StatusBarProps) {
    return (
        <ul className="statusList">
            {Array.from(statusMap.entries()).map(entry => {
                const key = entry[0];
                const status = entry[1];
                return (
                    <li className="statusBar">
                        {status}
                        {key === "Autofill" && pagesLoaded.totalPages > 0 ?
                            ` ${Math.floor(100 * pagesLoaded.loaded / pagesLoaded.totalPages)}%` : ""}
                    </li>
                )
            })}
        </ul>
    )
}