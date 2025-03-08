import {Search} from "@/components/search/search"
import {SearchResults} from "@/components/search/search-results"
import {SearchInput} from "@/components/search/search-input"
import {fetchData} from "@/data.ts";

// interface Album {
//     id: number
//     title: string
//     year: number
// }

export const SearchDemo = () => {
    const fallback = <h2>Loading...</h2>

    const ResultsRenderer = (items: any) => {
        console.log(items.items)
        return <ul>
            {items.items.map((item: any) => (
                <li key={item.id}>
                    {item.title} ({item.year})
                </li>
            ))}
        </ul>
    }

    const onSearch = (query: string) => {
        return fetchData(`/search?q=${query}`)
    }

    return (
        <>
            <Search SearchInput={SearchInput} SearchResults={SearchResults} ResultsRenderer={ResultsRenderer}
                    fallback={fallback} onSearch={onSearch}/>
        </>
    );
}