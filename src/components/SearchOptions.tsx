import React, { useEffect } from "react";
import { SearchParams } from "./CardDisplayFrame";

interface SearchOptionProps {
    setNames: { legal: string[], all: string[] }
    getSearchParams: () => SearchParams,
    setSearchParams: (params: SearchParams) => void
}

export default function SearchOptions(props: SearchOptionProps) {
    return (
        <div className="searchOptions">
            <ul>
                <li>
                    <input type="checkbox"
                        defaultChecked={true}
                        onChange={(e) => {
                            console.log(e.target)
                            props.setSearchParams({ ...props.getSearchParams(), standard: !props.getSearchParams().standard })
                        }} />
                    Standard
                </li>
                <li>
                    <input type="checkbox"
                        onChange={(e) => {
                            props.setSearchParams({ ...props.getSearchParams(), exact: !props.getSearchParams().exact })
                        }} />
                    Exact Name
                </li>
                <li>
                    Set:
                    <select id="set" onChange={(e) => {
                        props.setSearchParams({ ...props.getSearchParams(), set: e.target.value })
                    }}>
                        <option key={0} value="Any">Any</option>
                        {(props.getSearchParams().standard ? props.setNames.legal : props.setNames.all)
                            .map((name, i) => {
                                return (
                                    <option key={i + 1} value={name}>{name}</option>
                                );
                            })}
                    </select>

                </li>
            </ul>
        </div>
    )
}