type Person = { name: string; age: number };
type JobDetails = { role: string; salary: number };

type Employee = Person & JobDetails;

const getProfile = (profile:Employee): string => {
    const { name, role } = profile;
    return `Name: ${name}, Role: ${role}`;
}

// --- Testing the function ---
const newEmployee: Employee = {
    name: "John Doe",
    age: 28,
    role: "Software Engineer",
    salary: 75000
};

console.log(getProfile(newEmployee));