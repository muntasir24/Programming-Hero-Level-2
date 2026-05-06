class Student {
    name: string;
    age: number;
    address: string;
    constructor(name: string, age: number, address: string) {
        this.name = name;
        this.age = age;
        this.address = address;
    }
    getDetails() {
        return `Name: ${this.name}, Age: ${this.age}, Address: ${this.address}`;
    }
    studyHours(hours: number) {
        return `${this.name} studies for ${hours} hours.`;
    }
}

const student1 = new Student("Alice", 20, "123 Main St");
console.log(student1.getDetails()); // Output: Name: Alice, Age: 20, Address: 123 Main St
student1.studyHours(5); // Output: Alice studies
//  for 5 hours.

//pasing 5 hours to the studyHours method 
// of the student1 object, 
// which will return a string 
// indicating how many hours Alice studies.
// this is called method invocation,
// where we call a method on an object and 
// pass arguments to it.
// this keyword only works inside a class method,
// and it refers to the current instance of the class.
// In this case, when we call student1.studyHours(5),
// the this keyword inside the studyHours method will refer to student1,
// allowing us to access its name property and return the appropriate string.   


// now create teacher class raw
class Teacher {
    name: string;
    age: number;
    address: string;
    designation: string; //extra property for teacher
    constructor(name: string, age: number, address: string, designation: string) {
        this.name = name;
        this.age = age;
        this.address = address;
        this.designation = designation;
    }
    getDetails() {
        return `Name: ${this.name}, Age: ${this.age}, Address: ${this.address}, Designation: ${this.designation}`;
    }
    teach(subject: string) {
        return `${this.name} teaches ${subject}.`;
    }
}

const teacher1 = new Teacher("Mr. Smith", 45, "456 Elm St", "Math Teacher");
console.log(teacher1.getDetails()); // Output: Name: Mr. Smith, Age: 45, Address: 456 Elm St, Designation: Math Teacher
teacher1.teach("Algebra"); // Output: Mr. Smith teaches Algebra.

// Now we have two classes, Student and Teacher, with some common properties (name, age, address) and some unique properties (designation for Teacher). 
// We can use inheritance to avoid code duplication and create a base class that both Student and Teacher can extend.

class Person {
    name: string;
    age: number;
    address: string;
    constructor(name: string, age: number, address: string) {
        this.name = name;
        this.age = age;
        this.address = address;
    }
    getDetails() {
        return `Name: ${this.name}, Age: ${this.age}, Address: ${this.address}`;
    }
}

class Student1 extends Person {
    constructor(name: string, age: number, address: string) {
        super(name, age, address); // call the constructor of the base class
    }
    studyHours(hours: number) {
        return `${this.name} studies for ${hours} hours.`;
    }
}

//super keyword is used to call the constructor 
// of the base class (Person) from the derived class (Student1). 
// This allows us to initialize the properties
//  of the base class (name, age, address) when 
// creating an instance of the Student1 class. 
// By using inheritance, we can avoid 
// duplicating the code for these common 
// properties and methods in both the Student and Teacher classes.
//example of using super keyword 
// to call the getDetails method of the base class (Person)
//  from the derived class (Teacher1).


class Teacher1 extends Person {
    designation: string;
    constructor(name: string, age: number, address: string, designation: string) {
        super(name, age, address); // call the constructor of the base class
        this.designation = designation;
    }
    getDetails() {
        return `${super.getDetails()}, Designation: ${this.designation}`; // call the getDetails method of the base class
    }
    teach(subject: string) {
        return `${this.name} teaches ${subject}.`;
    }
}

const student2 = new Student1("Bob", 22, "789 Oak St");
console.log(student2.getDetails()); // Output: Name: Bob, Age: 22, Address: 789 Oak St
student2.studyHours(3); // Output: Bob studies for 3 hours.

const teacher2 = new Teacher1("Ms. Johnson", 38, "321 Pine St", "Science Teacher");
console.log(teacher2.getDetails()); // Output: Name: Ms. Johnson, Age: 38, Address: 321 Pine St, Designation: Science Teacher
teacher2.teach("Physics"); // Output: Ms. Johnson teaches Physics.

// In this implementation, we have created a base class Person that contains the common properties and methods for both Student and Teacher. 
// The Student and Teacher classes extend the Person class, allowing them to inherit its properties and methods while also adding their own unique features. 
// This approach promotes code reusability and makes our code more organized and maintainable.
