# Assignment: Advanced Problem Solving with TypeScript & OOP

This assignment comprises various problems that demonstrate fundamental TypeScript concepts, including data typing, interfaces for objects, class usage with inheritance, type checking, and manipulation of data structures. The solutions aim to showcase efficient and clear problem-solving techniques using TypeScript, adhering to best coding practices.

## 💻 Problem Solving (50 Marks)

All coding solutions must be implemented in a single file named `solutions.ts`.

### Problem 1:
Create a TypeScript function `filterEvenNumbers` that accepts an array of numbers and returns a new array containing only the even numbers.

```typescript
// Sample Input:
filterEvenNumbers([1, 2, 3, 4, 5, 6])

// Sample Output:
// [2, 4, 6]
```

### Problem 2:
Write a function `reverseString` that takes a string as input and returns the reversed version of that string.

```typescript
// Sample Input:
reverseString("typescript");

// Sample Output:
// "tpircsepyt";
```

### Problem 3:
Define a union type `StringOrNumber` and create a function `checkType` that uses type guards to return "String" if the input is a string or "Number" if the input is a number.

```typescript
// Sample Input 1:
checkType("Hello");

// Sample Output 1:
// "String";

// Sample Input 2:
checkType(42);

// Sample Output 2:
// "Number";
```

### Problem 4:
Write a generic function `getProperty` that takes an object and a key, then returns the value of that key. Use constraints to ensure the key exists on the object.

```typescript
// Sample Input:
const user = { id: 1, name: "John Doe", age: 21 };
getProperty(user, "name");

// Sample Output:
// "John Doe";
```

### Problem 5:
Define an interface `Book` with properties `title`, `author`, and `publishedYear`. Create a function `toggleReadStatus` that accepts a `Book` object and returns a new object with an added `isRead` property (boolean), defaulting to `true`.

```typescript
// Sample Input:
const myBook = { title: "TypeScript Guide", author: "Jane Doe", publishedYear: 2024 };
toggleReadStatus(myBook);

// Sample Output:
// {
//   title: "TypeScript Guide",
//   author: "Jane Doe",
//   publishedYear: 2024,
//   isRead: true
// }
```

### Problem 6:
Create a class `Person` with a `name` and `age`. Then, create a subclass `Student` that adds a `grade` property. Include a method `getDetails` in the `Student` class that returns a string with the student's name, age, and grade.

```typescript
// Sample Input:
const student = new Student("Alice", 20, "A");
student.getDetails();

// Sample Output:
// "Name: Alice, Age: 20, Grade: A";
```

### Problem 7:
Create a function `getIntersection` that takes two arrays of numbers and returns a new array containing only the elements that are present in both arrays.

```typescript
// Sample Input:
getIntersection([1, 2, 3, 4, 5], [3, 4, 5, 6, 7])

// Sample Output:
// [3, 4, 5]
```