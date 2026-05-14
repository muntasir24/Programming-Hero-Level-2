# ✨ 6-10: Optimizing Responses & Clean Code

এই ডকুমেন্টে আমরা শিখবো কীভাবে একটি কাস্টম ইউটিলিটি (Utility) ফাংশন তৈরি করার মাধ্যমে রাউটার বা কন্ট্রোলারের কোডকে অনেক বেশি সুন্দর, গোছানো এবং ক্লিন (Clean Code) করা যায়।

---

## 🧩 Concept 1: The `sendResponse` Utility Function

আপনি জানতে চেয়েছেন `sendResponse` ফাংশন এবং `try...catch` ব্লকটি কীভাবে আমাদের কোডকে ক্লিন করে।

### 1. What it is (এটা কী?)
`sendResponse` হলো একটি কাস্টম হেল্পার (Helper) ফাংশন। সার্ভার থেকে যখনই ক্লায়েন্টকে কোনো ডেটা বা এরর পাঠাতে হয়, তখন সাধারণত বেশ কয়েকটি কাজ একসাথে করতে হয় (যেমন: স্ট্যাটাস কোড সেট করা, হেডার সেট করা, এবং ডাটাকে স্ট্রিংয়ে কনভার্ট করা)। এই বারবার করা কাজগুলোকে আমরা একটি নির্দিষ্ট ফাংশনের ভেতর মুড়িয়ে (Wrap) রেখেছি, যাতে এক লাইনেই কাজগুলো হয়ে যায়।

### 2. The Problem (সমস্যা কী ছিল?)
আগে আমাদেরকে প্রতিটা `if-else` বা কন্ডিশনের ভেতরে বারবার একই ধরনের Response কোড (Headers + Stringify) লিখতে হচ্ছিল। এটি `DRY` (Don't Repeat Yourself) রুলস ব্রেক করে এবং কোডকে অনেক বড় ও নোংরা করে ফেলে।

```typescript
// ❌ Problem Code: Messy and Repetitive Code!
// Success হলে:
res.writeHead(200, { "Content-Type": "application/json" });
res.end(JSON.stringify({ success: true, message: "Product fetched", data: singleProduct }));

// Error হলে আবার একই জিনিস লেখা লাগে:
res.writeHead(500, { "Content-Type": "application/json" });
res.end(JSON.stringify({ success: false, message: "Error fetching product" }));
```
এভাবে ১০টি রাউটে ২০ বার এই কোড লিখতে গেলে ভুল হওয়ার চান্স বাড়ে এবং কোড দেখতে খারাপ লাগে।

### 3. The Solution (সমাধান: আপনার কোড)
এই সমস্যা সমাধানের জন্য আপনি `sendResponse.ts` নামে আলাদা একটি ফাইল বানিয়েছেন এবং সেখানে সব কমন লজিক লিখে রেখেছেন। এরপর কন্ট্রোলারে শুধু `try...catch` ব্যবহার করে এক লাইনে ফাংশনটি কল করে দিয়েছেন!

```typescript
// ✅ Solution Code Part 1: The Helper Function (sendResponse.ts)
export const sendResponse = (
  res: ServerResponse,
  success: boolean,
  message: string,
  statusCode: number,
  data?: any,
) => {
  const responseBody = { success, message, data };
  
  // Header set and Stringify are handled here ONLY ONCE!
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(responseBody));
};

// ✅ Solution Code Part 2: Your Clean implementation (product.controller.ts)
try {
  // Just pass the ingredients, the helper does the cooking!
  return sendResponse(res, true, "Product fetched successfully", 200, singleProduct);
} catch (error) {
  // If anything breaks, send an error elegantly!
  return sendResponse(res, false, "Error fetching product", 500);
}
```
**কীভাবে এটি কোড ক্লিন করলো?**
* **Short & Simple:** ৪ লাইনের কোড ১ লাইনে চলে এসেছে।
* **Centralized:** যদি কখনো Headers এ কিছু পরিবর্তন করতে হয়, তবে শুধু `sendResponse` ফাংশনে পরিবর্তন করলেই পুরো প্রোজেক্টে এক সাথে সব আপডেট হয়ে যাবে!
* **Error Handling:** `try...catch` এর কারণে যদি কোড কোথাও ক্র্যাশও করে, তবুও সার্ভার বন্ধ না হয়ে ক্লায়েন্টের কাছে একটি সুন্দর 500 (Server Error) রেসপন্স চলে যাবে।

### 4. Real-Life Analogy (বাস্তব জীবনের উদাহরণ)
💡 **Analogy:** **গিফট প্যাকেজিং সার্ভিস (Gift Packaging Service)**
ধরুন আপনি একটি গিফট শপ চালান। প্রতিদিন ১০০ জন কাস্টমার আসে। 

* **The Problem (Before):** আগে আপনি নিজে ম্যানুয়ালি শপিং ব্যাগ খুঁজতেন, গিফটের গায়ে ট্যাগ লাগাতেন, টেপ মারতেন এবং কাস্টমারকে বুঝিয়ে দিতেন। এটা করতে প্রচুর সময় নষ্ট হতো এবং একই কাজ বারবার করতে মেজাজ খারাপ হতো।
* **The Solution (After):** আপনি `sendResponse` নামের একজন অ্যাসিস্ট্যান্ট বা ডেলিভারি বয় নিয়োগ দিলেন। এখন আপনার কাজ শুধু তাকে বলে দেওয়া: *"ভাই, এই নাও গিফট, আর বলে দিও সাকসেসফুলি ডেলিভারি হয়েছে!"*। সে নিজে থেকেই বক্সে প্যাক করবে (`JSON.stringify`) এবং সিল মারবে (`writeHead`)। 

**Analogy Code:**
```typescript
// ✅ Analogy Code
// Delivery Boy (Helper Function)
const packagingAssistant = (boxColor: string, item: any, isSuccess: boolean) => {
    return `Packed [${item}] in ${boxColor} box. Status: ${isSuccess ? "Happy" : "Sad"}`;
};

// You (The Controller)
try {
    const gift = "Rolex Watch";
    // 1-line clean execution!
    const result = packagingAssistant("White", gift, true); 
    console.log(result);
} catch (error) {
    const result = packagingAssistant("Red", "Nothing", false);
    console.log(result);
}
```
