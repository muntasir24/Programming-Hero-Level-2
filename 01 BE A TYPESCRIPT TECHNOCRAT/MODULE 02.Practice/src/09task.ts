// Mapped Type বা Conditional Type ছাড়া যদি আমরা ম্যানুয়ালি করতাম,
// তাহলে ব্যাপারটা নিচের মতো হতো (তবে এটা ডাইনামিক না):
type LargeType1 = "Large"; // যখন string[] বা number[] দিব
type SmallType1 = "Small"; // যখন string বা number দিব

// কিন্তু Conditional Type (Ternary) ব্যবহার করলে একই টাইপ দিয়ে ডাইনামিক সিদ্ধান্ত নেওয়া যায়:
type DataType<T> = T extends any[] ? "Large" : "Small";

// Testing the type:
let size1: DataType<string[]>; // "Large"
let size2: DataType<number>; // "Small"
let size3: DataType<boolean[]>; // "Large"
let size4: DataType<string>; // "Small"
