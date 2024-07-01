import React, { useEffect } from "react";
import { SearchParams } from "./CardDisplayFrame";

interface SearchOptionProps {
    setNames: string[],
    getSearchParams: () => SearchParams,
    setSearchParams: (params: SearchParams) => void
}

export default function SearchOptions(props: SearchOptionProps) {
    useEffect(() => {
        console.log("reloaded")
    }, []);

    return (
        <div className="searchOptions">
            <ul>
                <li>
                    <input type="checkbox"
                        defaultChecked={true}
                        onChange={(e) => {
                            props.setSearchParams({ ...props.getSearchParams(), standard: e.target.value === "true" })
                        }} />
                    Standard
                </li>
                <li>
                    <input type="checkbox"
                        onChange={(e) => {
                            props.setSearchParams({ ...props.getSearchParams(), exact: e.target.value === "true" })
                        }} />
                    Exact Name
                </li>
                <li>
                    Set:
                    <select id="set" onChange={(e) => {
                        props.setSearchParams({ ...props.getSearchParams(), set: e.target.value })
                    }}>
                        <option key={0} value="Any">Any</option>
                        {props.setNames.map((name, i) => {
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