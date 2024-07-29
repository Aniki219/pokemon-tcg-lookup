import React, { useEffect } from "react";
import { SearchParams } from "@utils/helpers";
import { SetNamesByLegality } from "@models/Set";

interface SearchOptionProps {
    visible: boolean
    setNames: SetNamesByLegality,
    getSearchParams: () => SearchParams,
    setSearchParams: (params: SearchParams) => void
}

export default function SearchOptions({ setNames, getSearchParams, setSearchParams, visible }: SearchOptionProps) {
    if (!visible) {
        return <></>
    }
    return (
        <div className="searchOptions">
            <ul>
                <li>
                    <input type="checkbox"
                        defaultChecked={getSearchParams().standard}
                        onChange={(e) => {
                            setSearchParams({ ...getSearchParams(), standard: !getSearchParams().standard, set: "Any" })
                        }} />
                    Standard
                </li>
                <li>
                    <input type="checkbox"
                        defaultChecked={getSearchParams().exact}
                        onChange={(e) => {
                            setSearchParams({ ...getSearchParams(), exact: !getSearchParams().exact })
                        }} />
                    Exact Name
                </li>
                <li>
                    Set:
                    <select id="set"
                        value={getSearchParams().set}
                        onChange={(e) => {
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