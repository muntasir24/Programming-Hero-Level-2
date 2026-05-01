//nullable - null, undefined
let age: number | null = null;
age = 25;

let userName: string | undefined = undefined;
userName = "Alice";

//unknown
let data: unknown;
data = "Hello, World!";
data = 42;
data = { name: "Bob", age: 30 };

//never function is a function that never returns a value, 
// it either throws an error or has an infinite loop 
//when we want to indicate that a function will never return a value, we can use the never type.
function throwError(message: string): never {
    throw new Error(message);
}

// throwError("Something went wrong!");