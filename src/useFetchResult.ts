import {useEffect, useState} from "react"

export const useFetchResult = <S>(initialState: S, fetch: () => Promise<S>) => {
    const [result, setResult] = useState(initialState)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        (async () => {
            setLoading(true)

            try {
                setResult(await fetch())
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
