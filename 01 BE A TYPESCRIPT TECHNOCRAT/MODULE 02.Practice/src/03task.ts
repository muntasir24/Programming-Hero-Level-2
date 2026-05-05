type UserResponse = {
  info?: {
    address?: {
      zipCode?: string;
    };
  };
};

const getZipCode = (response: UserResponse): string => {
  // Using Option Chaining (?.) and Nullish Coalescing (??)
  return response?.info?.address?.zipCode ?? "00000";
};

// --- Testing the function ---
console.log(getZipCode({ info: { address: { zipCode: "12345" } } })); // Expected: "12345"
console.log(getZipCode({ info: {} })); // Expected: "00000" (missing address)
console.log(getZipCode({})); // Expected: "00000" (missing info)
