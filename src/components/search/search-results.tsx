import {ComponentType, useEffect, useState} from "react"

import {SearchQuery} from "@/components/search/search-query"

type SearchResultsQuery<T> = {
    query: SearchQuery
    onSearch: (query: SearchQuery) => Promise<T[]>
    ResultsRenderer: ComponentType<{items: T[]}>
}

export const SearchResults = <T, _>({query, onSearch, ResultsRenderer}: SearchResultsQuery<T>) => {
    const [items, setItems] = useState<T[]>([])

    const [messageEnabled, setMessageEnabled] = useState(false)

    useEffect(() => {
        (async () => {
            if (query.value.length > 0) {
                const items = await onSearch(query)

                setItems(items)

                if (items.length === 0) {
                    setMessageEnabled(true)
                }
            }
            else {
                setMessageEnabled(false)
            }
        })()
    }, [query])

    if (messageEnabled) {
        return <p>No matches for <i>"{query.value}"</i></p>;
    }
    else {
        return <>
            <ResultsRenderer items={items}/>
        </>
    }
}