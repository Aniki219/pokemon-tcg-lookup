import React, { useEffect } from "react";
import { SearchParams } from "./CardDisplayFrame";
import { SetNamesByLegality } from "types/Set";

interface SearchOptionProps {
    setNames: SetNamesByLegality,
    getSearchParams: () => SearchParams,
    setSearchParams: (params: SearchParams) => void
}

export default function SearchOptions({ setNames, getSearchParams, setSearchParams }: SearchOptionProps) {
    return (
        <div className="searchOptions">
            <ul>
                <li>
                    <input type="checkbox"
                        defaultChecked={true}
                        onChange={(e) => {
                            console.log(e.target)
                            setSearchParams({ ...getSearchParams(), standard: !getSearchParams().standard })
                        }} />
                    Standard
                </li>
                <li>
                    <input type="checkbox"
                        onChange={(e) => {
                            setSearchParams({ ...getSearchParams(), exact: !getSearchParams().exact })
                        }} />
                    Exact Name
                </li>
                <li>
                    Set:
                    <select id="set" onChange={(e) => {
                        setSearchParams({ ...getSearchParams(), set: e.target.value })
                    }}>
                        <option key={0} value="Any">Any</option>
                        {(getSearchParams().standard ? setNames.standard : setNames.unlimited)
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