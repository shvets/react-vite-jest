import {Suspense, useDeferredValue, useState} from "react"

import {SearchInput} from "./components/search/search-input"
import {Album, getAlbums} from "./search-service"
import {SearchResults} from "@/components/search/search-results.tsx"
import {SearchQuery} from "@/components/search/search-query"
import {ResultsRenderer} from "@/results-renderer"

export const SearchDemo = () => {
    const [query, setQuery] = useState<SearchQuery>({value: ''})

    const deferredQuery = useDeferredValue(query)

    const onSearch = (query: SearchQuery): Promise<Album[]> => {
        return getAlbums(query.value)
    }

    const fallback = <h2>Loading...</h2>

    return <>
        <SearchInput query={query} setQuery={setQuery}/>

        <Suspense fallback={fallback}>
            <SearchResults query={deferredQuery} onSearch={onSearch} ResultsRenderer={ResultsRenderer}/>
        </Suspense>
    </>
}