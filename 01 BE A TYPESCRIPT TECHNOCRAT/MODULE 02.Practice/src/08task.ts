interface MyDocument {
  title: string;
  content: string;
  author: string;
}

/* 
  Mapped Type Explanation (Step by Step):
  ১. <T>: এটি একটি Generic. অর্থাৎ Draft যে কোনো Object Type গ্রহণ করতে পারবে (যেমন MyDocument)।
  ২. keyof T: এটি T এর সব key বের করে আনে। (এক্ষেত্রে "title" | "content" | "author" বের করবে)
  ৩. [k in keyof T]: এটি একটি Loop এর মতো কাজ করে। এটি প্রতিটা key এর উপর একবার করে ঘুরবে এবং নতুন প্রোপার্টি তৈরি করবে। 
  ৪. readonly: এটি প্রোপার্টিগুলোকে Immutable করে দেয়। অর্থাৎ একবার ভ্যালু দিলে তা আর চেঞ্জ করা যাবে না।
  ৫. ?: এটি প্রোপার্টিগুলোকে Optional করে দেয়। অর্থাৎ অবজেক্ট বানানোর সময় এই ফিল্ড না দিলেও এরর দিবে না।
  ৬. T[k]: এটি হলো "Indexed Access Type"। এটি অরিজিনাল অবজেক্ট (T) থেকে নির্দিষ্ট key (k) এর টাইপ (যেমন: string) বের করে।
*/
type Draft<T> = {
  readonly [k in keyof T]?: T[k];
};

/* 
  উদাহরণ: Draft<MyDocument> কে যদি আমরা ম্যানুয়ালি (Mapped Type ছাড়া) লিখতাম, 
  তাহলে এটি ঠিক নিচের মতো দেখতে হতো:

  type ManualDraft = {
    readonly title?: string;
    readonly content?: string;
    readonly author?: string;
  }
*/

// Variable ডিক্লেয়ার করা হলো
// (MyDocument এর সবগুলো প্রোপার্টি এখন readonly এবং optional হয়ে গেছে)
let myDraft: Draft<MyDocument> = {
  title: "TypeScript Mapped Types",
  // content এবং author না দিলেও এরর দিবে না (কারণ optional ?)
};

// myDraft.title = "New Title"; // // Error: Cannot assign to 'title' because it is a read-only property.
