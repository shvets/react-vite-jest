import {ComponentType, ReactNode, Suspense, useDeferredValue, useState} from "react"

type SearchProps = {
    SearchInput: ComponentType<{query: string, setQuery: (query: string) => void}>
    SearchResults: ComponentType<{query: string, onSearch: (query: string) => Promise<any[]>, ResultsRenderer: any}>
    ResultsRenderer: ComponentType<{items: any[]}>
    fallback: ReactNode
    onSearch: (query: string) => Promise<any[]>
}

export const Search = ({SearchInput, SearchResults, ResultsRenderer, fallback, onSearch}: SearchProps) => {
    const [query, setQuery] = useState('')
    const deferredQuery = useDeferredValue(query)

    return (
        <>
            <SearchInput query={query} setQuery={setQuery}/>

            <Suspense fallback={fallback}>
                <SearchResults query={deferredQuery} onSearch={onSearch} ResultsRenderer={ResultsRenderer}/>
            </Suspense>
        </>
    );
}