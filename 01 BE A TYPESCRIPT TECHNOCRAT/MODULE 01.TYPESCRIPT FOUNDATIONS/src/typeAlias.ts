type User = {
  id: number;
  name: {
    firstName: string;
    lastname: string;
  };
  gender: "male" | "female";
};


const user1:User  = {
    id: 123,
    name: {
        firstName: 'mr',
        lastname:'x'
    },
    gender:'male'
}

// for function

type AddFunc = (num1: number, num2: number) => number;

const add: AddFunc = (num1, num2) => num1 + num2;