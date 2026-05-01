//spread operator talk what is it

const friends = ["Nayon", "Abdullah"];
const schoolFriends = ["Joy", "bari", "shamim"];
const varsityfriends = ["Imtius", "Zia", "anup"];

friends.push(varsityfriends);
// Argument of type 'string[]' is not assignable to parameter of type 'string'
// becuse it will look like
// const friends = ["Nayon", "Abdullah",["Imtius", "Zia", "anup"]];
friends.push(...varsityfriends); //spread operator


const user = {
    name: "Moon",
    phone: "01488546353",
};

const otherInfo = {
    hobby:"Read Manga"
}
const userInfo = { ...user, ...otherInfo };
// user merge


//Rest oeprator

const sendInvite = (...friends:string[]) =>
{
    friends.forEach(f => {
        console.log(`Come to My Wedding Dear ${f}`);
    });
}

sendInvite("Faysal", "Waz", "Mursalin");

