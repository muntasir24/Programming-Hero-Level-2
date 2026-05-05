type CartItem = {
  name: string;
  price: number;
  quantity?: number;
};

const calculateTotal = (item: CartItem): number => {
  const { price, quantity = 1 } = item;
  return quantity * price;
};

// --- Testing the function ---
console.log(calculateTotal({ name: "Laptop", price: 50000 })); // Expected: 50000 (quantity defaults to 1)
console.log(calculateTotal({ name: "Mouse", price: 1500, quantity: 3 })); // Expected: 4500
