// 'as const' ব্যবহার করার কারণে Colors অবজেক্টের ভ্যালুগুলো ("RED", "BLUE") নির্দিষ্ট (literal) টাইপ হিসেবে ফিক্সড হয়ে গেছে।
// এগুলো এখন আর সাধারণ "string" টাইপ নেই, বরং readonly হিসেবে কাজ করবে।
const Colors = {
  Primary: "RED",
  Secondary: "BLUE",
} as const;

// TypeScript-এ variable 'Colors' থেকে Type বের করা হচ্ছে
type TypeOfColors = typeof Colors;

/* 
TypeOfColors টাইপটি দেখতে ঠিক এমন হবে:
{
  readonly Primary: "RED";
  readonly Secondary: "BLUE";
}
*/

// 'keyof TypeOfColors' অবজেক্টের key গুলো ("Primary" | "Secondary") রিটার্ন করে।
// এরপর ইনডেক্সিং ([]) এর মাধ্যমে আমরা ভ্যালুগুলোর ("RED" | "BLUE") একটি union type পেয়ে যাচ্ছি।
type ValidColor1 = TypeOfColors["Primary" | "Secondary"]; // Manually accessing with keys
type ValidColor = TypeOfColors[keyof TypeOfColors]; // Dynamic way

// অথবা সরাসরি এক লাইনেও লেখা যায়:
// type ValidColor = typeof Colors[keyof typeof Colors];

// এই ফাংশনটি এখন আর্গুমেন্ট হিসেবে শুধুমাত্র "RED" অথবা "BLUE" গ্রহণ করবে।
// এর ফলে টাইপ সেফটি (Type Safety) নিশ্চিত হয়।
function setColor(c: ValidColor) {
  console.log(`Setting color to: ${c}`);
}

setColor("RED"); // Valid (সঠিক)
setColor("BLUE"); // Valid (সঠিক)
// setColor("GREEN"); // Error: Type '"GREEN"' is not assignable to type '"RED" | "BLUE"'
