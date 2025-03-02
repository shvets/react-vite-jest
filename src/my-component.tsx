import {MyClass} from "./my-class"
import {useEffect, useMemo} from "react"

import {useFetch} from "@/hooks/useFetch"

const MyComponent = () => {
    const myClass = useMemo<MyClass>(() => new MyClass(), []);

    const {fetch, isLoading, error} = useFetch()

    let result: any

    const a = async () => {
        await myClass.myMethod2()
    }

    useEffect(() => {
        (async () => {
            result = await fetch(a)
        })()
    }, [])

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div data-testid="my-component">
            <div>
                1. {myClass.myMethod()}
            </div>

            <div>
                2. {result}
            </div>
        </div>
    );
};

export default MyComponent