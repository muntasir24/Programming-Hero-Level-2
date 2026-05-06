//instanceof operator is used to check if an object is an instance of a class or not.
// it returns true if the object is an instance of the class, otherwise it returns false.

class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Student extends Person {
  studentId: number;
  constructor(name: string, studentId: number) {
    super(name);
    this.studentId = studentId;
  }
}

const student1 = new Student("Alice", 101);
console.log(student1 instanceof Student); // Output: true
console.log(student1 instanceof Person); // Output: true
console.log(student1 instanceof Object); // Output: true

class Teacher extends Person {
  constructor(name: string) {
    super(name);
  }

  takeAttendance() {
    console.log(`${this.name} is taking attendance.`);
  }
}

const teacher1 = new Teacher("Mr. Smith");
console.log(teacher1 instanceof Teacher); // Output: true
console.log(teacher1 instanceof Person); // Output: true
console.log(teacher1 instanceof Object); // Output: true

const getUserInfo = (user: Person) => {
  if (user instanceof Student) {
    console.log(`${user.name} is a student.`);
  } else if (user instanceof Teacher) {
    console.log(`${user.name} is a teacher.`);
  } else {
    console.log(`${user.name} is a person.`);
  }
};

getUserInfo(student1); // Output: Alice is a student.
getUserInfo(teacher1); // Output: Mr. Smith is a teacher.

//user receives an object of type Person,
//but it does not know if it is a Student or a Teacher, so we can use instanceof operator to check the type of the object and perform the appropriate action.
//it is helpful when we have a function that accepts a parameter of a base class type, but we want to perform different actions based on the actual type of the object passed to the function.

// function guard

const isStudent = (user: Person): user is Student => {
  return user instanceof Student;
};

//function guard returns a boolean value indicating whether
// the user is an instance of the Student class or not.
// this works by using the instanceof operator to check
// if the user is an instance of the Student class.
// and the return type of the function is a type predicate,
//  which tells TypeScript that if the function returns true,
// then the user is of type Student.
// user is Student is as like saying if the function returns true,
// then the user is of type Student, otherwise it is of type Person.
const isTeacher = (user: Person): user is Teacher => {
  return user instanceof Teacher;
};

const getUserInfoWithGuard = (user: Person) => {
  if (isStudent(user)) {
    console.log(`${user.name} is a student.`);
  } else if (isTeacher(user)) {
    console.log(`${user.name} is a teacher.`);
  } else {
    console.log(`${user.name} is a person.`);
  }
};

getUserInfoWithGuard(student1); // Output: Alice is a student.
getUserInfoWithGuard(teacher1); // Output: Mr. Smith is a teacher.
