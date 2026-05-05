# Mastering TypeScript

This document contains a curated set of tasks designed to bridge the gap between
theoretical knowledge and practical application. Each task represents a real-world scenario
you will likely encounter in professional web development.

---

## Task 1: The "Optional" Shopping Cart <span style="background-color: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 16px; font-weight: bold; vertical-align: middle; margin-left: 10px;">EASY</span>

*Concepts: Destructuring, Optional Properties, Default Values*

**Scenario:** You are building a checkout system. Users might buy one item by default, or specify a bulk quantity.

```typescript
type CartItem = {
  name: string;
  price: number;
  quantity?: number;
};
```

<h3 style="color: #0284c7; font-weight: bold; font-size: 20px; margin-bottom: 10px;">Instructions:</h3>

* Write a function `calculateTotal` that takes a `CartItem` object.
* Use **Destructuring** to extract properties.
* If `quantity` is missing, ensure the calculation treats it as `1`.
* Return the total cost (`price * quantity`).

<blockquote style="background-color: #fef9c3; border-left: 5px solid #eab308; padding: 12px 16px; margin-top: 15px; border-radius: 0 4px 4px 0; color: #422006;">
  <strong>Hint:</strong> Set a default value during destructuring: <code>{ quantity = 1 } = item</code>.
</blockquote>

<br>
<hr>
<br>

## Task 2: Merging User Profiles <span style="background-color: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 16px; font-weight: bold; vertical-align: middle; margin-left: 10px;">EASY</span>

*Concepts: Intersection Types (&)*

**Scenario:** A user signs up as a basic `Person`, but when hired, they gain `JobDetails`. An `Employee` is a union of both.

```typescript
type Person = { name: string; age: number };
type JobDetails = { role: string; salary: number };
```

<h3 style="color: #0284c7; font-weight: bold; font-size: 20px; margin-bottom: 10px;">Instructions:</h3>

* Create a new type `Employee` that combines `Person` and `JobDetails`.
* Write a function `getProfile` that accepts an `Employee`.
* Return a string: `"Name: [name], Role: [role]"`.

<blockquote style="background-color: #fef9c3; border-left: 5px solid #eab308; padding: 12px 16px; margin-top: 15px; border-radius: 0 4px 4px 0; color: #422006;">
  <strong>Hint:</strong> Use the <code>&</code> operator to merge the two types.
</blockquote>

<br>
<hr>
<br>

## Task 3: The "Safe" Data Fetcher <span style="background-color: #fef08a; color: #854d0e; padding: 4px 12px; border-radius: 20px; font-size: 16px; font-weight: bold; vertical-align: middle; margin-left: 10px;">MEDIUM</span>

*Concepts: Optional Chaining (?.), Nullish Coalescing (??)*

**Scenario:** API responses can be unpredictable. You need to safely access a deep property without causing a crash.

```typescript
type UserResponse = {
  info?: {
    address?: {
      zipCode?: string;
    }
  }
};
```

<h3 style="color: #0284c7; font-weight: bold; font-size: 20px; margin-bottom: 10px;">Instructions:</h3>

* Write a function `getZipCode` that reaches deep into the object.
* If any part of the path is missing, or if the `zipCode` is null/undefined, return `"00000"`.

<blockquote style="background-color: #fef9c3; border-left: 5px solid #eab308; padding: 12px 16px; margin-top: 15px; border-radius: 0 4px 4px 0; color: #422006;">
  <strong>Hint:</strong> Chain <code>?.</code> for every level and end with <code>?? "00000"</code>.
</blockquote>

<br>
<hr>
<br>

## Task 4: Type Assertion <span style="background-color: #fef08a; color: #854d0e; padding: 4px 12px; border-radius: 20px; font-size: 16px; font-weight: bold; vertical-align: middle; margin-left: 10px;">MEDIUM</span>

*Concepts: Type Assertion (as), unknown type*

**Scenario:** You receive a value from a 3rd-party library typed as `unknown`. You are certain it's a string and need to manipulate it.

```typescript
let secretValue: unknown = "typescript is awesome";
```

<h3 style="color: #0284c7; font-weight: bold; font-size: 20px; margin-bottom: 10px;">Instructions:</h3>

* Create a variable `upperValue`.
* Assign `secretValue` to it using **Type Assertion**.
* Call `.toUpperCase()` on the resulting value.

<blockquote style="background-color: #fef9c3; border-left: 5px solid #eab308; padding: 12px 16px; margin-top: 15px; border-radius: 0 4px 4px 0; color: #422006;">
  <strong>Hint:</strong> Use the <code>value as string</code> syntax.
</blockquote>

<br>
<hr>
<br>

## Task 5: Generic Constraints <span style="background-color: #fef08a; color: #854d0e; padding: 4px 12px; border-radius: 20px; font-size: 16px; font-weight: bold; vertical-align: middle; margin-left: 10px;">MEDIUM</span>

*Concepts: Generics, Extends Constraint*

**Scenario:** You want a function that logs the length of various inputs (strings, arrays) but rejects types that don't have a `.length`.

<h3 style="color: #0284c7; font-weight: bold; font-size: 20px; margin-bottom: 10px;">Instructions:</h3>

* Write a generic function <code>logLength&lt;T&gt;(input: T)</code>.
* Constrain <code>T</code> to ensure it must have a <code>length</code> property of type <code>number</code>.
* Return the <code>length</code> value.

<blockquote style="background-color: #fef9c3; border-left: 5px solid #eab308; padding: 12px 16px; margin-top: 15px; border-radius: 0 4px 4px 0; color: #422006;">
  <strong>Hint:</strong> Use <code>&lt;T extends { length: number }&gt;</code>.
</blockquote>

<br>
<hr>
<br>

## Task 6: The Property Guard <span style="background-color: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 20px; font-size: 16px; font-weight: bold; vertical-align: middle; margin-left: 10px;">HARD</span>

*Concepts: keyof, Generics*

**Scenario:** Create a utility that gets a property from an object while preventing typos at compile-time.

```typescript
const product = { id: 101, name: "Keyboard", price: 50 };
```

<h3 style="color: #0284c7; font-weight: bold; font-size: 20px; margin-bottom: 10px;">Instructions:</h3>

* Create a function <code>getProductProp&lt;T, K&gt;(obj: T, key: K)</code>.
* Constraint `K` to be a valid key of `T`.
* Return `obj[key]`.

<blockquote style="background-color: #fef9c3; border-left: 5px solid #eab308; padding: 12px 16px; margin-top: 15px; border-radius: 0 4px 4px 0; color: #422006;">
  <strong>Hint:</strong> Use <code>&lt;T, K extends keyof T&gt;</code>.
</blockquote>

<br>
<hr>
<br>

## Task 7: Constant Literal Types <span style="background-color: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 20px; font-size: 16px; font-weight: bold; vertical-align: middle; margin-left: 10px;">HARD</span>

*Concepts: as const, typeof, Index Access Types*

**Scenario:** Define fixed theme colors that serve as the single source of truth for your application.

```typescript
const Colors = {
  Primary: "RED",
  Secondary: "BLUE"
} as const;
```

<h3 style="color: #0284c7; font-weight: bold; font-size: 20px; margin-bottom: 10px;">Instructions:</h3>

* Create a type `ValidColor` derived directly from the values of the `Colors` object.
* Write a function `setColor(c: ValidColor)` that only accepts `"RED"` or `"BLUE"`.

<blockquote style="background-color: #fef9c3; border-left: 5px solid #eab308; padding: 12px 16px; margin-top: 15px; border-radius: 0 4px 4px 0; color: #422006;">
  <strong>Hint:</strong> <code>type ValidColor = typeof Colors[keyof typeof Colors]</code>.
</blockquote>

<br>
<hr>
<br>

## Task 8: The "Draft" Mode <span style="background-color: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 20px; font-size: 16px; font-weight: bold; vertical-align: middle; margin-left: 10px;">HARD</span>

*Concepts: Mapped Types, Readonly, Optional*

**Scenario:** Transform a strict interface into a "Draft" version where everything is optional and immutable.

```typescript
interface MyDocument {
  title: string;
  content: string;
  author: string;
}
```

<h3 style="color: #0284c7; font-weight: bold; font-size: 20px; margin-bottom: 10px;">Instructions:</h3>

* Create a Mapped Type `Draft<T>`.
* Iterate through all keys of `T`, making them `readonly` and `?` (optional).
* Declare a variable `myDraft` of type `Draft<MyDocument>`.

<blockquote style="background-color: #fef9c3; border-left: 5px solid #eab308; padding: 12px 16px; margin-top: 15px; border-radius: 0 4px 4px 0; color: #422006;">
  <strong>Hint:</strong> <code>{ readonly [P in keyof T]?: T[P] }</code>.
</blockquote>

<br>
<hr>
<br>

## Task 9: The Wrapper <span style="background-color: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 20px; font-size: 16px; font-weight: bold; vertical-align: middle; margin-left: 10px;">HARD</span>

*Concepts: Conditional Types*

**Scenario:** Create a type that acts as a logic gate, returning `"Large"` for arrays and `"Small"` for anything else.

<h3 style="color: #0284c7; font-weight: bold; font-size: 20px; margin-bottom: 10px;">Instructions:</h3>

* Create a type `DataType<T>`.
* If `T` extends an array, the type should be `"Large"`.
* Otherwise, it should be `"Small"`.

<blockquote style="background-color: #fef9c3; border-left: 5px solid #eab308; padding: 12px 16px; margin-top: 15px; border-radius: 0 4px 4px 0; color: #422006;">
  <strong>Hint:</strong> Use the ternary syntax: <code>T extends any[] ? "Large" : "Small"</code>.
</blockquote>

<br>
<hr>
<br>

## Task 10: Utility Type (Omit) <span style="background-color: #fef08a; color: #854d0e; padding: 4px 12px; border-radius: 20px; font-size: 16px; font-weight: bold; vertical-align: middle; margin-left: 10px;">MEDIUM</span>

*Concepts: Built-in Utility Types (Omit)*

**Scenario:** You need to strip sensitive data (like a password) from a user object before sending it to the UI.

```typescript
interface UserAccount {
  id: number;
  username: string;
  password: string;
}
```

<h3 style="color: #0284c7; font-weight: bold; font-size: 20px; margin-bottom: 10px;">Instructions:</h3>

* Create a type `PublicUser` using the `Omit` utility.
* Exclude the `password` field from `UserAccount`.

<blockquote style="background-color: #fef9c3; border-left: 5px solid #eab308; padding: 12px 16px; margin-top: 15px; border-radius: 0 4px 4px 0; color: #422006;">
  <strong>Hint:</strong> <code>Omit&lt;UserAccount, "password"&gt;</code>.
</blockquote>
