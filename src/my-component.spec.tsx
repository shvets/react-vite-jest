// import {MyClass} from "@/my-class.ts";

jest.mock('./my-class', () => {
    return {
        MyClass: jest.fn().mockImplementation(() => ({
            myMethod: jest.fn().mockReturnValue('mocked1'),
            myMethod2: jest.fn().mockReturnValue('mocked2'),
        })),
    };
});

// test('mock entire class', () => {
//     const instance = new MyClass();
//
//     expect(instance.myMethod()).toBe('mocked');
// });

import {act, render, screen} from "@testing-library/react";
import MyComponent from "@/my-component.tsx";

describe("MyComponent", () => {
    it("renders heading", async () => {
        await act(async () => {
            render(<MyComponent/>);
        })

        const result1 = screen.getByText(/mocked1/i);
        expect(result1).toBeInTheDocument()

        const result2 = screen.getByText(/mocked2/i);
        expect(result2).toBeInTheDocument()
    });
});
