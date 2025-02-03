import {useEffect, useState} from "react"

export const useFetchResult = <S>(url: string, fetch: (url: string) => Promise<S>) => {
    const [result, setResult] = useState({} as S)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        (async () => {
            setLoading(true)

            try {
                setResult(await fetch(url))
            }
            catch (e) {
                setError(e as Error);
            }
        })()

        return () => {
            setLoading(false)
        }
    })

    return {result, loading, error}
}
