//if i generalize the function with generics i can use it for any type of input and output without losing the type safety

const creayteArray=(val:string): string[]=>{
    return [val]
}

const stringArray=creayteArray("hello")

// if i want to create an array of numbers or boolean i have to create another function for that

const creayteNumberArray=(val:number): number[]=>{
    return [val]
}

const numberArray = creayteNumberArray(42)
numberArray.push(100) // this is fine

printArray(stringArray)
printArray(numberArray)

function printArray(arr:string[]|number[]){
    arr.forEach((item)=>{
        console.log(item)
    })
}
// but if i use generics i can create a single function that can handle any type of input and output

const createArrayWithGenerics=<T>(val:T): T[]=>{
    return [val]
}
//it says that the type parameter 'T' is not used in the function body. This is because the function is not using the type parameter to define the type of the input or output. To fix this, we can use the type parameter to define the type of the input and output.

const stringArrayWithGenerics = createArrayWithGenerics<string>("hello")
const numberArrayWithGenerics = createArrayWithGenerics<number>(42)
numberArrayWithGenerics.push(100) // this is fine
// numberArrayWithGenerics.push("string") // this will give an error because the type of the array is number[] and we are trying to push a string into it  
// numberArrayWithGenerics.push(true) // this will give an error because the type of the array is number[] and we are trying to push a boolean into it 
// numberArrayWithGenerics.push({}) // this will give an error because the type of the array is number[] and we are trying to push an object into it
// numberArrayWithGenerics.push([]) // this will give an error because the type of the array is number[] and we are trying to push an array into it
numberArrayWithGenerics.push(34.5) // this is fine because the type of the array is number[] and we are trying to push a number into it

printArray(stringArrayWithGenerics)
printArray(numberArrayWithGenerics)

function printArrayWithGenerics<T>(arr:T[]){
    arr.forEach((item)=>{
        console.log(item)
    })
}

//tuple qithout generics

const createTuple=(val1:string,val2:number): [string,number]=>{
    return [val1,val2]
}

const tuple = createTuple("hello",42)
console.log(tuple) // this will print ["hello",42]

//but if i want to create a tuple of boolean and string i have to create another function for that

const createTupleBooleanString=(val1:boolean,val2:string): [boolean,string]=>{
    return [val1,val2]
}

const tupleBooleanString = createTupleBooleanString(true,"hello")
console.log(tupleBooleanString) // this will print [true,"hello"]

//tuple with generics

const createTupleWithGenerics=<T,U>(val1:T,val2:U): [T,U]=>{
    return [val1,val2]
}

const tupleWithGenerics = createTupleWithGenerics<string, number>("hello", 42)
const tupleWithGenericsBooleanString = createTupleWithGenerics<boolean, string>(true, "hello")  
console.log(tupleWithGenerics) // this will print ["hello",42]
console.log(tupleWithGenericsBooleanString) // this will print [true,"hello"]   


//student will get course

const student1 = {
    name:"John",
    id: 123,
    hasPencil: true
}
const student2 = {
    name:"Jane",
    id: 456,
    isMarried: false,
    hasCar: true
}

//student info is different for each student but we can use generics to create a function that can handle any type of student info

const addStudentToCourse = <T>(studentInfo: T) => {
    return {
        ...studentInfo,
        course: "Next Level TypeScript"
    }
}

const student1WithCourse = addStudentToCourse(student1)
const student2WithCourse = addStudentToCourse(student2)

console.log(student1WithCourse) // this will print {name:"John",id:123,hasPencil:true,course:"Next Level TypeScript"}
console.log(student2WithCourse) // this will print {name:"Jane",id:456,isMarried:false,hasCar:true,course:"Next Level TypeScript"}