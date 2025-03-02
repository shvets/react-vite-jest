import {act, renderHook} from "@testing-library/react"

import {useLoading} from "@/hooks/useLoading.ts"

describe("useLoading", () => {
    describe("useLoading hook", () => {
        it("before loading", () => {
            const { result } = renderHook(() => useLoading())

            expect(result.current.isLoading).toBeFalsy()
        })

        it("after loading", () => {
            const { result } = renderHook(() => useLoading())

            act(() => {
                result.current.startLoading()
            })

            expect(result.current.isLoading).toBeTruthy()
        })
    })
})