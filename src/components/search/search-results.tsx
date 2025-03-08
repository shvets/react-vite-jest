import {ComponentType, use} from 'react'

type SearchResultsProps = {
    query: string
    onSearch: (query: string) => Promise<any>
    ResultsRenderer: ComponentType<{items: any[]}>
}

export const SearchResults = ({ query, onSearch, ResultsRenderer }: SearchResultsProps) => {
    if (query === '') {
        return null
    }

    const items: any[] = use(onSearch(query))

    if (items.length === 0) {
        return <p>No matches for <i>"{query}"</i></p>;
    }

    return <ResultsRenderer items={items}/>
}