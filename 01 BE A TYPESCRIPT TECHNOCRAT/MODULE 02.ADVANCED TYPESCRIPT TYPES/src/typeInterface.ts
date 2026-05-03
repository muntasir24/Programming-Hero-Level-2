type User={
    name:string,
    age:number,
    email:string
}

const user1:User={
    name:"John Doe",
    age:30,
    email:"aziz@gmail.com"
}

// console.log(user1)

//intersection types
type Admin={
    name:string,
    role:string
}

type AdminUser=User & Admin

// const adminUser1: AdminUser = {
//     name: "Jane Doe",
//     age: 28,
//     email: "anup@gmail.com"
// }
//  Property 'role' is missing in type '{ name: string; age: number; email: string; }' but required in type 'AdminUser'.

//type alias brother is type intersection types but interface is not

//interface
interface IUser{
    name:string,
    age:number,
    email:string
}

const user2: IUser = {
    name: "Jane Doe",
    age: 28,
    email: "moon@gmail.com"
}

//but the difference is that we can extend interface but we cannot extend type alias

// interfece can only work with object types but type alias can work with any types like union, intersection, primitive types etc

//type intersectio:
type A = {
    a: string
}

type B = {
    b: number
}

type C = A & B

const c1: C = {
    a: "hello",
    b: 42
}

//interface intersection:
interface IA{
    a:string
}

interface IB{
    b:number
}

interface IC extends IA,IB{}

const ic1: IC = {
    a: "world",
    b: 24
}   

//when to use type alias and when to use interface?
//use type alias when you want to create a union type, intersection type, or a primitive type
//use interface when you want to create an object type or a class type
// example:

interface IProduct{
    id:number,
    name:string,
    price:number
}

const product1: IProduct = {
    id: 1,
    name: "Laptop",
    price: 999.99
}

//interface object :array or function

//type alias for array
type Friends=string[]

const friends: Friends = ["Alice", "Bob", "Charlie"]


//interface for array
interface IFriendList {
  [i: number]: string;
  // index signature: it means that the index is a number and the value is a string
}

const friendList: IFriendList = ["Alice", "Bob", "Charlie"]     

//type alias for function
type AddFunction = (a: number, b: number) => number

const add2: AddFunction = (a, b) => a + b   


//interface for function

interface IFunction{
    (a: number, b: number): number
    // this is a function type that takes two numbers as parameters and returns a number
}

const add: IFunction = (a, b) => a + b


