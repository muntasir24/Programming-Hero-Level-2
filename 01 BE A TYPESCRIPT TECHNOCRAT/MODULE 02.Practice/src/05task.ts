// The problem was that <T> alone allows ANY type of data to be passed in,
// including numbers, objects, or booleans which do not have a .length property.
// By adding `extends { length: number }`, we CREATE A CONSTRAINT.
// Now, TypeScript will strictly check at compile time if the argument passed actually has a length property!

const logLength = <T extends { length: number }>(input: T): number => {
  return input.length;
};

console.log(logLength("hello")); // ✅ Works string has length property
console.log(logLength([1, 2, 3])); // ✅ Works arrays have length property

// console.log(logLength(2));
// ❌ ERROR: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'
