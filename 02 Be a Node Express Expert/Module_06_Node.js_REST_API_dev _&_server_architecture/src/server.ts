import {
  createServer,
  IncomingMessage,
  Server,
  ServerResponse,
} from "node:http";
import { routeHandler } from "./routes/routes";
import config from "./config";

// We create a server using createServer method and pass a callback function that takes two parameters req and res
// req is the request object that contains information about the incoming request
// res is the response object that we will use to send a response back to the client
const server: Server = createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    // We haven't studied sending response yet, so we just log the res object for now
    // console.log(req.url);
    // console.log(req.method)
   routeHandler(req, res);
  },
);

// Now we have to listen it on a port
server.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});

//now we will see route
//handle the incoming request and send a response back to the client
//in http, we have different methods like GET, POST, PUT, DELETE etc. and we can handle them differently

//req.url will give us the url of the incoming request and req.method will give us the method of the incoming request
//req.method will give us the method of the incoming request and we can use it to handle different methods differently
// /user /product etc. are called routes and we can handle them differently based on the url of the incoming request
// http://localhost:5000/user will give us the url of the incoming request as /user and we can handle it differently based on the url of the incoming request
// we want to show
//response in browser when we hit http://localhost:5000/user
// we will send a response back to the client using res object and we can use res.write() method to write the response and res.end() method to end the response
