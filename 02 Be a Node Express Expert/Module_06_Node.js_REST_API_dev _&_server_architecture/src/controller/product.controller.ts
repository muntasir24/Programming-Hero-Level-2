import type { IncomingMessage, ServerResponse } from "node:http";
import { readProduct, writeProduct } from "../Service/product.service";
import type { IProduct } from "../types/product.types";
import { parseBody } from "../utility/parseBody";
import { sendResponse } from "../utility/sendResponse";

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  //we use startsWith() method to check if the url starts with /product/
  //we can use this to handle dynamic routes like /product/1, /product/2 etc.
  //this is helpful to use startWith() method to handle dynamic routes like /product/1, /product/2 etc.
  const url = req.url;
  const method = req.method;
  const productId = url?.split("/")[2]; 
  if (url?.startsWith("/product/") && method === "GET") {
    //we can use split() method to split the url and get the id of the product
    const productId = url.split("/")[2]; // we can use split() method to split the url and get the product id
    console.log(`this is product with id ${productId}`);
    // res.end(
    //     JSON.stringify({ message: `hello this is product with id ${productId}` }),
    // );
    //we can also send data from database based on the product id and send it as a response to the client

    const product = readProduct();
    //[{ id: "1", name: "Product 1", price: 100 }, { id: "2", name: "Product 2", price: 200 }]
    //readProduct() function is used to read the current working directory of the project and log it to the console. This is just an example of how we can use a service function in our controller to perform some operations and then send a response to the client.
    //using find() method to find the product with the given id from the product array and send it as a response to the client
    // const product = readProduct().find((p) => p.id === productId);
    // if we not find the product with the given id, we can send a response to the client saying that the product is not found
    if (!product) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: `Product database is empty` }));
      return;
    }

    // 1. ফাইল থেকে আসা String-কে Object/Array-তে রূপান্তর করতে হবে
    const parsedProducts = JSON.parse(product);

    // 2. এখন parsedProducts একটা Array, তাই এতে .find() কাজ করবে
    const singleProduct = parsedProducts.find(
      (p: IProduct) => p.id === parseInt(productId?.toString() || "0"),
    );

    if (!singleProduct) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: `Product with id ${productId} not found` }),
      );
      return;
    }

   try {
    return sendResponse(res, true, "Product fetched successfully", 200, singleProduct);
   } catch (error) {
    return sendResponse(res, false, "Error fetching product", 500);
   }
    
  }
  else if (url === "/product" && method === "POST") {
    //node js doesnt have body parser like express js, so we need to manually parse the request body to get the data sent by the client in the request body. We can use the 'data' event of the request object to get the data sent by the client in the request body and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
    //it sends the data in chunks, so we need to listen to the 'data' event of the request object to get the data sent by the client in the request body and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
    //server receives the data in chunks, so we need to listen to the 'data' event of the request object to get the data sent by the client in the request body and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
    //after processing the data sent by the client in the request body, we can send a response to the client saying that the product is created successfully and we can also send the data of the created product as a response to the client chunks of data sent by the client in the request body and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
    // const body = "";
    //since we use promise in the parseBody function, we need to use async/await to get the data sent by the client in the request body and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
    //we can also use .then() method to get the data sent by the client in the request body and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
    //we can also use try/catch block to get the data sent by the client in the request body and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
    //we can also use async/await with try/catch block to get the data sent by the client in the request body and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
    //we can also use .then() method with catch() method to get the data sent by the client in the request body and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
    //we can also use async/await with try/catch block and .then() method with catch() method to get the data sent by the client in the request body and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
    const body = await parseBody(req);
    // console.log(body);
    const newProduct = {
      id: Date.now(), // we can use Date.now() method to generate a unique id for the product
      ...body, // we can use spread operator to get the properties of the body object and add it to the newProduct object
    }
    const product = readProduct();
    const parsedProducts = JSON.parse(product);
    parsedProducts.push(newProduct);
    console.log(parsedProducts)
    // console.log(parsedProducts);
    //we can use writeProduct() function to write the updated product array to the file and then we can send a response to the client saying that the product is created successfully and we can also send the data of the created product as a response to the client.
    //we can also use writeProduct() function to write the updated product array to the file and then we can send a response to the client saying that the product is created successfully and we can also send the data of the created product as a response to the client.
    //we can also use writeProduct() function to write the updated product array to the file and then we can send a response to the client saying that the product is created successfully and we can also send the data of the created product as a response to the client.
    //we can also use writeProduct() function to write the updated product array to the file and then we can send a response to the client saying that the product is created successfully and we can also send the data of the created product as a response to the client.
    writeProduct(parsedProducts);
    
    console.log(newProduct)
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product created successfully",
        data: newProduct,
      }),
    );
    //we send data via postman in the request body in JSON format, so we need to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
  }
  else if (url?.startsWith("/product/") && method === "PUT" && productId !== null) {
    const body = await parseBody(req);
    const product = readProduct();
    const parsedProducts = JSON.parse(product);
    const index = parsedProducts.findIndex(
      (p: IProduct) => p.id === parseInt(productId?.toString() || "0"),
    );
    if (index === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: `Product with id ${productId} not found` }),
      );
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    const updatedProduct = { ...parsedProducts[index], ...body };
    parsedProducts[index] = updatedProduct;
    writeProduct(parsedProducts);
    res.end(
      JSON.stringify({
        message: `Product with id ${productId} updated successfully`,
        data: updatedProduct,
      }),
    );
  }
  else if(url?.startsWith("/product/") && method === "DELETE" && productId !== null) {
    const product = readProduct();
    const parsedProducts = JSON.parse(product);
    const index = parsedProducts.findIndex(
      (p: IProduct) => p.id === parseInt(productId?.toString() || "0"),
    );
    if (index === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: `Product with id ${productId} not found` }),
      );
      return;
    }
    parsedProducts.splice(index, 1);
    //we need to splice the product array to remove the product with the given id and then we can use writeProduct() function to write the updated product array to the file and then we can send a response to the client saying that the product is deleted successfully.
    writeProduct(parsedProducts);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: `Product with id ${productId} deleted successfully`,
      }),
    );
  }
   else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
};
