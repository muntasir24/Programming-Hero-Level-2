# ✍️ 6-7: Creating Clean POST API & Writing to Database

এই ডকুমেন্টে আমরা শিখবো কীভাবে ক্লায়েন্টের পাঠানো ডাটা রিসিভ করে তার সাথে ডায়নামিক ইউনিক আইডি (ID) বসিয়ে നമ്മുടെ `db.json` ডাটাবেসে পার্মানেন্টলি সেভ করতে হয় (File System Write)।

---

## 🗺️ System Flow (ফ্লো-চার্ট)

```mermaid
flowchart TD
    A[🧑‍💻 Client (Postman)] -->|Sends Data| B(parseBody Utility)
    B -->|Returns JSON Body| C[Controller]
    C -->|Creates new object| D{Add Date.now as ID}
    D -->|Read existing DB| E[JSON.parse db.json]
    E -->|Array.push| F[Add new product to Array]
    F -->|Call Service| G(fs.writeFileSync)
    G -->|Updates| H[(db.json)]
    G -->|Sends Response| I[201 Created to Client]
```

---

## 📝 Documenting the Code Learnings

### 1. What it is
কোনো নতুন ডাটা সার্ভারে আসলে সেটি শুধু কোনো ভেরিয়েবলে রেখে দিলে কাজ হবে না, কারণ সার্ভার রিস্টার্ট হলে ডাটা হারিয়ে যাবে। তাই ক্লায়েন্টের পাঠানো ডাটায় একটি ইউনিক `id` অ্যাড செய்து সেটিকে আমাদের লোকাল ডাটাবেস (`db.json`) ফাইলে সেভ (Write) করে রাখতে হয়। একেই **File Writing** বা Persistent Data Storage বলা হয়।

### 2. The Problem (With Problem Code)
আমরা যদি ফাইল রাইট না করে সরাসরি শুধু Array তে `push()` করি, তবে ডাটা শুধু মেমরিতে থাকবে। সার্ভার অফ হওয়ার সাথে সাথেই সব নতুন প্রোডাক্ট ডিলিট হয়ে যাবে।

```typescript
// ❌ Problem Code: Saving only in memory
const body = await parseBody(req);
let products = [{ id: 1, name: "Monitor" }];

// Data is pushed, but NOT saved to any file! 
products.push(body); 
// 🚨 Server restarts -> 'body' is lost forever!
```

### 3. The Solution (With User's EXACT Code)
আপনার কোডে আপনি খুব সুন্দরভাবে তিনটি ধাপে কাজটি করেছেন: ১) আইডি বসানো, ২) আগের ডাটাবেস রিসিভ করা ও নতুনটা পুশ করা, এবং ৩) `fs.writeFileSync` দিয়ে ফাইলে আপডেট করা।

**Step 1: Service function for Writing (`src/Service/product.service.ts`)**
এখানে `stringify()` ব্যবহার করে আগে Array-কে String বানাচ্ছেন, তারপর ফাইলে সেভ করছেন:
```typescript
// ✅ Solution Code (Service)
export const writeProduct = (payload:any) => {
    fs.writeFileSync(filePath, JSON.stringify(payload), "utf-8");
    console.log("Data has been written to the file successfully");
    return "Data has been written to the file successfully";
}
```

**Step 2: Controller Logic (`src/controller/product.controller.ts`)**
কন্ট্রোলারে আপনি `Date.now()` দিয়ে স্প্রেড অপারেটর (`...body`) এর সাহায্যে নতুন অবজেক্ট বানাচ্ছেন এবং `push()` করে নতুন ডাটা সেভ করছেন:
```typescript
// ✅ Solution Code (Controller)
const body = await parseBody(req);

// 1. Generate unique ID & merge body
const newProduct = {
    id: Date.now(), // we can use Date.now() method to generate a unique id
    ...body, // spread operator to get properties of body and add to newProduct
}

// 2. Read old data, Parse it, Push new data
const product = readProduct();
const parsedProducts = JSON.parse(product);
parsedProducts.push(newProduct);

// 3. Write back to file
writeProduct(parsedProducts);

// 4. Send Success Response
res.writeHead(201, { "Content-Type": "application/json" });
res.end(
    JSON.stringify({
    message: "Product created successfully",
    data: newProduct,
    }),
);
```

### 4. Real-Life Analogy (With Analogy Code)
💡 **Analogy:** **গেস্ট বুকে নাম এন্ট্রি করা (The Hotel Guestbook)**
- এক নতুন গেস্ট হোটেলে আসলো (Client sending POST request)। 
- ম্যানেজার তাকে একটি চাবির রিং দিলো যেটায় র্যান্ডম একটি রুম নম্বর (`Date.now()`) লেখা।
- ম্যানেজার হোটেলের পুরোনো খাতাটি খুললো (`fs.readFileSync` -> `JSON.parse`) যেখানে আগের গেস্টদের নাম আছে।
- ম্যানেজার খাতায় নতুন গেস্টের নাম আর রুম নম্বরটি লিখে দিলো (`Array.push`)।
- এরপর খাতাটি বন্ধ করে আলমারিতে রেখে দিলো (`fs.writeFileSync`), যাতে কাল এসেও দেখা যায় কে কে হোটেলে আছে।

```typescript
// ✅ Analogy Code
const hotelGuestBook: any[] = [{ id: 1, name: "Previous Guest" }];

const registerNewGuest = (guestData: any) => {
    // 1. Give random unique room number
    const newGuest = {
        id: Date.now(), 
        ...guestData 
    };

    // 2. Open the book and write name (Push to array)
    hotelGuestBook.push(newGuest);

    // 3. Keep the book safe (Write to file)
    console.log("Saving book inside the safe (fs.writeFileSync)...");
    
    return newGuest;
};

// Execution
const checkIn = registerNewGuest({ name: "Habib", purpose: "Stay" });
console.log(`Welcome ${checkIn.name}, your unique ID is ${checkIn.id}!`);
```

---

## 🔀 Concept 2: Why `JSON.stringify()` is needed while writing?

### 1. What it is
Node.js এর `fs.writeFileSync` মেথডটি সরাসরি কোনো JavaScript Object বা Array কে ফাইলে সেভ করতে পারে না। ফাইলের ভেতর শুধু টেক্সট বা বাইনারি ডেটা সেভ করা যায় (অর্থাৎ শুধুমাত্র `String` বা `Buffer` গ্রহণ করে)। তাই ফাইলে লেখার আগে আমাদের ডাটাকে (Array/Object) `JSON.stringify()` এর মাধ্যমে প্লেইন টেক্সট বা স্ট্রিং ফরম্যাটে কনভার্ট করে নিতে হয়।

### 2. The Problem (With Problem Code)
আমরা যদি `JSON.stringify()` না করে সরাসরি ডাটা (Array/Object) ফাইলে সেভ করার চেষ্টা করি, তবে Node.js একটি `TypeError` থ্রো করবে অথবা ফাইলে অকেজো `[object Object]` লেখা সেভ হয়ে যাবে।

```typescript
// ❌ Problem Code: Trying to write Object directly
const newProductsArray = [{ id: 1, name: "Phone" }];

// ERROR! fs.writeFileSync only accepts strings or buffers
fs.writeFileSync(filePath, newProductsArray, "utf-8"); 
```

### 3. The Solution (With User's EXACT Code)
আপনার `product.service.ts` ফাইলে আপনি ঠিক এই কারণেই `writeProduct` ফাংশনের ভেতর ডাটা ফাইলে ঢোকানোর আগে `JSON.stringify(payload)` ব্যবহার করেছেন, যেন রিয়েল Array টি একটি String এ পরিণত হয়ে ফাইলে সেভ হয়।

```typescript
// ✅ Solution Code (product.service.ts)
export const writeProduct = (payload:any) => {
    // payload (Array) কে Stringify করে প্রথমে String বানানো হচ্ছে, তারপর ফাইলে Write করা হচ্ছে
    fs.writeFileSync(filePath, JSON.stringify(payload), "utf-8");
    
    console.log("Data has been written to the file successfully");
    return "Data has been written to the file successfully";
}
```

### 4. Real-Life Analogy (With Analogy Code)
💡 **Analogy:** **তাক বা শেলফে পানি সংরক্ষণ (Storing Water on a Shelf)**
- **JavaScript Object/Array:** এটি হলো 'পানি' (Water)। আপনি এটিকে সরাসরি ব্যবহার করতে বা খেতে পারেন।
- **File Structure (`db.json`):** এটি হলো সম্পূর্ণ সমতল একটি কাঠের তাক বা শেলফ।
- **`JSON.stringify()`:** কাঠের শেলফে সরাসরি পানি ঢেলে দিলে সব ছড়িয়ে নষ্ট হয়ে যাবে (Error)। পানিকে শেলফে রাখতে হলে অবশ্যই সেটিকে একটি বোতলে ভরতে হবে (Stringify)। পরবর্তীতে ব্যবহারের সময় বোতল খুলে (Parse) আবার পানি বের করে নিতে হয়।

```typescript
// ✅ Analogy Code
const waterObject = { type: "Fresh Water", volume: "1 Liter" };

const storeWaterOnShelf = (water: any) => {
    // ❌ ERROR: directly placing liquid object on the shelf!
    // fileSystem.write(water); 
    
    // ✅ Put water in a bottle (Convert to string)
    const bottledWaterString = JSON.stringify(water);
    
    // Now safely place the bottle on the shelf
    return `Successfully stored: ${bottledWaterString} on the wooden shelf.`;
};

console.log(storeWaterOnShelf(waterObject));
```
