// myClass.js
export class MyClass {
    myMethod() {
        return 'original1';
    }

    async myMethod2(): Promise<string> {
        return 'original2';
    }
}
