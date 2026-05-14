# 🌟 Module 06 Summary: Node.js REST API & Server Architecture

এই মডিউলে আমরা কোনো ফ্রেমওয়ার্ক (যেমন Express.js) ব্যবহার না করে, একদম র (Raw) Node.js এবং TypeScript দিয়ে একটি কমপ্লিট REST API সার্ভার তৈরি করেছি। 

চলুন পুরো মডিউলে শেখা বিষয়গুলোর একটি কমপ্লিট সামারি দেখে নিই:

---

## 🧩 Concept 1: Node.js vs TypeScript Server

### 1. What it is (এটা কী?)
Node.js হলো জাভাস্ক্রিপ্ট রানটাইম। আমরা চাইলে সাধারণ `.js` ফাইল দিয়ে সার্ভার বানাতে পারি, আবার চাইলে `.ts` বা টাইপস্ক্রিপ্ট ব্যবহার করেও বানাতে পারি। টাইপস্ক্রিপ্টে সার্ভার বানালে আমরা ইন্টেলিসেন্স (অটোকমপ্লিট) এবং টাইপ সেফটি পাই।

### 2. The Problem (সমস্যা কী ছিল?)
Raw Node.js (`.js`) দিয়ে সার্ভার বানালে রিকোয়েস্ট (req) এবং রেসপন্স (res) এর কোনো ফিক্সড টাইপ থাকে না, ফলে ডেভলপমেন্টের সময় অনেক বাগ বা ভুল হওয়ার সম্ভাবনা থাকে।

```javascript
// ❌ Problem Code: Raw Node.js Server (No Types)
const http = require('http');

const server = http.createServer((req, res) => {
    // req & res doesn't have autocompletion. Hard to know what methods exist.
    res.end("Hello JS Server"); 
});
```

### 3. The Solution (সমাধান: আপনার কোড)
আমরা `.ts` ব্যবহার করেছি এবং `node:http` থেকে নির্দিষ্ট টাইপ (`IncomingMessage`, `ServerResponse`) ইমপোর্ট করেছি। 

```typescript
// ✅ Solution Code: TypeScript Server (Type Safe)
import { createServer, IncomingMessage, ServerResponse, Server } from "node:http";

const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
    // Now we get full autocomplete for req and res!
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello TS Server" }));
});
```

### 4. Real-Life Analogy (বাস্তব জীবনের উদাহরণ)
💡 **Analogy:** সাধারণ `.js` সার্ভার হলো একটি খালি খাতা যেখানে যা খুশি লেখা যায়, কিন্তু বানান ভুল হলে কেউ ধরিয়ে দেয় না। আর `.ts` সার্ভার হলো মাইক্রোসফট ওয়ার্ড (Microsoft Word), যেখানে ভুল করলেই লাল দাগ দিয়ে দেখিয়ে দেয়!

```typescript
// ✅ Analogy Code
const blankPaper = (grammar: any) => console.log(grammar); // JS: No idea what grammar is.
const msWord = (grammar: string) => console.log(grammar.toUpperCase()); // TS: Knows it must be a string!
```

---

## 🏗️ Concept 2: Server Architecture (Routes, Controllers & Services)

### 1. What it is (এটা কী?)
একটি রেস্ট এপিআইয়ের অনেকগুলো কাজ থাকে (ইউজার ম্যানেজ, প্রোডাক্ট ম্যানেজ)। এই কাজগুলোকে আমরা `routes`, `controller` এবং `service` ফোল্ডারে ভাগ করে ফেলি। 

### 2. The Problem (সমস্যা কী ছিল?)
আমরা যদি সমস্ত লজিক (if-else দিয়ে GET, POST, PUT), ডাটাবেজ চেকিং সব `server.ts` এর ভেতরে লিখি, তবে কোড হবে বিশাল বড় এবং হিজিবিজি (Spaghetti code)। 

```typescript
// ❌ Problem Code: Spaghetti Code (Everything in Server)
const server = createServer((req, res) => {
    if(req.url === "/product" && req.method === "GET") { /* logic */ }
    else if(req.url === "/user" && req.method === "POST") { /* logic */ }
    // 1000 lines of code inside server 🚨
});
```

### 3. The Solution (সমাধান: আপনার কোড)
আমরা কোডগুলোকে মডুলার করেছি:
- **Routes (`routeHandler`):** এটা ট্রাফিক পুলিশের মতো, যে ডিসাইড করে রিকোয়েস্ট কোন কন্ট্রোলারের কাছে যাবে।
- **Controller (`productController`):** সে ডাটা রিসিভ করে এবং কোন অপারেশন (GET, POST) করতে হবে তা ডিসাইড করে।
- **Service (`product.service.ts`):** এর কাজ হলো শুধুমাত্র ফাইল/ডেটাবেস থেকে ডাটা রিড (Read) এবং রাইট (Write) করা।

```typescript
// ✅ Solution Code: Organized Flow
// server.ts -> routes -> controller -> service

// routeHandler (Traffic Police)
export const routeHandler = (req: IncomingMessage, res: ServerResponse) => {
  if (req.url?.startsWith("/product")) {
    productController(req, res); // Sending to specific controller
  }
};
```

### 4. Real-Life Analogy (বাস্তব জীবনের উদাহরণ)
💡 **Analogy:** **রেস্টুরেন্ট সিস্টেম**
- **Server:** পুরো রেস্টুরেন্ট বিল্ডিং।
- **Route:** ওয়েটার (সে কাস্টমারের অর্ডার নেয়)।
- **Controller:** ম্যানেজার (সে অর্ডার বুঝে ঠিক করে কোন কাজ হবে)।
- **Service:** শেফ/রাঁধুনি (সে শুধু কিচেনে বা ডেটাবেসে গিয়ে খাবার তৈরি করে বা ডাটা আনে)।

```typescript
// ✅ Analogy Code
const Chef = { makeFood: () => "🍔 Burger Ready" }; // Service
const Manager = { handleOrder: () => Chef.makeFood() }; // Controller
const Waiter = { takeOrder: (route: string) => Manager.handleOrder() }; // Route

console.log(Waiter.takeOrder("/burger"));
```

---

## 📦 Concept 3: Custom Body Parser (Handling Data Chunks)

### 1. What it is (এটা কী?)
Express.js এর মতো ফ্রেমওয়ার্কে আমরা সরাসরি `req.body` পাই। কিন্তু Raw Node.js এ ডাটা সরাসরি পাওয়া যায় না। ডাটা ছোট ছোট টুকরো (Chunks) হিসেবে আসে। এগুলোকে একসাথে করে JSON এ কনভার্ট করাকে Body Parsing বলে।

### 2. The Problem (সমস্যা কী ছিল?)
আমরা যদি সরাসরি রিকোয়েস্ট থেকে ডাটা প্রিন্ট করতে চাই, তবে তা `undefined` বা বাফার (Buffer) হিসেবে আসবে।

```typescript
// ❌ Problem Code: Thinking body comes instantly
if (req.method === "POST") {
    const data = req.body; 
    console.log(data); // 🚨 Output: undefined!
}
```

### 3. The Solution (সমাধান: আপনার কোড)
আমরা `parseBody` নামে একটি Utility বানিয়েছি। এটি `Promise` ব্যবহার করে ডাটা টুকরো টুকরো করে (`req.on("data")`) সংগ্রহ করে এবং সম্পূর্ণ হলে (`req.on("end")`) তাকে একটি আস্ত JSON অবজেক্টে পরিণত করে।

```typescript
// ✅ Solution Code: Assembling Chunks in Utility
export const parseBody = async (req: IncomingMessage) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString(); // Catching pieces
    });
    req.on("end", () => {
      resolve(JSON.parse(body)); // Returning solid JSON
    });
  });
};

// Inside Controller:
const body = await parseBody(req);
```

### 4. Real-Life Analogy (বাস্তব জীবনের উদাহরণ)
💡 **Analogy:** **টুকরো ছবি জোড়া লাগানো (Jigsaw Puzzle)**
আপনাকে মেইলে একটি চিঠির প্রতিটা পাতা আলাদা আলাদা খামে পাঠানো হচ্ছে। আপনি সাথে সাথে প্রথম পাতা পেয়েই পুরো গল্প বুঝতে পারবেন না। আপনাকে প্রতিটা খাম রিসিভ করতে হবে (chunks), সব পেজ জমিয়ে সাজাতে হবে (buffer), এবং সবশেষে একসাথে পড়তে হবে (JSON.parse)।

```typescript
// ✅ Analogy Code
let finalStory = "";
const receiveLetters = (chunks: string[]) => {
    chunks.forEach(chunk => finalStory += chunk); // Collecting 
    return finalStory; // Complete story
}
console.log(receiveLetters(["Hello, ", "this is ", "Node.js!"]));
// Output: Hello, this is Node.js!
```

---

## 🛠️ Concept 4: Reusability Using Utilities (`sendResponse`)

### 1. What it is (এটা কী?)
যখন একই ধরনের লম্বা কোড আমাদের প্রোজেক্টের বিভিন্ন জায়গায় বারবার ব্যবহার করতে হয়, তখন সেটাকে আলাদা ফাইলে একটি ফাংশন হিসেবে সেভ করে রাখাকে Utility বলে।

### 2. The Problem (সমস্যা কী ছিল?)
আমরা প্রতিবার ডাটা সেন্ড করতে বা এরর পাঠাতে `res.writeHead` এবং `res.end(JSON.stringify(...))` বারবার লিখছিলাম, যা কোড নোংরা করছিল।

```typescript
// ❌ Problem Code: Repeating Headers
res.writeHead(200, { "Content-Type": "application/json" });
res.end(JSON.stringify({ success: true, message: "Done", data: myData }));
```

### 3. The Solution (সমাধান: আপনার কোড)
আমরা `sendResponse.ts` বানিয়েছি, যাতে আমরা মাত্র ১ লাইনে রেসপন্স পাঠাতে পারি!

```typescript
// ✅ Solution Code: One-liner response
return sendResponse(res, true, "Product fetched successfully", 200, singleProduct);
```

### 4. Real-Life Analogy (বাস্তব জীবনের উদাহরণ)
💡 **Analogy:** **গিফট প্যাকেজিং** 
আপনার গিফটের দোকানে প্রতিবার বক্স বানানো, ট্যাগ লাগানো আর টেপ মারার বদলে আপনি একটি প্যাকেজিং অ্যাসিস্ট্যান্ট (`sendResponse`) রেখে দিলেন। সে নিজেই আপনার গিফট প্যাক করে সুন্দর করে কাস্টমারকে ডেলিভারি দিয়ে দিবে।

---

## 💾 Summary Conclusion
এই মডিউলটির মাধ্যমে আপনি শিখেছেন যে আন্ডার-দ্য-হুড (Under the hood) Express.js কীভাবে কাজ করে! নিজে ম্যানুয়ালি Раউটার ডিস্ট্রিবিউট করা, চাঙ্কস রিসিভ করা, এবং লজিকগুলো লেয়ার বাই ফোল্ডারে (Controller, Service, Utility) সেপারেট করার চমৎকার অভিজ্ঞতা আপনার হয়েছে।
