# 📦 6-6: Parsing Request Body & Promise in Node.js

এই ডকুমেন্টে আমরা শিখবো Express.js এর মতো কোনো থার্ড-পার্টি লাইব্রেরি (body-parser) ছাড়া কীভাবে raw Node.js-এ ক্লায়েন্ট (যেমন Postman) থেকে পাঠানো ডাটা বা `body` রিসিভ ও পার্স করতে হয় এবং কীভাবে Promise ব্যবহার করে অ্যাসিঙ্ক্রোনাস (Asynchronous) কাজগুলো সুন্দর করে হ্যান্ডেল করা যায়।

---

## 🗺️ System Flow (ফ্লো-চার্ট)

```mermaid
flowchart TD
    A[🧑‍💻 Client (Postman)] -->|JSON Body sent via POST| B(🛣️ Controller Call)
    B --> C[parseBody Utility Called]
    C -->|req.on 'data'| D[Receive Chunks]
    D -->|Append| E(body += chunk)
    E -->|req.on 'end'| F(JSON.parse)
    F -->|Success| G[resolve Promise]
    F -->|Fail| H[reject Promise]
    G --> I[Controller awaits result]
```

---

## 📝 Documenting the Code Learnings

### 1. What it is
Node.js-এ ক্লায়েন্ট থেকে সার্ভারে যখন ডাটা (Body) আসে, তখন তা একবারে আসে না; বরং ছোট ছোট খণ্ডে (Chunks) আসে। একে Stream বলে। এই খণ্ডগুলোকে একসাথে জোড়া দিয়ে, পড়া যায় এমন Object-এ পরিণত করার পদ্ধতিকেই Body Parsing বলে। যেহেতু এটি সময়সাপেক্ষ, তাই আমরা `Promise` ব্যবহার করি যেন ডাটা পুরোপুরি আসা পর্যন্ত সার্ভার অপেক্ষা করে (`await`)। 

### 2. The Problem (With Problem Code)
Express.js-এ আমরা খুব সহজেই `req.body` লিখে ডাটা পাই। কিন্তু raw Node.js-এ `req.body` বলে কিছু নেই। ডাটাগুলো Streams আকারে আসে, যা আমরা সরাসরি পড়তে পারি না।

```typescript
// ❌ Problem Code: Trying to read body directly
const handlePost = (req, res) => {
    console.log(req.body); // Output: undefined!
    // Node.js doesn't parse the body automatically. We must assemble chunks.
};
```

### 3. The Solution (With User's EXACT Code)
আপনি অত্যন্ত চমৎকারভাবে একটি কাস্টম বডি পার্সার ইউটিলিটি (`parseBody.ts`) বানিয়েছেন। এখানে আপনি ডাটার `data`, `end`, এবং `error` ইভেন্টগুলো হ্যান্ডেল করে একটি `Promise` রিটার্ন করেছেন:

**Step 1: Utility Create (`src/utility/parseBody.ts`)**
```typescript
// ✅ Solution Code: User's Exact Code (parseBody.ts)
import type { IncomingMessage } from "node:http";

export const parseBody = (req:IncomingMessage):Promise<any> => {
    return new Promise((resolve, reject) => {
        let body = "";
        
        // 1. Listen for chunks and append them
        req.on("data", (chunk) => {
            body += chunk;
        });
        
        // 2. When completely received, parse the JSON
        req.on("end", () => {
            try {
                const parsedBody = JSON.parse(body);
                resolve(parsedBody); // Resolve Promise
            } catch (error) {
                reject(error); // Reject on invalid JSON
            }
        });
        
        // 3. Handle connection errors
        req.on("error", (error) => {
            reject(error);
        }); 
     })
}
```

**Step 2: Utility Use (`src/controller/product.controller.ts`)**
কন্ট্রোলারে আপনি `await` ব্যবহার করে প্রমিজটি কল করেছেন, যেন ডাটা পুরোপুরি আসা পর্যন্ত কোড অপেক্ষা করে:

```typescript
// ✅ Solution Code: User's Exact Code (product.controller.ts)

else if (url === "/product" && method === "POST") {
    // We need to manually parse the request body...
    // since we use promise in the parseBody function, we need to use async/await
    const body = await parseBody(req); // ⏳ Waits for Promise to resolve
    
    console.log(body);
    
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product created successfully",
        // data: body,
      }),
    );
}
```

### 4. Real-Life Analogy (With Analogy Code)
💡 **Analogy:** **পোস্টম্যান এবং টুকরো টুকরো চিঠি (The Puzzle Letter)**
- ধরুন আপনার বন্ধু আপনাকে একটি বিশাল চিঠি পাঠাবে, কিন্তু সেটা সে খামে না দিয়ে একটা একটা বাক্য (Chunks) করে পোস্টম্যান দিয়ে পাঠাচ্ছে। 
- আপনি একটি খালি কাগজ নিলেন (`let body = ""`)।  
- পোস্টম্যান যখনই এক লাইন দেয় (`req.on("data")`), আপনি সেটা আপনার কাগজে লেখেন।
- পোস্টম্যান যখন বলে "চিঠি শেষ" (`req.on("end")`), আপনি তখন পুরো লেখাটা পড়ে মানে বুঝতে পারেন (`JSON.parse`)।
- এই পুরো সময়টিতে আপনি দাঁড়িয়ে থাকেন (`Promise/await`)।

```typescript
// ✅ Analogy Code
const receiveLetterPieces = (pieces: string[]) => {
    return new Promise((resolve, reject) => {
        let fullLetter = ""; // Paper to attach pieces
        console.log("Receiving letter pieces...");

        // Simulating receiving chunks over time
        pieces.forEach((piece, index) => {
            setTimeout(() => {
                fullLetter += piece; // req.on("data")
                console.log(`Received chunk: ${piece}`);
                
                // If it's the last piece - req.on("end")
                if (index === pieces.length - 1) {
                    resolve(fullLetter);
                }
            }, 1000 * index);
        });
    });
};

// Excecution using Async/Await (Controller logic)
const readFromFriend = async () => {
    const puzzleBase = ["Hello! ", "I am ", "learning ", "Node.js!"];
    const finalLetter = await receiveLetterPieces(puzzleBase);
    console.log(`Final Translated Letter (JSON.parse): ${finalLetter}`);
};

readFromFriend();
```
