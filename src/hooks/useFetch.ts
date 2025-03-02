import {useState} from "react"

import {useLoading} from "@/hooks/useLoading"

export const useFetch = () => {
    const {isLoading, startLoading, stopLoading} = useLoading()
    const [error, setError] = useState<Error | null>(null)

    const fetch = async (callback: () => Promise<void>) => {
        startLoading()

        try {
            await callback()
        }
        catch (error: any) {
            setError(error)
        }
        finally {
            stopLoading()
        }
    }

    return {
        fetch,
        isLoading,
        stopLoading,
        error
    }
}