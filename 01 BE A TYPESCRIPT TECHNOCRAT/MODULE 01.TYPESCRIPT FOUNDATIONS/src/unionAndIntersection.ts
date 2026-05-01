type userRole = "admin" | "user";

const getDashboard = (role: userRole) => {
    if (role == "admin") return "welcome Boss";
    else if (role == "user") return "hello";
    else return "konnichiwa"
}

//intersection

type Employee = {
    name: string;
    age: number;
}

type Manager = {
    department: string;
}

type ManagementEmployee = Employee & Manager;

const employee1: ManagementEmployee = {
    name: "John",
    age: 30,
    department: "HR"
}   

const employee2: ManagementEmployee = {
    name: "Jane",
    age: 25,
    department: "Finance"
}