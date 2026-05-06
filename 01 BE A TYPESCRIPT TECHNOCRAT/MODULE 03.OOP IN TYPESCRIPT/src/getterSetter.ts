//getter and setter in typescript

// getter and setter are used to access and modify the properties of an object. They are defined using the get and set keywords respectively.
class BankAccount {
    private _balance: number;

    constructor(initialBalance: number) {
        this._balance = initialBalance;
    }

    // getter for balance
    get balance(): number {
        return this._balance;
    }

    // setter for balance
    set balance(amount: number) {
        if (amount < 0) {
            console.log("Balance cannot be negative.");
        } else {
            this._balance = amount;
        }
    }
}

const account = new BankAccount(1000);
console.log(account.balance); // Output: 1000

account.balance = 1500; // Update balance using setter
console.log(account.balance); // Output: 1500

account.balance = -500; // Attempt to set a negative balance
console.log(account.balance); // Output: 1500 (balance remains unchanged)   

account.balance = 2000; // Update balance using setter
console.log(account.balance); // Output: 2000   

// get balance with password
class SecureBankAccount {
    private _balance: number;
    private _password: string;

    constructor(initialBalance: number, password: string) {
        this._balance = initialBalance;
        this._password = password;
    }

    // getter for balance with password
    get balance(): number | string {
        return "Please provide a password to access the balance.";
    }

    // method to get balance with password
    getBalance(password: string): number | string {
        if (password === this._password) {
            return this._balance;
        } else {
            return "Incorrect password. Access denied.";
        }
    }

    // setter for balance
    set balance(amount: number) {
        if (amount < 0) {
            console.log("Balance cannot be negative.");
        } else {
            this._balance = amount;
        }
    }
}

const secureAccount = new SecureBankAccount(2000, "mySecretPassword");
console.log(secureAccount.balance); // Output: Please provide a password to access the balance.
console.log(secureAccount.getBalance("wrongPassword")); // Output: Incorrect password. Access denied.
console.log(secureAccount.getBalance("mySecretPassword")); // Output: 2000

secureAccount.balance = 2500; // Update balance using setter

// this used in real life softawre development
class User {
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    set name(newName: string) {
        if (newName.trim() === "") {
            console.log("Name cannot be empty.");
        } else {
            this._name = newName;
        }
    }
}

const user = new User("Alice");
console.log(user.name); // Output: Alice

user.name = "Bob"; // Update name using setter
console.log(user.name); // Output: Bob

user.name = ""; // Attempt to set an empty name
console.log(user.name); // Output: Bob (name remains unchanged) 

//another example of getter and setter in typescript in softawre development
class Product {
    private _price: number;

    constructor(price: number) {
        this._price = price;
    }

    get price(): number {
        return this._price;
    }

    set price(newPrice: number) {
        if (newPrice < 0) {
            console.log("Price cannot be negative.");
        } else {
            this._price = newPrice;
        }
    }
}

const product = new Product(100);
console.log(product.price); // Output: 100

product.price = 150; // Update price using setter
console.log(product.price); // Output: 150

product.price = -50; // Attempt to set a negative price
console.log(product.price); // Output: 150 (price remains unchanged)    

// oop concept help in softawre development by providing a way to 
// structure code in a way that is easy to understand and maintain.
//  It allows developers to create reusable code and to model 
// real-world entities in a way that is intuitive. 
// Getter and setter are an important part of OOP as
//  they provide a way to control access to the properties 
// of an object, ensuring that the data is valid and consistent.