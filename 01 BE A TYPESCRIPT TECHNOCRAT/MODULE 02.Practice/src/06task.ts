// 💡 HOW THIS WORKS (The Property Guard):
// 1. <T> : This Generic captures the exact structure/shape of the object we pass.
//          (For 'product', T becomes: { id: number; name: string; price: number })
// 2. keyof T : This extracts a Union Type of all the valid keys from T.
//          (For 'product', it becomes: "id" | "name" | "price")
// 3. K extends keyof T : This creates a STRICT RULE! It says parameter 'key' (K)
//          MUST be exactly one of those extracted keys. No outside strings allowed!

const getProductProp = <T, K extends keyof T>(obj: T, key: K) => {
  return obj[key];
};

const product = { id: 101, name: "Keyboard", price: 50 };

// --- Testing the function ---
console.log(getProductProp(product, "name")); // ✅ Perfectly fine! Output: Keyboard
console.log(getProductProp(product, "price")); // ✅ Perfectly fine! Output: 50

// console.log(getProductProp(product, "color"));
// ❌ ERROR: TypeScript blocks this immediately because "color" is not in "id" | "name" | "price".
// This prevents infinite runtime bugs and typos!
