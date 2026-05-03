//Utility Types

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  color?: string;
};

//for product summary we only need id and name,

type productSummary = {
  id: number;
  name: string;
};

type productSummary2 = Pick<Product, "id" | "name">; //Pick is a utility type that allows us to create a new type by picking a set of properties from an existing type.

const product: productSummary2 = {
  id: 1,
  name: "Product 1",
  // price: 100, //Error: Object literal may only specify known properties, and 'price' does not exist in type 'productSummary2'.
  // stock: 10, //Error: Object literal may only specify known properties, and 'stock' does not exist in type 'productSummary2'.
};

//for product details we need all the properties except stock,

type productDetails = Omit<Product, "stock">; //Omit is a utility type that allows us to create a new type by omitting a set of properties from an existing type.

const productDetails1: productDetails = {
  id: 1,
  name: "Product 1",
  price: 100,
  // stock: 10, //Error: Object literal may only specify known properties, and 'stock' does not exist in type 'productDetails'.
};
type productDetails2 = Required<Product>; //Required is a utility type that allows us to create a new type by making all properties of an existing type required.
const productDetails3: productDetails2 = {
  id: 1,
  name: "Product 1",
  price: 100,
  stock: 10,
  // color: 'red', //Error: Object literal may only specify known properties, and 'color' does not exist in type 'productDetails2'.
};
type productDetails3 = Partial<Product>; //Partial is a utility type that allows us to create a new type by making all properties of an existing type optional.
const productDetails4: productDetails3 = {
  id: 1,
  name: "Product 1",
  price: 100,
  // stock: 10, //Error: Object literal may only specify known properties, and 'stock' does not exist in type 'productDetails3'.
  // color: 'red', //Error: Object literal may only specify known properties, and 'color' does not exist in type 'productDetails3'.
};
type productDetails4 = Readonly<Product>; //Readonly is a utility type that allows us to create a new type by making all properties of an existing type readonly.
const productDetails5: productDetails4 = {
  id: 1,
  name: "Product 1",
  price: 100,
  stock: 10,
  // color: 'red', //Error: Object literal may only specify known properties, and 'color' does not exist in type 'productDetails4'.
};

// productDetails5.id = 2; //Error: Cannot assign to 'id' because it is a read-only property.   

type productDetails5 = Record<string, Product>; //Record is a utility type that allows us to create a new type by mapping the properties of an existing type to a new type. In this case, we are creating a new type that maps string keys to Product values.

const productDetails6: productDetails5 = {
  "product1": {
    id: 1,
    name: "Product 1",
    price: 100,
    stock: 10,
    // color: 'red', //Error: Object literal may only specify known properties, and 'color' does not exist in type 'Product'.
  },
  "product2": {
    id: 2,
    name: "Product 2",
    price: 200,
    stock: 20,
    // color: 'blue', //Error: Object literal may only specify known properties, and 'color' does not exist in type 'Product'.
  },
};  


type productDetails6 = Exclude<"id" | "name" | "price" | "stock", "stock">; //Exclude is a utility type that allows us to create a new type by excluding a set of properties from an existing type. In this case, we are creating a new type that excludes the 'stock' property from the union of 'id', 'name', 'price', and 'stock'.

type productDetails7 = Extract<
  "id" | "name" | "price" | "stock",
  "id" | "name"
>; //Extract is a utility type that allows us to create a new type by extracting a set of properties from an existing type. In this case, we are creating a new type that extracts the 'id' and 'name' properties from the union of 'id', 'name', 'price', and 'stock'.

type productDetails8 = NonNullable<string | number | null | undefined>; //NonNullable is a utility type that allows us to create a new type by excluding null and undefined from an existing type. In this case, we are creating a new type that excludes null and undefined from the union of string, number, null, and undefined.

type productDetails9 = Parameters<(a: number, b: string) => void>; //Parameters is a utility type that allows us to create a new type by extracting the parameter types from a function type. In this case, we are creating a new type that extracts the parameter types from the function type (a: number, b: string) => void.

type productDetails10 = ReturnType<() => string>; //ReturnType is a utility type that allows us to create a new type by extracting the return type from a function type. In this case, we are creating a new type that extracts the return type from the function type () => string.

type productDetails11 = InstanceType<typeof Product>; //InstanceType is a utility type that allows us to create a new type by extracting the instance type from a constructor function type. In this case, we are creating a new type that extracts the instance type from the constructor function type typeof Product.

type productDetails12 = ThisType<{ name: string }>; //ThisType is a utility type that allows us to create a new type by specifying the type of 'this' in an object literal. In this case, we are creating a new type that specifies the type of 'this' as { name: string } in an object literal.
