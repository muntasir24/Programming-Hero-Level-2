// constrain means strictly defining the type of a variable, function parameter, or return type. It helps to catch errors at compile time and ensures that the code is more robust and maintainable.



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


console.log(addStudentToCourse(student1));
console.log(addStudentToCourse(student2));

//pronblem is adding student that dont have name or id

const student3 = {
    hasPencil: true
}

console.log(addStudentToCourse(student3)); // this will work but it will not have name and id which are important for a student



// to solve this problem we can use constraint in generics

const addStudentToCourseWithConstraint = <T extends {name: string, id: number}>(studentInfo: T) => {
    return {
        ...studentInfo,
        course: "Next Level TypeScript"
    }
}

console.log(addStudentToCourseWithConstraint(student1)); // this will work
console.log(addStudentToCourseWithConstraint(student2)); // this will work
// console.log(addStudentToCourseWithConstraint(student3)); // this will give an error because student3 does not have name and id

//we can also use interface to define the constraint

interface Student {
    name: string;
    id: number;
}

const addStudentToCourseWithInterfaceConstraint = <T extends Student>(studentInfo: T) => {
    return {
        ...studentInfo,
        course: "Next Level TypeScript"
    }
}

console.log(addStudentToCourseWithInterfaceConstraint(student1)); // this will work
console.log(addStudentToCourseWithInterfaceConstraint(student2)); // this will work
// console.log(addStudentToCourseWithInterfaceConstraint(student3)); // this will give an error because student3 does not have name and id

// in this way we can ensure that the student info passed to the function has the required properties and we can catch errors at compile time.
// constraint in TypeScript is a powerful feature that allows us to define the shape of data and ensure that our code is more robust and maintainable. It helps us to catch errors at compile time and ensures that our code is more predictable and easier to debug.
// By using constraints in TypeScript, we can create more flexible and reusable code while still maintaining type safety. It allows us to define the expected structure of data and ensures that our code is more robust and maintainable.
// In conclusion, constraint in TypeScript is a powerful feature that allows us to define the shape of data and ensure that our code is more robust and maintainable. It helps us to catch errors at compile time and ensures that our code is more predictable and easier to debug. By using constraints in TypeScript, we can create more flexible and reusable code while still maintaining type safety. It allows us to define the expected structure of data and ensures that our code is more robust and maintainable.
