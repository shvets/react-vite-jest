import {ChangeEvent} from "react"

type SearchInputQuery = {
    query: string
    setQuery: (query: string) => void
}

export const SearchInput = ({query, setQuery}: SearchInputQuery) => {
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    }

    return (
        <label>
            Search albums:
            <input value={query} onChange={onChange} />
        </label>
    )
}