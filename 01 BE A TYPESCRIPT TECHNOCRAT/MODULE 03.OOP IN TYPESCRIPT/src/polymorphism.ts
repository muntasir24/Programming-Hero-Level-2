//polymorphism is the ability of an object to take on many forms. It allows us to use a single interface to represent different types of objects. In TypeScript, we can achieve polymorphism through inheritance and interfaces.
class Person {
  getSleepHours(): number {
    return 8; // Default sleep hours for a person
  }
}

class Student extends Person {
     getSleepHours(): number {
    return 6; // Students typically sleep less
  }
}

class Teacher extends Person {
     getSleepHours(): number {
    return 7; // Teachers typically sleep a bit more than students
  }
}
    

const person =new Person();
const student = new Student();
const teacher = new Teacher();

console.log(`Person sleeps for ${person.getSleepHours()} hours.`);
console.log(`Student sleeps for ${student.getSleepHours()} hours.`);
console.log(`Teacher sleeps for ${teacher.getSleepHours()} hours.`);

// In this example, we have a base class `Person` with a method `getSleepHours()`. The `Student` and `Teacher` classes inherit from `Person` and override the `getSleepHours()` method to provide their specific implementations. This demonstrates polymorphism, as we can call the same method on different types of objects and get different results based on their specific implementations.

const getSleepHoursForPerson = (param: Person) => {
    console.log(`Person sleeps for ${param.getSleepHours()} hours.`);

}

getSleepHoursForPerson(person); // Output: Person sleeps for 8 hours.
getSleepHoursForPerson(student); // Output: Person sleeps for 6 hours.
getSleepHoursForPerson(teacher); // Output: Person sleeps for 7 hours.

// In this example, we have a function `getSleepHoursForPerson` that takes a parameter of type `Person`. We can pass in any object that is an instance of `Person` or its subclasses (like `Student` and `Teacher`), and the function will call the appropriate `getSleepHours()` method based on the actual type of the object passed in. This is another demonstration of polymorphism, as the same function can work with different types of objects and produce different results based on their specific implementations.


class shape {
    area(): number {
        return 0; // Default area for a shape
    }
}

class CircleShape extends shape {
    radius: number;

    constructor(radius: number) {
        super();
        this.radius = radius;
    }
    // we cant write
    // area(radius: number): number {
    //     return Math.PI * radius * radius; // Area of a circle
    // }    
    //because the structure of the method is different from the parent class,
    //  it will not be able to override the method of
    //  the parent class and we will not be able to achieve polymorphism.
    area(): number {
        return Math.PI * this.radius * this.radius; // Area of a circle
    }
    // both structure should be same for polymorphism to work, 
    // if we change the structure of the child class, 
    // it will not be able to override the method 
    // of the parent class and we will not be able to achieve polymorphism.
}

class RectangleShape extends shape {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        super(); //using this allows us to call the constructor 
        // of the parent class (shape) and initializ'e
        //  any properties or perform any setup that is
        //  defined in the parent class before executing
        // the code in the child class's constructor.
        //like in this case, we are calling the constructor of the shape class
        // , which does not have any properties
        // or setup, but it is still
        // a good practice to call super()
        //  in the constructor of the child class
        //  to ensure that any necessary initialization
        // from the parent class is performed.
        //by using super we got methods and properties of the parent class
        //  in the child class, which is area() method in this case,
        //  and we can override it in the child 
        // class to provide specific implementation for
        //  calculating the area of a rectangle.
        this.width = width;
        this.height = height;
    }

    area(): number {
        return this.width * this.height; // Area of a rectangle
    }
}

const circle = new CircleShape(5);
const rectangle = new RectangleShape(4, 6);

console.log(`Area of the circle: ${circle.area()}`); // Output: Area of the circle: 78.53981633974483
console.log(`Area of the rectangle: ${rectangle.area()}`); // Output: Area of the rectangle: 24

// In this example, we have a base class `shape` 
// with a method `area()`.
// ] The `CircleShape` and `RectangleShape` classes
//  inherit from `shape` and override the `area()` 
// method to provide their specific implementations
//  for calculating the area of a circle and a rectangle,
//  respectively. This demonstrates polymorphism,
//  as we can call the same method on different
//  types of shapes and get different 
// results based on their specific implementations.

const calculateArea = (shape: shape) => {
    console.log(`Area: ${shape.area()}`);
}

calculateArea(circle); // Output: Area: 78.53981633974483
calculateArea(rectangle); // Output: Area: 24

// In this example, we have a function `calculateArea` that takes a parameter of type `shape`. We can pass in any object that is an instance of `shape` or its subclasses (like `CircleShape` and `RectangleShape`), and the function will call the appropriate `area()` method based on the actual type of the object passed in. This is another demonstration of polymorphism, as the same function can work with different types of objects and produce different results based on their specific implementations.