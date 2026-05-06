// Problem 1:

const filterEvenNumbers = (arr: number[]): number[] => {
  return arr.filter((num) => num % 2 === 0);
};

// Problem 2:
const reverseString = (s: string): string => {
  return s.split("").reverse().join("");
};

//Problem 3:
type StringOrNumber = string | number;

const checkType = (param: StringOrNumber): string => {
  if (typeof param === "string") return "String";
  else if (typeof param === "number") return "Number";
  return "Unknown Type";
};

//Problem 4:
const getProperty = <T, K extends keyof T>(obj: T, key: K): T[K] => {
  return obj[key];
};

// Problem 5:
interface Book {
  title: string;
  author: string;
  publishedYear: number;
}

const toggleReadStatus = (obj: Book): Book & { isRead: boolean } => {
  return {
    ...obj,
    isRead: true,
  };
};

//Problem 6:
class Person {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

class Student extends Person {
  grade: string;
  constructor(name: string, age: number, grade: string) {
    super(name, age);
    this.grade = grade;
  }
  getDetails(): string {
    return `Name: ${this.name}, Age: ${this.age}, Grade: ${this.grade}`;
  }
}

// Problem 7:
const getIntersection = (arr1: number[], arr2: number[]): number[] => {
  return arr1.filter((x) => arr2.includes(x));
};
