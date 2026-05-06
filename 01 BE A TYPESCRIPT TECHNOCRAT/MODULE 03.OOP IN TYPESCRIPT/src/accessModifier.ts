// access modifiers in TypeScript
// access modifiers are used to control the visibility of class members (properties and methods) in TypeScript.
// there are three access modifiers in TypeScript: public, private, and protected.

// public: members marked as public can be accessed from anywhere, both inside and outside the class. By default

// all members of a class are public if no access modifier is specified.
// in c++ and java, we have to explicitly specify the access modifier for each member of the class, but in TypeScript, we can omit the access modifier and it will be considered as public by default.
// all memmbers in c++ and java are private by default, but in TypeScript, all members are public by default.

class BankAccount {
    userId: number;
    userName: string;
    userBalance: number;

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
console.log(account1.userId); // Output: 1
console.log(account1.userName); // Output: Alice
console.log(account1.userBalance); // Output: 1000

// in the above example, we have a class BankAccount with three properties: 
// userId, userName, and userBalance. We have also defined a method 
// displayBalance() that displays the balance of the user. 
// Since we have not specified any access modifiers for 
// the properties and method,
//  they are all public by default,
//  which means we can access them from outside the class as well.
// for example, we can access the properties userId, userName, and userBalance directly from the instance of the class account1, and we can also call the method displayBalance() to display the balance of the user.

class BankAccountPrivate {
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

const account2 = new BankAccountPrivate(2, "Bob", 2000);
account2.displayBalance(); // Output: User Bob has a balance of 2000
// console.log(account2.userId); // Error: Property 'userId' is private and only accessible within class 'BankAccountPrivate'.
// console.log(account2.userName); // Error: Property 'userName' is private and only accessible within class 'BankAccountPrivate'.
// console.log(account2.userBalance); // Error: Property 'userBalance' is private and only accessible within class 'BankAccountPrivate'.

// in the above example, we have a class BankAccountPrivate with three properties: userId, userName, and userBalance. We have also defined a method displayBalance() that displays the balance of the user. Since we have marked the properties as private, they can only be accessed within the class BankAccountPrivate. This means that we cannot access the properties userId, userName, and userBalance directly from outside the class, and if we try to do so, we will get a compile-time error. However, we can still call the method displayBalance() to display the balance of the user, since it is a public method.

// in addition to public and private access modifiers, TypeScript also has a protected access modifier, which allows members to be accessed within the class and its subclasses, but not from outside the class hierarchy. This is useful when we want to allow access to certain members for subclasses, but we want to prevent access from outside the class hierarchy.


// we also need to readonly properties in TypeScript, which are properties that can only be assigned a value once, either at the time of declaration or in the constructor of the class.
// once a readonly property is assigned a value, it cannot be changed or reassigned later in the code. This is useful for properties that should not be modified after they are initialized, such as an ID or a constant value.

class User {
    readonly userId: number;
    userName: string;

    constructor(userId: number, userName: string) {
        this.userId = userId;
        this.userName = userName;
    }
}

const user1 = new User(1, "Alice");
console.log(user1.userId); // Output: 1
console.log(user1.userName); // Output: Alice

// trying to reassign a value to a readonly property will result in a compile-time error.
// user1.userId = 2; // Error: Cannot assign to 'userId' because it is a read-only property.

// in the above example, we have a class User with a readonly property userId and a regular property userName. We can assign a value to the readonly property userId in the constructor of the class, but we cannot reassign it later in the code. If we try to reassign a value to userId, we will get a compile-time error.
//anyway, readonly properties are useful for ensuring that certain values remain constant throughout the lifecycle of an object, and they can help prevent accidental modifications to important data.


// if we want to add balance we cant modify 
// the userBalance property directly, 
// since it is private, but we can add a method to the class BankAccount

class BankAccountWithDeposit {
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

    deposit(amount: number) {
        if (amount > 0) {
            this.userBalance += amount;
            console.log(`Deposited ${amount}. New balance is ${this.userBalance}`);
        } else {
            console.log("Deposit amount must be positive.");
        }
    }
}

const account3 = new BankAccountWithDeposit(3, "Charlie", 3000);
account3.displayBalance(); // Output: User Charlie has a balance of 3000
account3.deposit(500); // Output: Deposited 500. New balance is 3500
account3.deposit(-100); // Output: Deposit amount must be positive.

// in the above example, we have a class BankAccountWithDeposit 
// with a private property userBalance
//  and a public method deposit()
//  that allows us to add money to the user's balance.
//  Since userBalance is private,
//  we cannot modify it directly from outside the class, but we can modify
//  it indirectly through the deposit() method, 
// which checks if the deposit amount is positive
//  before adding it to the balance. This way, 
// we can control how the balance is modified and 
// ensure that it remains consistent with the rules of our application.

// protected access modifier allows members to be accessed within 
// the class and its subclasses, but not from outside the class hierarchy.

class BankAccount1{
    public readonly accountNumber: number;
    protected balance: number;

    constructor(accountNumber: number, balance: number) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    displayBalance() {
        console.log(`Account ${this.accountNumber} has a balance of ${this.balance}`);
    }
    setBalance(amount: number) {
        if (amount >= 0) {
            this.balance = amount;
            console.log(`Balance updated to ${this.balance}`);
        } else {
            console.log("Balance cannot be negative.");
        }
    }   
}

//protected is used cause we want to allow access to the balance property
//  for subclasses of BankAccount1, 
// but we want to prevent access from outside the class hierarchy.
//  This way, we can ensure that the balance is only modified through 
// controlled methods like setBalance(),
//  and we can also allow subclasses to implement
//  their own logic for modifying the balance if needed.

class StudentAccount extends BankAccount1 {
    constructor(accountNumber: number, balance: number) {
        super(accountNumber, balance);
    }

    applyStudentDiscount() {
        this.balance *= 0.9; // Apply a 10% discount to the balance
        console.log(`Student discount applied. New balance is ${this.balance}`);
    }
}

const studentAccount = new StudentAccount(12345, 1000);
studentAccount.displayBalance(); // Output: Account 12345 has a balance of 1000
studentAccount.applyStudentDiscount(); // Output: Student discount applied. New balance is 900
studentAccount.setBalance(800); // Output: Balance updated to 800
studentAccount.displayBalance(); // Output: Account 12345 has a balance of 800

// in the above example, we have a class BankAccount1 with a protected property balance and a public method setBalance() that allows us to update the balance. We also have a subclass StudentAccount that extends BankAccount1