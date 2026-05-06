//type gaurd

//in typeof operator we can check the type of variable

//without typegaurd
// function add(a: number | string, b: number | string) {
//     return a + b; // Error: Operator '+' cannot be applied to types 'number | string' and 'number | string'.
// }

//with typegaurd    
function add(a: number | string, b: number | string) {
    if (typeof a === "number" && typeof b === "number") {
        return a + b;
    } else if (typeof a === "string" && typeof b === "string") {
        return a + b;
    } else {
        throw new Error("Invalid arguments");
    }
}

console.log(add(1, 2)); // 3
console.log(add("Hello, ", "world!")); // Hello, world!
// console.log(add(1, "2")); // Error: Invalid arguments

type alphaNumeric=number|string;

function add2(a: alphaNumeric, b: alphaNumeric) {
    
    if (typeof a === "number" && typeof b === "number") {
        return a + b;
    } else if (typeof a === "string" && typeof b === "string") {
        return a + b;
    } else {
        throw new Error("Invalid arguments");
    }
}

console.log(add2(1, 2)); // 3
console.log(add2("Hello, ", "world!")); // Hello, world!
// console.log(add2(1, "2")); // Error: Invalid arguments


// in gaurd we can also check the type of object

type NormalUser={
    name:string;
}

type AdminUser={
    name:string;
    role:"admin";
}

const getUserinfo=(user:NormalUser|AdminUser)=>{
    if("role" in user){
        return `I am an admin and my name is ${user.name}`;
    }else{
        return `I am a normal user and my name is ${user.name}`;
    }
}

console.log(getUserinfo({name:"John"})); // I am a normal user and my name is John
console.log(getUserinfo({name:"Jane", role:"admin"})); // I am an admin and my name is Jane