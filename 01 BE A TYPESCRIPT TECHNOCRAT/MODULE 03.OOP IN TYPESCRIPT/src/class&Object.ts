// Property 'sound' has no initializer and is not definitely assigned in the constructor.
// This error occurs because the 'sound' 
// property is declared but not initialized in the 
// constructor of the 'Animal' class.
//solution: To fix this error, you can either provide an initializer for the 'sound'
//  property or mark it as optional using the '?' operator.

class Animal {
    name: string;
    species: string;
    sound: string;
    constructor(name: string, species: string, sound: string) {
        this.name = name;
        this.species = species;
        this.sound = sound;

    }
}

//this keyword refers to the current instance of the class. 
// It is used to access properties and methods of the class within its own context.
//  In the constructor of the 'Animal' class, 'this.name' refers to the 'name' property of the current instance being created.
//here, 'this.name = name;' assigns the value of the 'name' parameter passed to the constructor to the 'name' property of the instance.


const dog= new Animal("Buddy", "Dog", "Woof");
console.log(dog.name); // Output: Buddy
console.log(dog.species); // Output: Dog
console.log(dog.sound); // Output: Woof

const cat= new Animal("Whiskers", "Cat", "Meow");
console.log(cat.name); // Output: Whiskers
console.log(cat.species); // Output: Cat
console.log(cat.sound); // Output: Meow

//new keyword is used to create an instance of a class.
//we can create without new keyword but it will give error 
// because it is not a function
// new keyword dynamically allocates memory for the new object 
// and returns a reference to that memory.
//example: const dog = new Animal("Buddy", "Dog", "Woof"); 
// creates a new instance of the 'Animal' class and assigns


//methds are functions that are defined within a 
// class and can be called on instances of that class.
class Animal1 {
    name: string;
    species: string;
    sound: string;
    constructor(name: string, species: string, sound: string) {
        this.name = name;
        this.species = species;
        this.sound = sound;

    }
    makeSound() {
        console.log(`${this.name} says ${this.sound}`);
    }
}
const dog1 = new Animal1("Buddy", "Dog", "Woof");
dog1.makeSound(); // Output: Buddy says Woof

const cat1 = new Animal1("Whiskers", "Cat", "Meow");
cat1.makeSound(); // Output: Whiskers says Meow

// why use this keyword in method
// The 'this' keyword is used in methods 
// to refer to the current instance of the 
// class on which the method is being called.
// In the 'makeSound' method, 
// 'this.name' and 'this.sound' refer to the 'name' and 'sound' 
// properties of the specific instance of the 'Animal1' 
// class that is calling the method.
// This allows the method to access and 
// use the properties of the instance to perform its functionality, such as printing a message that includes the name and sound of the animal.


//parameter properties are a shorthand syntax in
//  TypeScript that allows you to declare and
//  initialize class properties directly in the constructor parameters.
// This can make your code more concise and easier to read.
class Animal2 {
    constructor(public name: string, public species: string, public sound: string) {
        // The 'public' keyword in the constructor parameters automatically creates and initializes the class properties.
    }
    makeSound() {
        console.log(`${this.name} says ${this.sound}`);
    }
}
const dog2 = new Animal2("Buddy", "Dog", "Woof");
dog2.makeSound(); // Output: Buddy says Woof

const cat2 = new Animal2("Whiskers", "Cat", "Meow");
cat2.makeSound(); // Output: Whiskers says Meow

// In this example, the 'public' keyword in the constructor parameters automatically creates and initializes the 'name', 'species', and 'sound' properties of the 'Animal2' class. 
// This eliminates the need for explicit property declarations and assignments within the constructor, making the code more concise and easier to read.
