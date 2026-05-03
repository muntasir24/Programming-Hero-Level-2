//conditional type depend on the value of the type parameter
// it is a way to create a type that depends on the value of another type, it is a way to create a type that is more specific than the original type, and it is a way to create a type that is more flexible than the original type.
type A = null;
type B = undefined;

type C = A extends null ? string : number; // C is string
type D = B extends undefined ? string : number; // D is string

type E = A extends undefined ? string : number; // E is number
type F = B extends null ? string : number; // F is number

type G = A extends number ? string : B extends undefined ? string : number; // G is string

type RichPeopelVehicle = {
  bike: string;
  car: string;
  ship: string;
};

type CheckVehicle<T> = T extends "bike" | "car" | "ship" ? true : false;

type HasBike = CheckVehicle<"bike">; // HasBike is true
type HasPlane = CheckVehicle<"plane">; // HasPlane is false

type CheckVehicle2<T> = T extends keyof RichPeopelVehicle ? true : false;

type HasBike2 = CheckVehicle2<"bike">; // HasBike2 is true
type HasPlane2 = CheckVehicle2<"plane">; // HasPlane2 is false