# 🌍 6-11: Environment Variables & dotenv Configuration

এই ডকুমেন্টে আমরা শিখবো `Environment Variables` (এনভায়রনমেন্ট ভেরিয়েবল) কী, কেন কোডের ভেতর পোর্ট (PORT) বা ডেটাবেস লিংক সরাসরি লেখা উচিত নয়, এবং কীভাবে `dotenv` প্যাকেজ লকার হিসেবে কাজ করে।

---

## 🧩 Concept 1: Managing Secrets with `.env` & `dotenv`

আপনি টার্মিনালে `npm i dotenv` কমান্ড চালিয়েছেন, একটি `.env` ফাইল বানিয়েছেন, `index.ts` (config) সেটআপ করেছেন এবং `tsx watch ./src/server.ts` চালানোর পর দেখেছেন সার্ভার সুন্দরভাবে `.env` থেকে পোর্ট নিয়ে কল হয়েছে।

### 1. What it is (এটা কী?)
**Environment Variables** হলো এমন কিছু ডাইনামিক ভ্যালু (যেমন: PORT, Database Password, Secret Keys) যা আমরা মেইন কোডের বাইরে আলাদা একটি ফাইলে (`.env` ফাইলে) লুকিয়ে রাখি। 
আর **`dotenv`** হলো একটি প্যাকেজ যা ওই লুকিয়ে রাখা `.env` ফাইল থেকে ডাটাগুলো পড়ে এনে আমাদের Node.js প্রোজেক্টের ভেতর `process.env` নামের একটি গ্লোবাল অবজেক্টে লোড করে দেয়। 

### 2. The Problem (সমস্যা কী ছিল?)
আগে আমরা `server.listen(5000)` লিখে সরাসরি পোর্ট নাম্বার বসিয়ে দিয়েছিলাম। একে বলে **Hardcoding**। 
টেস্টিংয়ের সময় এটি কাজ করলেও, যখন আপনি আপনার কোড গিটহাবে (GitHub) আপলোড করবেন, তখন সবাই আপনার ডেটাবেসের পাসওয়ার্ড বা সিক্রেট কি (Secret Key) দেখে ফেলবে। এছাড়া, অন্য কোনো সার্ভারে (যেমন Vercel, Heroku) ডিপ্লয় করতে গেলে তাদের নিজেদের পোর্ট সিস্টেম থাকে, তখন ৫০০০ পোর্ট কাজ করবে না।

```typescript
// ❌ Problem Code: Hardcoding everything (Security Risk & Rigid)
const PORT = 5000;
const DB_URL = "mongodb://admin:superSecretPassword@localhost:27017"; // 🚨 Password leaked!

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### 3. The Solution (সমাধান: আপনার কোড)
এই সমস্যা থেকে বাঁচতে আপনি তিনটি চমৎকার কাজ করেছেন:
১. একটি `.env` ফাইলে ডাটা রেখেছেন যা গিটহাবে আপলোড হবে না।
২. `config/index.ts` ফাইলে `dotenv` দিয়ে ডাটাগুলোকে প্রোজেক্টে ইমপোর্ট করেছেন।
৩. `server.ts` এ সেই সেফ (Safe) ভ্যালুটি ব্যবহার করেছেন।

যখন আপনি `tsx watch ./src/server.ts` চালিয়েছেন, তখন `tsx` নিজে থেকেই `◇ injected env (1) from .env` মেসেজ দেখিয়ে কনফার্ম করেছে যে সে `.env` ফাইলে থাকা `PORT=5000` কে কোডের মধ্যে সফলভাবে ইনজেক্ট বা পুশ করে দিয়েছে!

```typescript
// ✅ Solution Code Part 1: .env (The hidden file)
PORT=5000

// ✅ Solution Code Part 2: src/config/index.ts (The Manager)
import dotenv from "dotenv";
import path from "node:path";

// 1. Reading the hidden .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// 2. Safely exporting the values
const config = {
  PORT: process.env.PORT || 3000, // If .env is missing, playfully fallback to 3000
  DB_URL: process.env.DB_URL || "mongodb://localhost:27017/myapp",
};
export default config;

// ✅ Solution Code Part 3: src/server.ts (The Consumer)
import config from "./config";

// Now server.ts doesn't know what the exact port is, it just trusts the config!
server.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
```

### 4. Real-Life Analogy (বাস্তব জীবনের উদাহরণ)
💡 **Analogy:** **টেবিলের টাকা বনাম সিন্দুকের টাকা (Money on Table vs Safe)**
* **The Problem:** ধরুন আপনার অফিসে সবার টেবিলের উপর (Main Code) ক্যাশ টাকা বা ব্যাংকের কার্ড ফেলে রাখা হয়। যে কেউ (হ্যাকারের মতো) অফিসে ঢুকে বা জানালা দিয়ে উঁকি মেরে কার্ডের ডিটেইলস দেখে নিতে পারে।
* **The Solution:** আপনি একটি **লকার বা সিন্দুক (`.env` ফাইল)** কিনলেন। সব টাকা সেখানে ঢোকালেন। সেই সিন্দুকের চাবি দিলেন একজন বিশ্বস্ত **ম্যানেজারের (`config.ts` ও `dotenv`)** কাছে। এখন অন্য স্টাফদের (`server.ts`) যখনই টাকা দরকার হয়, তারা ম্যানেজারের কাছে যায়। ম্যানেজার সিন্দুক থেকে নিরাপদে টাকা বের করে তাদের দেয়। কেউ সরাসরি সিন্দুক দেখতেও পারে না, খোলার তো প্রশ্নই আসে না!

**Analogy Code:**
```typescript
// ✅ Analogy Code
// This represents our .env file (Hidden Safe)
const personalSafe = {
    cardPin: 1234,
    bankBalance: 50000
};

// This represents config/index.ts (The Manager)
const safeManager = {
    getPin: () => personalSafe.cardPin || "0000" 
};

// This represents server.ts (The worker who needs the info to do the job)
const startShopping = () => {
    // Worker doesn't hardcode the PIN, just asks the manager!
    const activePin = safeManager.getPin(); 
    console.log(`Shopping started using PIN: **** (Hidden)`);
};

startShopping();
```
