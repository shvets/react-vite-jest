import {act, renderHook} from "@testing-library/react"

import {useFetch} from "@/hooks/useFetch";

describe("useFetch", () => {
    describe("useFetch hook", () => {
        it("before loading", () => {
            const fetchResult = renderHook(() => useFetch())

            const { result } = fetchResult

            expect(result.current.isLoading).toBeFalsy()
            expect(result.current.error).toBeNull()
        })

        it("after loading", async () => {
            let fetchResult: any

            await act(async () => {
                fetchResult = renderHook(() => useFetch())
            })

            const { result } = fetchResult

            let data = ''

            await act(async () => {
                await result.current.fetch(async () => {
                    data = '123'
                })
            })

            expect(result.current.isLoading).toBeFalsy()
            expect(data).toEqual('123')
        })
    })
})