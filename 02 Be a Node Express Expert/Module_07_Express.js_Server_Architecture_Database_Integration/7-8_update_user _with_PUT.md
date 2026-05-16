# 🚀 7-8: Updating Users (PUT vs PATCH & Using COALESCE)

Welcome! আমরা শিখে গেছি কীভাবে ডাটাবেসে ইউজার সেভ করতে হয় (POST) এবং তাদের খুঁজে বের করতে হয় (GET)। এবার আমরা শিখব কীভাবে ইউজারের ডাটা আপডেট করতে হয়। API-তে ডাটা আপডেট করার দুটি জনপ্রিয় মেথড আছে: `PUT` এবং `PATCH`। চলুন বিস্তারিত জেনে নিই!

---

## Step 1: `PUT` vs `PATCH` (মূল পার্থক্য কী?)

```mermaid
graph TD
    A[Original User: {name: 'John', age: 25, email: 'j@mail.com'}]
    
    A -->|PUT Request| B[Req Body: {name: 'Alex'}]
    B -->|Result| C[User: {name: 'Alex', age: NULL, email: NULL}]
    
    A -->|PATCH Request| D[Req Body: {name: 'Alex'}]
    D -->|Result| E[User: {name: 'Alex', age: 25, email: 'j@mail.com'}]
```

*   **What it is:** ডাটা আপডেট করার জন্য আমরা `PUT` এবং `PATCH` দুটোই ব্যবহার করতে পারি, তবে তাদের কাজের ধরন সম্পূর্ণ আলাদা।
*   **The Difference:**
    *   **`PUT` (Total Replacement):** এর মানে হলো "পুরো ডাটাবেসের অবজেক্টটি মুছে নতুন ডাটা দিয়ে বদলে দাও"। আপনি যদি `PUT` রিকোয়েস্টে শুধু নাম পাঠান, তাহলে ইউজারের বাকি সব ডাটা (বয়স, ইমেইল) মুছে `NULL` হয়ে যাবে!
    *   **`PATCH` (Partial Update):** এর মানে হলো "শুধু যেটুকু ডাটা পাঠানো হয়েছে, সেটুকু পাল্টাও। বাকি সব আগের মতোই রাখো।" এটি অনেক বেশি সেফ।

*   💡 **Real-Life Analogy:** **The Car Paint Job**. আপনার লাল রঙের গাড়ির একটি ডায়ারে স্ক্যাচ পড়েছে। `PUT` হলো পুরো গাড়িটিকে একদম খালি করে পুনরায় একদম নতুনভাবে সব কিছু সেট করা (Total overhaul)। আর `PATCH` হলো শুধুমাত্র ওই টায়ারের স্ক্র্যাচটুকুতে রং করে দেওয়া (Partial update), গাড়ির বাকি অংশ আগের মতোই থাকবে।

---

## Step 2: The `PUT` Method in Action

*   **The Problem:** `PUT` মেথডে আমরা `UPDATE users SET name = $1, email = $2 ...` ব্যবহার করি। ক্লায়েন্ট যদি বয়সের (`age`) ভ্যালু না পাঠিয়ে খালি রাখে, তাহলে ডাটাবেসে বয়স `NULL` হিসেবে সেভ হয়ে যাবে।
**Problem Code (Accidental data loss using PUT):**
```typescript
// If the user only sends `{ name: "John" }`, then password and email become undefined!
await pool.query(
    "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4", 
    [name, email, password, userId]
);
```
এজন্য `PUT` ব্যবহার করলে ফ্রন্টএন্ড থেকে সবসময় ইউজারের **সবগুলো ফিল্ড** (পুরো ফর্ম) একসাথে পাঠাতে হয়।

---

## Step 3: Partial Updates with `PATCH` & `COALESCE`

*   **What it is:** `PATCH` রাউট তৈরি করার সময় আমরা SQL-এ `COALESCE` নামক একটি ফাংশন ব্যবহার করি।
*   **The Problem:** আমরা চাই ক্লায়েন্ট শুধু যেটা আপডেট করতে চায় (যেমন শুধু `age`), সেটাই আপডেট হোক। কিন্তু ক্লায়েন্ট `name` না পাঠালে `$1` এর ভ্যালু হবে `NULL`। তাহলে ডাটাবেসে ইউজারের নাম মুছে `NULL` হয়ে যাবে।
*   **The Solution:** আমরা সল্যুশন হিসেবে PostgreSQL এর ম্যাজিকাল ফাংশন `COALESCE` ব্যবহার করি। `COALESCE($1, name)` মানে হলো: "যদি ১ নম্বর ভ্যালুটি (`$1`) পাঠানো হয়, তাহলে সেটা বসাও। আর যদি পাঠানো না হয় (অর্থাৎ `NULL` হয়), তাহলে ডাটাবেসে আগে থেকে যে `name` আছে সেটাই রেখে দাও!"

**Solution Code (From your file):**
```typescript
// ✅ Safely update only what is provided, keep the rest unchanged!
const result = await pool.query(
    `UPDATE users 
     SET name = COALESCE($1, name), 
         email = COALESCE($2, email), 
         age = COALESCE($4, age)
     WHERE id = $5 RETURNING *`,
    [name, email, password, age, userId]
);
```

*   💡 **Real-Life Analogy:** **The Smart Form**. `COALESCE` হলো ব্যাংকের ফর্মে লেখা একটি নিয়মের মতো: "যে ঘরগুলো পরিবর্তন করতে চান, শুধু সেগুলো পূরণ করুন। বাকিগুলো ফাঁকা রাখলে আমরা আগের ডাটাই রেখে দেব।"

---

## Step 4: What does `RETURNING *` mean?

*   **What it is:** আপনি হয়তো খেয়াল করেছেন, আমরা প্রতিটি `INSERT` এবং `UPDATE` কিউরি শেষে `RETURNING *` লিখছি।
*   **The Problem:** ডাটা আপডেট করার পর ফ্রন্টএন্ড ডেভেলপার জানতে চায়, "আপডেট হওয়ার পর ইউজার দেখতে কেমন হলো?" আপনি যদি `RETURNING *` না লেখেন, তাহলে `pg` লাইব্রেরি শুধু বলবে "1 row updated", কিন্তু আপডেটেড ডাটাটুকু দেখাবে না। তখন আপনাকে আবার নতুন করে `SELECT * FROM users` চালিয়ে ডাটা আনতে হবে।
**Problem Code (Two slow queries!):**
```typescript
// ❌ Slow and repetitive!
await pool.query("UPDATE users SET name = 'X' WHERE id = 1"); 
const result = await pool.query("SELECT * FROM users WHERE id = 1"); // Searching again!
res.json(result.rows[0]);
```

*   **The Solution:** `RETURNING *` ডাটাবেসকে বলে, "আপডেট করার সাথে সাথেই ওই রো-টির সম্পুর্ণ ডাটা আমাকে দিয়ে দাও।" এতে আমাদের ডাটাবেসে দু'বার কল করার প্রয়োজন হয় না, কোড অনেক ফাস্ট হয়ে যায়!
**Solution Code:**
```typescript
// ✅ Super fast! Update and Get the result in one single step!
const result = await pool.query("UPDATE users SET name = 'X' WHERE id = 1 RETURNING *");
res.json(result.rows[0]); // Has the instantly updated data!
```

*   💡 **Real-Life Analogy:** **The Tailor Receipt**. আপনি দর্জির কাছে শার্ট ঠিক করাতে দিলেন (`UPDATE`)। দর্জি শার্ট ঠিক করে আপনাকে একটি রিসিট দিল যেখানে লেখা "আপনার শার্ট ঠিক হয়েছে"। আপনি শার্ট চাইলেন, দর্জি বলল "শার্ট দেখতে চাইলে আবার নতুন করে রিকোয়েস্ট করেন" (Problem)। কিন্তু `RETURNING *` হলো দর্জির কাছে এমন ব্যবস্থা যেখানে শার্ট ঠিক হওয়ামাত্রই সে রিসিটের সাথে সাথে আপনাকে ঠিক করা শার্টটিও হাতে ধরিয়ে দেয়!
