import {ChangeEvent} from "react"

import {SearchQuery} from "./search-query"

type SearchInputQuery = {
    query: SearchQuery
    setQuery: (query: SearchQuery) => void
}

export const SearchInput = ({query, setQuery}: SearchInputQuery) => {
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery({value: event.target.value})
    }

    return (
        <label>
            Search albums:
            <input value={query.value} onChange={onChange} />
        </label>
    )
}