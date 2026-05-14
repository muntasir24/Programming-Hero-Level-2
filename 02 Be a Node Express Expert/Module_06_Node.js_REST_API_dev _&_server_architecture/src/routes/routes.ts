import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "node:http";
import { productController } from "../controller/product.controller";


export const routeHandler = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;
  if (url === "/" && method === "GET") {
    console.log("this is root");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Welcome to the root route");
    res.end();
  } else if (url === "/user" && method === "GET") {
    console.log("this is user");
  } else if (url?.startsWith("/product/")) {
    productController(req, res);
  } else if (url?.startsWith("/product/") && method === "GET") {
    productController(req, res);
  } else if (url?.startsWith("/product/") && method === "PUT") {
    productController(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.write("Route not found");
    res.end();
  }
}


//this is folder structure of our project
// src
//  |-- server.ts
//  |-- controller
//       |-- product.controller.ts
//       |-- user.controller.ts
//  |-- routes
//       |-- routes.ts
//  |-- database
//       |-- db.json
//we have created a separate folder for controller and routes and database to keep our code organized and maintainable.
//we have created a separate file for routes and imported it in the server.ts file and used it to handle different routes.

//this helps us to keep our code organized and maintainable by separating the route handling logic from the server creation logic.
//in product we can handle different product related routes and in user we can handle different user related routes and so on.
//we can also create a separate file for each route and import them in the routes.ts file and use them to handle different routes.
//which called controller in MVC architecture.
//controller is a file that contains the logic to handle a specific route and we can import it in the routes.ts file and use it to handle different routes.