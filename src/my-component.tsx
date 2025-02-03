import {MyClass} from "@/my-class.ts";
import {useMemo} from "react";
import {useFetchResult} from "@/useFetchResult.ts";

const MyComponent = () => {
    const myClass = useMemo<MyClass>(() => new MyClass(), []);

    const {result, loading, error} = useFetchResult('', async () => {
        return await myClass.myMethod2()
    })

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div data-testid="my-component">
            <div>
                {myClass.myMethod()}
            </div>

            <div>
                {result}
            </div>
        </div>
    );
};

export default MyComponent;