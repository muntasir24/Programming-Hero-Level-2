type genericArray<T> = Array<T>;

type user = {
  name: string;
  age: number;
};

const userList: genericArray<user> = [
  {
    name: "John Doe",
    age: 30,
  },
  {
    name: "Jane Doe",
    age: 28,
  },
];

const numberList: genericArray<number> = [1, 2, 3, 4, 5];

console.log(userList);
console.log(numberList);

// now witth interface

interface Developer<T> {
  name: string;
  salary: number;
  device: {
    brand: string;
    model: string;
    releaseYear: string;
  };
    smartWatch: T;
}


const poorDeveloper: Developer<{
    brand: string;
    heartRateMonitor: boolean;
    stopWatch: boolean;
}> = {
    name: "John Doe",
    salary: 20,
    device: {
        brand: "Lenevo",
        model: "ThinkPad X1 Carbon",
        releaseYear: "2020",
    },
    smartWatch: {
        brand: "Xiaomi",
        heartRateMonitor: true,
        stopWatch: false,
    },
}

const richDeveloper: Developer<{
    brand: string;
    stopWatch: boolean;
    gps: boolean;
}> = {
    name: "Jane Doe",
    salary: 200,
    device: {
        brand: "Apple",
        model: "MacBook Pro",
        releaseYear: "2021",
    },
    smartWatch: {
        brand: "Apple",
        stopWatch: true,
        gps: true,
    },
}

console.log(poorDeveloper);
console.log(richDeveloper);
// In this example, we have defined a generic interface `Developer` that takes a type parameter `T`. This allows us to create different types of developers with varying smart watch properties. The `poorDeveloper` has a basic smart watch, while the `richDeveloper` has a more advanced smart watch with additional features.


// we can clear this code by defining a separate interface for the smart watch properties and then using it in the `Developer` interface.

interface SmartWatch {
    brand: string;
    heartRateMonitor: boolean;
    stopWatch: boolean;
    gps?: boolean; // Optional property
}

interface Developer1<T> {
    name: string;
    salary: number;
    device: {
        brand: string;
        model: string;
        releaseYear: string;
    };
    smartWatch: T;
}

const poorDeveloper1: Developer1<SmartWatch> = {
    name: "John Doe",
    salary: 20,
    device: {
        brand: "Lenevo",
        model: "ThinkPad X1 Carbon",
        releaseYear: "2020",
    },
    smartWatch: {
        brand: "Xiaomi",
        heartRateMonitor: true,
        stopWatch: false,
    },
}

const richDeveloper1: Developer<SmartWatch> = {
    name: "Jane Doe",
    salary: 200,
    device: {
        brand: "Apple",
        model: "MacBook Pro",
        releaseYear: "2021",
    },
    smartWatch: {
        brand: "Apple",
        heartRateMonitor: true,
        stopWatch: true,
        gps: true,
    },
}


// In this refactored code, we have defined a separate `SmartWatch` interface that includes all the properties related to the smart watch. The `Developer` interface now uses this `SmartWatch` interface as its type parameter, making the code cleaner and more maintainable.