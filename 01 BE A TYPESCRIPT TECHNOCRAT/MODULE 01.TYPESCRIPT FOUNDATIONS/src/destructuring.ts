// two types of destructing 
//array destructing
//object destricting

const user = {
    id: 123,
    name: {
        firstName: "Aziz",
        middleName: "Muntasir",
        lastName:"Moon"
    },
    gender:"male"
}

const { gender: sex,
    name:{ middleName} } = user;

console.log(sex); //name alias talk about it


//array destructing

const friends = ["Abdullah", "faysal", "Reza"];

const [, , friend2] = friends;