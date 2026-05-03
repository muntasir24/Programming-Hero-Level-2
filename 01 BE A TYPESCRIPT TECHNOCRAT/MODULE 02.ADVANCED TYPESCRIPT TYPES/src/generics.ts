//dynamically generating types based on the input type

//lets define some array

// const friends: string[] = ["Alice", "Bob", "Charlie"];
// ir can be written as constructing a generic type
const friends: Array<string> = ["Alice", "Bob", "Charlie"];
// const rollNumbers: number[] = [1, 2, 3, 4, 5];
const rollNumbers: Array<number> = [1, 2, 3, 4, 5];

// const isEligibleList: boolean[] = [true, false, true, true];
const isEligibleList: Array<boolean> = [true, false, true, true];


type GenericArray=Array<string|number|boolean>

const mixedArray: GenericArray = ["Alice", 1, true, "Bob", 2, false];

type myarray<T> = Array<T>

const stringArray: myarray<string> = ["Alice", "Bob", "Charlie"];
const numberArray: myarray<number> = [1, 2, 3, 4, 5];
const booleanArray: myarray<boolean> = [true, false, true, true];

const coordinates: myarray<{ x: number; y: number }> = [
  { x: 1, y: 2 },
  { x: 3, y: 4 },
  { x: 5, y: 6 },
];

printCoordinates(coordinates);

function printCoordinates(coords: myarray<{ x: number; y: number }>) {
  coords.forEach((coord) => {
    console.log(`x: ${coord.x}, y: ${coord.y}`);
  });
}


//generics with array of objects
const userList:myarray<{name:string,age:number}>=[
    {name:"Alice",age:25},
    {name:"Bob",age:40},
  
]