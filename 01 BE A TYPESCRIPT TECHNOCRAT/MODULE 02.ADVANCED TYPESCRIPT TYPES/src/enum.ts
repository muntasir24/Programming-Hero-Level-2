// enum
//set of fixed string literals or numeric values are
// grouped together under a single name
// enums are used to define a set of named constants

// numeric enums
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// string enums
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

type UserRole = "admin" | "editor" | "viewer";

const canEdit = (role: UserRole) => {
  if (role === "admin" || role === "editor") {
    return true;
  }
  return false;
};

console.log(canEdit("admin")); // true
console.log(canEdit("viewer")); // false

// enums are useful when you have a fixed set of values that you want to represent
// they can be used to improve code readability and maintainability

enum UserRoleEnum {
  Admin = "admin",
  Editor = "editor",
  Viewer = "viewer",
}
const canEditEnum = (role: UserRoleEnum) => {
  if (role === UserRoleEnum.Admin || role === UserRoleEnum.Editor) {
    return true;
  }
  return false;
};

console.log(canEditEnum(UserRoleEnum.Admin)); // true
console.log(canEditEnum(UserRoleEnum.Viewer)); // false

//but senior developers prefer to use union types instead of enums because they are more flexible and easier to maintain
// also in js enums are not supported natively, they are transpiled to objects which can lead to performance issues and increased bundle size
// so we will use as const we will explore later
