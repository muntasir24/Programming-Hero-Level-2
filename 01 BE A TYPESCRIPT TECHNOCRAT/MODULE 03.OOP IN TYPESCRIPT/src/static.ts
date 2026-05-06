//when we use static keyword in a class, it means that the property
//  or method belongs to the class itself rather than to instances of the class.
//means it references the class itself, not the instance of the class.
// in memory, static members are shared among all instances of the class, and they can be accessed without creating an instance of the class.
//for example, we can use static properties to store values that are common to all instances of a class, such as a counter for the number of instances created. We can also use static methods to perform operations that are related to the class itself, rather than to individual instances.

class Counter {
  count: number = 0;

  increment() {
    return ++this.count;
  }
  decrement() {
    return --this.count;
  }
}

const instance1 = new Counter(); //memory allocated for instance1 say 0x1234
instance1.increment(); // 1
instance1.increment(); // 2

const instance2 = new Counter(); //memory allocated for instance2 say 0x5678
instance2.increment(); // 1
instance2.increment(); // 2
instance2.decrement(); // 1

//two memory locations 0x1234 and 0x5678 are allocated for instance1 and instance2 respectively, and each instance has its own count property that is independent of the other instance's count property.
// In this example, each instance of the Counter
// class has its own count property,
//  and the increment and decrement methods
//  operate on that property.
// If we were to make the count property static,
// it would be shared among all instances of the class,
//  and incrementing it in one instance would affect all other instances.

// we want to create a instance that can take data from same memory
// location, we can use static keyword to achieve that.

class CounterStatic {
  static count: number = 0;

  static increment() {
    return ++CounterStatic.count;
    // we can also use this keyword to access the static property,
    // but it is not recommended because it can lead to confusion and errors. Instead, it is better to access static properties and methods using the class name, as shown in the example above.
  }
  static decrement() {
    return --CounterStatic.count;
  }
}

const instance3 = new CounterStatic(); //memory allocated for instance3 say 0x1234
// ❌ WRONG WAY: Cannot access static members from instances in TypeScript!
// instance3.increment(); // Error: Property 'increment' does not exist on type 'CounterStatic'.

// ✅ CORRECT WAY: We call the static methods directly on the Class itself!
console.log(CounterStatic.increment()); // Output: 1
console.log(CounterStatic.increment()); // Output: 2

const instance4 = new CounterStatic(); //memory allocated for instance4 say 0x5678
console.log(CounterStatic.increment()); // Output: 3
console.log(CounterStatic.increment()); // Output: 4
console.log(CounterStatic.decrement()); // Output: 3

// In this example, the `count` property and `increment`/`decrement` methods
// belong to the `CounterStatic` Class itself, NOT to any individual instance.
// Whenever we call `CounterStatic.increment()`, it modifies the same global `count`
// property. The changes are universally shared. all instances of the CounterStatic class.


// we can also use static properties and methods to create utility functions that are related to the class but do not require an instance of the class to be created. For example, we can create a static method to calculate the area of a circle given its radius:

class Circle {
  static calculateArea(radius: number): number {
    return Math.PI * radius * radius;
  }
}

console.log(Circle.calculateArea(5)); // Output: 78.53981633974483

// In this example, the `calculateArea` method is a static method that can be called directly on the `Circle` class without needing to create an instance of the class. This is useful for utility functions that are related to the class but do not require any instance-specific data.

