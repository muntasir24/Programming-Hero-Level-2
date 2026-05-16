import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
const app: Application = express();
dotenv.config();
const port = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
//when we send data to the server, we need to use the appropriate middleware to parse the incoming data. In this case, we are using express.json() to parse JSON data and express.urlencoded() to parse URL-encoded data. This allows us to access the data sent in the request body through req.body in our route handlers.
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL, // Sensitive data hidden!
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

// {   "name": "John Doe",
//     "email": "john.doe@example.com"
//     "password": "password123"
// }
app.post("/data", async (req: Request, res: Response) => {
  const data = req.body;
  const { name, email, password } = data;
  console.log(data);
  // Process the data as needed
  //201 status code indicates that the request has been fulfilled and has resulted in the creation of a new resource. In this case, we are sending a response back to the client indicating that the data has been received successfully.
  res.status(201).json({
    message: "Data created successfully",
    //server to broweser automatically converts the JavaScript object into a JSON string before sending it back to the client. This is done because the response is being sent as JSON, and the client expects to receive data in that format. By using res.json(), we can ensure that the response is properly formatted as JSON and can be easily parsed by the client.
    data: { name, email },
    // In this example, we are sending back a JSON response that includes a message and the name and email that were received in the request body. The password is not included in the response for security reasons.
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//now we want to add neondb to our project, we can use the following command to install the neond package:
// npm install neond

// After installing the neond package, we can import it in our server.ts file and use it to connect to our Neon database. We will need to create a connection to the database and then we can perform operations such as inserting data, querying data, etc.

//neon serverless postgres database is a cloud-based database service that allows you to easily create and manage PostgreSQL databases without the need for server management. It provides a scalable and secure environment for your applications to store and retrieve data. With Neon, you can quickly set up a PostgreSQL database, connect to it from your application, and perform various database operations such as creating tables, inserting data, querying data, and more. Neon also offers features like automatic backups, high availability, and performance optimization to ensure that your database runs smoothly and efficiently.
// To connect to a Neon database, you will need to create a connection string that includes your database credentials and connection details. This typically includes the host, port, database name, username, and password. Once you have the connection string, you can use it to establish a connection to the database and perform operations as needed.
//how to add it in server
//so we need a pool
// we will create a pool of connections to the database, which allows us to efficiently manage multiple connections and improve performance. We can use the Pool class from the neond package to create a connection pool and then use it to execute queries against the database. This will allow us to interact with our Neon database from our Express server and perform operations such as inserting data, querying data, etc.
// npm install pg
