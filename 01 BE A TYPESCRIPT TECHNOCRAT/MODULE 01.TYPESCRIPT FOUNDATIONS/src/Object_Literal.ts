const user = {
    firstName: "Aziz",
    lastName: "Muntasir",
    age: 26,
    isAdmin: true,
    hobbies: ["reading", "gaming", "coding"],
    address: {
        street: "123 Main St",
        city: "Anytown",
        country: "USA"
    }
}

// while hover ts auto detect it 
// const user: {
//   firstName: string;
//   lastName: string;
//   age: number;
//   isAdmin: boolean;
//   hobbies: string[];
//   address: {
//     street: string;
//     city: string;
//     country: string;
//   };
// };


const user1: {
    university :"Netrokona University" //value as a type, literal
readonly Dept :string, //access modifier
    firstName: string,
    middleName?: string, //optional type
    lastName:string
} = {
    firstName: "Aziz",
    lastName:"Muntasir"
}



