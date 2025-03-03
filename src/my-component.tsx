import {MyClass} from "./my-class"
import {useEffect, useMemo, useState} from "react"

import {useFetch} from "@/hooks/useFetch"

const MyComponent = () => {
    const myClass = useMemo<MyClass>(() => new MyClass(), []);

    const {fetch, isLoading, error} = useFetch()

    const [result, setResult] = useState<string>()

    const callback = async () => {
        setResult(await myClass.myMethod2())
    }

    useEffect(() => {
        (async () => {
            await fetch(callback)
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