import { SHA256 } from "crypto-es/lib/sha256"

export function createHash(inputString: string): string {
    return SHA256(inputString).toString();
}

export interface SearchParams {
    searchBy: string,
    searchText: string,
    standard: boolean,
    exact: boolean,
    set: string,
    page: number,
    totalPages: number
}

export const getCardRequestUrl = (params: SearchParams) => {
    const legalities = params.standard ? "legalities.standard:legal" : "";
    const { searchText, searchBy } = params;
    const set = params.set === "Any" ? "" : `set.name:"${params.set}"`;
    const exact = params.exact ? "" : "*";
    const page = params.page || 1;

    const url = `https://api.pokemontcg.io/v2/cards?page=${page}&q=${legalities} ${set} ${searchBy}:"${searchText}${exact}"`;

    return url;
}