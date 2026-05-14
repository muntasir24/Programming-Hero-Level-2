import { fsync } from "fs";
import path from "node:path";
import fs from "node:fs";
const filePath = path.join(process.cwd(), "./src/Database/db.json");



export const readProduct = () => {
    //to read which folder we are in
    // console.log(process.cwd());
    //joined the current working directory with the path of the file we want to read

    // console.log(filePath)
    //filesytem module is used to read and write files in node.js
    //we can use fs module to read the file and log its content to the console
    const products = fs.readFileSync(filePath, "utf-8");
    //UTF-8 is used to read the file as a string instead of a buffer
    //Means that we want to read the file as a string instead of a buffer
    // console.log(products);
    return products;
    //returning the content of the file as a string
    //cause we have read the file as a string using UTF-8 encoding
}

export const writeProduct = (payload:any) => {
    fs.writeFileSync(filePath, JSON.stringify(payload), "utf-8");
    //we can use fs module to write data to the file and log a message to the console saying that the data has been written to the file successfully
    console.log("Data has been written to the file successfully");
    //we can also return a message from this function saying that the data has been written to the file successfully and then we can use this message in our controller to send it as a response to the client
    return "Data has been written to the file successfully";
}