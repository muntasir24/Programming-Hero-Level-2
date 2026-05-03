//KeyOf operator is used to create a union type of the keys of an object type. It is often used in conjunction with generics to create flexible and reusable types.
//example:


type RichPeopleVehicles = {
   car: string;
   bike: string;
   yacht: string;
}

type MyVehicle = "car" | "bike" | "yacht";
//we can insert the above type in a variable(type litarales) like this:
const myVehicle: MyVehicle = "car"; // This is valid
// const anotherVehicle: MyVehicle = "plane"; // This will cause a TypeScript error because "plane" is not part of the MyVehicle type.

//were inserting the type literal "car" into the variable myVehicle, which is of type MyVehicle. Since "car" is one of the allowed string literals in the MyVehicle type, this assignment is valid. However, when we try to assign "plane" to anotherVehicle, it causes a TypeScript error because "plane" is not included in the MyVehicle type, which only allows "car", "bike", or "yacht".
//Now, let's see how we can use the keyof operator to achieve the same result without manually listing the keys:

type MyVehicleUsingKeyOf = keyof RichPeopleVehicles;
//keyof RichPeopleVehicles will give us a union type of the keys of the RichPeopleVehicles type, which are "car", "bike", and "yacht". Therefore, MyVehicleUsingKeyOf will be equivalent to "car" | "bike" | "yacht".


const myVehicle1: MyVehicleUsingKeyOf = "car"; // This is valid
// const anotherVehicle1: MyVehicleUsingKeyOf = "plane"; // This will cause a TypeScript error because "plane" is not a key of RichPeopleVehicles.


const user = {
    name: "John",
    age: 30,
    address: {
        street: "123 Main St",
        city: "Anytown",
        country: "USA"
    }
}
const myId=user["name"]; // This is valid, myId will be of type string
const myAge=user["age"]; // This is valid, myAge will be of type number
const myStreet=user["address"]["street"]; // This is valid, myStreet will be of type string

//In the above example, we have an object user with properties name, age, and address. We can access these properties using the bracket notation. The type of myId will be inferred as string, the type of myAge will be inferred as number, and the type of myStreet will be inferred as string.       

console.log(myId); // Output: John
console.log(myAge); // Output: 30
console.log(myStreet); // Output: 123 Main St

const getPropertyFromObj=(obj: object, key: string) => {
//   return obj[key]; // This will cause a TypeScript error because the type of obj is object, which does not have an index signature.
    // Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
    //in key is it name or age or address, we need to specify that in the type of key, we can do that by using keyof operator on the type of obj, but since obj is of type object, we cannot use keyof operator on it. We need to make obj a generic type and use keyof operator on that generic type to specify the keys that can be accessed.
  
}

const result = getPropertyFromObj(user, "name"); // This will cause a TypeScript error because the getPropertyFromObj function is not properly typed to allow for accessing properties of the user object.



type User= {
    name: string;
    age: number;
    address: {
        street: string;
        city: string;
        country: string;
    }
}

const user1: User = {
    name: "John",
    age: 30,
    address: {
        street: "123 Main St",
        city: "Anytown",
        country: "USA"
    }
}

// we can tell manually the type of key in the getPropertyFromObj function, 
//example
const getPropertyFromObj1 = (obj: User, key:'name'|'age'|'address') => {
    return obj[key]; // This is valid, the type of obj is User and the type of key is 'name' | 'age' | 'address', which means it can only be "name", "age", or "address".
}
const getPropertyFromObj2=(obj: User, key: keyof User) => {
    return obj[key]; // This is valid, the type of obj is User and the type of key is keyof User, which means it can only be "name", "age", or "address".
}

const result1 = getPropertyFromObj1(user1, "name"); // This is valid, result1 will be of type string
const result2 = getPropertyFromObj2(user1, "age"); // This is valid, result2 will be of type number

console.log(result1); // Output: John
console.log(result2); // Output: 30

// if we have another object with the different structure,
const product = {
    id: 1,
    name: "Laptop",
    price: 999.99
}

const result3 = getPropertyFromObj1(product, "name"); // This will cause a TypeScript error because the getPropertyFromObj1 function is not properly typed to allow for accessing properties of the product object.
const result4 = getPropertyFromObj2(product, "price"); // This will cause a TypeScript error because the getPropertyFromObj2 function is not properly typed to allow for accessing properties of the product object.

// To fix this issue, we can make the getPropertyFromObj function generic and use keyof operator on the generic type to specify the keys that can be accessed.

const getPropertyFromObj3 = <T>(obj: T, key: keyof T) => {
    return obj[key]; // This is valid, the type of obj is T and the type of key is keyof T, which means it can only be the keys of the type T.
}

const result5 = getPropertyFromObj3(user1, "name"); // This is valid, result5 will be of type string
const result6 = getPropertyFromObj3(product, "price"); // This is valid, result6 will be of type number

console.log(result5); // Output: John
console.log(result6); // Output: 999.99

// In the above example, we have made the getPropertyFromObj3 function generic by using <T>. This allows us to specify the type of obj when we call the function. The type of key is now keyof T, which means it can only be the keys of the type T. This makes the function flexible and reusable for different types of objects.
