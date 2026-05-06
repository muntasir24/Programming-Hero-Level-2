//encapsulation is the concept of hiding the internal details of an object and only exposing a public interface for interacting with it. In TypeScript, we can achieve encapsulation using access modifiers such as private, protected, and public.

class BankAccount {
    private userId: number;
    private userName: string;
    private userBalance: number;

    constructor(userId: number, userName: string, userBalance: number) {
        this.userId = userId;
        this.userName = userName;
        this.userBalance = userBalance;
    }

    displayBalance() {
        console.log(`User ${this.userName} has a balance of ${this.userBalance}`);
    }       
}

const account1 = new BankAccount(1, "Alice", 1000);
account1.displayBalance(); // Output: User Alice has a balance of 1000
// console.log(account1.userId); // Error: Property 'userId' is private and only accessible within class 'BankAccount'.
// console.log(account1.userName); // Error: Property 'userName' is private and only accessible within class 'BankAccount'.
// console.log(account1.userBalance); // Error: Property 'userBalance' is private and only accessible within class 'BankAccount'.

// In this example, we have a class `BankAccount` with three private properties: `userId`, `userName`, and `userBalance`. We have also defined a method `displayBalance()` that displays the balance of the user. Since the properties are marked as private, they cannot be accessed directly from outside the class. This means that we can only interact with the `BankAccount` class through its public interface (the `displayBalance()` method), which helps to protect the internal state of the object and maintain encapsulation.

//protected access modifier allows us to access the members of a class within the class itself and its subclasses, but not from outside the class. This is useful when we want to allow access to certain members of a class for its subclasses, but we want to prevent access from outside the class.

class BankAccountProtected {
    protected userId: number;
    protected userName: string;
    protected userBalance: number;

    constructor(userId: number, userName: string, userBalance: number) {
        this.userId = userId;
        this.userName = userName;
        this.userBalance = userBalance;
    }

    displayBalance() {
        console.log(`User ${this.userName} has a balance of ${this.userBalance}`);
    }       
}

class StudentAccount extends BankAccountProtected { 
    private studentId: number;
    private discount: number;
    constructor(userId: number, userName: string, userBalance: number, studentId: number, discount: number  ) {
        super(userId, userName, userBalance);
        this.studentId = studentId;
        this.discount = discount;
    }
    displayBalance() {
        const discountedBalance = this.userBalance - (this.userBalance * this.discount);
        console.log(`Student ${this.userName} has a discounted balance of ${discountedBalance}`);
    }
}

const studentAccount1 = new StudentAccount(2, "Bob", 1000, 12345, 0.1);
studentAccount1.displayBalance(); // Output: Student Bob has a discounted balance of 900
// console.log(studentAccount1.userId); // Error: Property 'userId' is protected and only accessible within class 'BankAccountProtected' and its subclasses.
// console.log(studentAccount1.userName); // Error: Property 'userName' is protected and only accessible within class 'BankAccountProtected' and its subclasses.
// console.log(studentAccount1.userBalance); // Error: Property 'userBalance' is protected and only accessible within class 'BankAccountProtected' and its subclasses.

// In this example, we have a class `BankAccountProtected` with three protected properties: `userId`, `userName`, and `userBalance`. We have also defined a method `displayBalance()` that displays the balance of the user. We then create a subclass `StudentAccount` that extends `BankAccountProtected` and adds two additional properties: `studentId` and `discount`. The `displayBalance()` method in the `StudentAccount` class overrides the method in the parent class to calculate a discounted balance for the student. Since the properties in the parent class are marked as protected, they can be accessed within the `StudentAccount` class, but they cannot be accessed directly from outside the class. This allows us to maintain encapsulation while still allowing access to certain members of the class for its subclasses.