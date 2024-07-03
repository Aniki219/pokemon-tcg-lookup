import React from "react"

interface StatusBarProps {
    status: string,
    pagesLoaded: PagesLoaded
}

export default function StatusBar({ status, pagesLoaded }: StatusBarProps) {
    if (status && status.length > 0) {
        return (
            <div className="statusBar">
                <p>
                    {status}...
                    {pagesLoaded.totalPages > 0 ?
                        `${Math.floor(pagesLoaded.loaded / pagesLoaded.totalPages) * 100}` : ""}
                </p>
            </div>
        )
    } else {
        return <></>
    }
}