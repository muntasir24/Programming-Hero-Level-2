// ? ternary opeartor
// ?? nullish coalescing operator
// ?. optional chaining


const userAge = 21

const isAdult = userAge >= 18 ? 'Yes' : 'No'

console.log(isAdult)

const userTheme1=undefined
const userTheme2= null;
const userTheme3 = false;
const userTheme4 = 'dark';

const theme = userTheme1 ?? 'light'

//nulish coalescing operator only checks for null and undefined, it will not consider false, 0, or empty string as nullish values.    


console.log(theme)

const user = {
    name: 'Alice',
    address: {
        city: 'New York',
        zip: '10001'
    }
}

const userCity = user?.address?.city ?? 'Unknown'
//optional chaining operator allows you to safely access nested properties of an object without having to check
//  if each level of the object exists. If any part of the chain is null or undefined, it will return undefined instead of throwing an error.
//returbs 'New York' if user and address exist, otherwise it returns 'Unknown' if user or address is null or undefined.

console.log(userCity)

