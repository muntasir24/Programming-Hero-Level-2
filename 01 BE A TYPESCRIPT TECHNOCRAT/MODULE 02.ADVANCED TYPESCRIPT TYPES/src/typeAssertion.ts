let anything: any = "Hello, TypeScript!";

// anything. not giving any method cause hes not sure what is it hold

anything = 222;

// (anything as number).  now giving me number method

const kgToGMConverter = (input: string | number): string | number | undefined => {
// i can explicitly tell the return type of the function but i can also let it to be inferred by typescript
    if (typeof input === "number") return input * 1000;
    else if (typeof input === "string") {
        const [value] = input.split(" ");
        // if i split it it becomme array and i took it via destructuring took only the first element and i convert it to number and return string

        return `Output is ${Number(value)*1000}`
    }
}

const result1 = kgToGMConverter(2);
const result2 = kgToGMConverter('2 kg');
//result 2 string but result 1 is number but typescript is not sure about it so it give me union type of string and number for both result1 and result2 string | number| undefined
// i give input as number return number if it is string return string
// but as a developer i know that the result1 is number and result2 is string but typescript is not sure about it so i can use type assertion to tell typescript what is the type of the result

const result1AsNumber = result1 as number;
const result2AsString = result2 as string;

console.log(result1AsNumber); // 2000
console.log(result2AsString); // Output is 2000

// when to use type assertion
// 1. when you are sure about the type of the variable but typescript is not sure about it
// 2. when you want to tell typescript that the variable is of a specific type and you want to use the methods of that type
// 3. when you want to convert a variable from one type to another type

type CustomError = {
    message: string;
}

try {
    
}catch (err) {
    const customError = err as CustomError;
    console.log(customError.message);
}

