//mapped types

const arrOfNumbers: number[] = [1, 2, 3, 4, 5];

const arrOfStrings: string[] = ["a", "b", "c", "d", "e"];

const arrayOfStringUsingMap: string[] = arrOfNumbers.map((num) =>
  num.toString(),
);

console.log(arrayOfStringUsingMap);

type areaOfNum = {
  width: number;
  height: number;
};

type height = areaOfNum["height"];

type areaOfString = {
  width: string;
  height: string;
};

type areaOfStringUsingMappedType = {
  // [k in "height" | "width"]: string
  //k will be either height or width and the value will be string
  [k in keyof areaOfNum]: string;
};

type areaOfBooleanUsingMappedType = {
  [k in keyof areaOfNum]: boolean;
};

// we can use generics to make it more reusable

type areaOfType<T> = {
  [k in keyof areaOfNum]: T;
};

type areaOfStringUsingGenericMappedType = areaOfType<string>;

type areaOfBooleanUsingGenericMappedType = areaOfType<boolean>;

// we can also use mapped types to make all properties optional or required

