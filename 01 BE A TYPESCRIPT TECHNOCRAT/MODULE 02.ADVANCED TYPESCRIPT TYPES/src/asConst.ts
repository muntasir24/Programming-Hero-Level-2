
// enum userRoles {
//   Admin = "admin",
//   Editor = "editor",
//   Viewer = "viewer",
// }

const userRoles = {
    Admin: "ADMIN",
    Editor: "EDITOR",
    Viewer: "viewer"
} as const; // this will make the object immutable and prevent any changes to its properties
// userRoles.Admin = "anything"; // "admin"
//objects are mutable and can be changed at runtime, which can lead to bugs and security issues if not handled properly so need to use const to make it immutable and prevent any changes to its properties


/*
it use readonly properties and literal types to create a type that represents the exact values of the object, rather than just the shape of the object. This allows for better type safety and can help catch errors at compile time.
readonly Admin: "admin";
readonly Editor: "editor";
readonly Viewer: "viewer";

1.typeof operator used in runtime to get the type of a variable or expression, while as const is a TypeScript feature that allows you to create a type that represents the exact values of an object or array.

//say i have a user with two property
const user = {
    id: 1,
    name: "John",
    
} 
  typeof user; // { id: number; name: string; }
  behind the scenes, TypeScript will infer the type of user as { id: number; name: string; } based on the values assigned to the properties. This means that if we try to assign a different type of value to either of the properties, TypeScript will throw an error.
   so we can use in userRoles

   typeof userRoles; // { Admin: "admin"; Editor: "editor"; Viewer: "viewer"; }
   this will give us the type of userRoles which is { Admin: "admin"; Editor: "editor"; Viewer: "viewer"; } 
   and it become  string literal type which is more specific than just string, it will only allow the values "admin", "editor" and "viewer" to be assigned to the properties of userRoles, and any other value will throw an error at compile time.

   if i write
    keyof typeof userRoles;
    keyof operator is used to get the keys of an object type as a union of string literal types,
     so in this case it will give us "Admin" | "Editor" | "Viewer" 

    see the process step by step

    1. typeof userRoles; // { Admin: "ADMIN"; Editor: "EDITOR"; Viewer: "viewer"; }
    2. keyof typeof userRoles; // "Admin" | "Editor" | "Viewer"
     this will give us a union type of the keys of the userRoles object, which can be used to create a type that represents the possible values of the userRoles object. This is useful for creating types that are more specific and can help catch errors at compile time.    

keyof typeof userRoles; 
// "Admin" | "Editor" | "Viewer"
values are "ADMIN", "EDITOR", "viewer"

UserRoles['Admin']; // "ADMIN"
UserRoles['Editor']; // "EDITOR"
UserRoles['Viewer']; // "viewer"
so we can use the values of the userRoles object to create a type that represents the possible values of the userRoles object, which can be used to create a type that is more specific and can help catch errors at compile time. This is useful for creating types that are more specific and can help catch errors at compile time.
UserRoles[keyof typeof userRoles]; // "ADMIN" | "EDITOR" | "viewer"
but still we want get the type cause userRoles[keyof typeof userRoles] will give us the type of the values of the userRoles object, which is "ADMIN" | "EDITOR" | "viewer", but we want to get the type of the keys of the userRoles object, which is "Admin" | "Editor" | "Viewer", 
so we can use
 typeof userRoles[keyof typeof userRoles] 
 to get the type of the values of the userRoles object, which is "ADMIN" | "EDITOR" | "viewer", and then we can use that type to create a function that accepts only those values as arguments, and any other value will throw an error at compile time.
cause typeof operator behind the sences create a type that represents the exact values of the object, rather than just the shape of the object, so it will give us a type that represents the exact values of the userRoles object, which is "ADMIN" | "EDITOR" | "viewer", and any other value will throw an error at compile time.

*/

const canEdit = (role: typeof userRoles[keyof typeof userRoles]) => {
    if (role === userRoles.Admin || role === userRoles.Editor) {
        return true;
    }
    return false;
}
canEdit(userRoles.Admin); // true
canEdit(userRoles.Viewer); // false
canEdit("admin"); //will throw an error because "admin" is not the key cause i write Admin: "ADMIN" in userRoles object, so it will only allow "ADMIN" to be passed as an argument, and any other value will throw an error at compile time
canEdit("editor"); // will throw an error because "editor" is not the key cause i write Editor: "EDITOR" in userRoles object, so it will only allow "EDITOR" to be passed as an argument, and any other value will throw an error at compile time   
canEdit("viewer"); // will not throw error cause it is the value of Viewer key in userRoles object, but it will return false because it is not Admin or Editor
canEdit("ADMIN") //this is ok because it is the value of Admin key in userRoles object, and it will return true because it is Admin
canEdit("viewer"); // false
canEdit("anything"); // error
userRoles.Admin = "anything"; // error

//but senior developers prefer to use union types instead of enums because they are more flexible and easier to maintain
// also in js enums are not supported natively, they are transpiled to objects which can lead to performance issues and increased bundle size
// so we will use as const we will explore later
