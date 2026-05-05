interface UserAccount {
  id: number;
  username: string;
  password: string;
}

type PublicUser = Omit<UserAccount, "password">;

// Testing the PublicUser type
const userInfo: PublicUser = {
  id: 1,
  username: "moon",
  // password: "123" // Error: Object literal may only specify known properties, and 'password' does not exist in type 'PublicUser'.
};

console.log(userInfo);
