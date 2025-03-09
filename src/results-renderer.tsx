import {Album} from "@/search-service"

type ResultsRendererQuery = {
    items: Album[]
}

export const ResultsRenderer = ({items}: ResultsRendererQuery) => {
    return <ul>
        {items.map((item: any) => (
            <li key={item.id}>
                {item.title} ({item.year})
            </li>
        ))}
    </ul>
}