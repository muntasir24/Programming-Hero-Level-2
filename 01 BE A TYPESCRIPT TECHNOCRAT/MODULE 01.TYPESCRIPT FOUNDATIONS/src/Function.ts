//1.arrow function

function add(num1: number, num2: number): number {
  return num1 + num2;
}

const addArrow = (num1: number, num2: number): number => num1 + num2;

// addArrow(2, "3");

//function in object called method

const poorUser = {
  name: "Moon",
  balance: 0,
  addBalance(value: number): number {
    return this.balance + value;
  },
};

poorUser.addBalance(100);

const arr: number[] = [1, 3, 4];

const squareArr = arr.map((elem: number, idx): number => {
  return elem * elem;
});
