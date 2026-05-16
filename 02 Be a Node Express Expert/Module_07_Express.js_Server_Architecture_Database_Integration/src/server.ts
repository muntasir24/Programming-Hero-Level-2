import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import { config } from "./config";
const app: Application = express();

const port = config.port;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
//when we send data to the server, we need to use the appropriate middleware to parse the incoming data. In this case, we are using express.json() to parse JSON data and express.urlencoded() to parse URL-encoded data. This allows us to access the data sent in the request body through req.body in our route handlers.
const pool = new Pool({
  connectionString:config.databaseUrl, // Sensitive data hidden!
});

const initDB = async () => {
  try {
    await pool.connect();
    await pool.query(`
      
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        age INT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      `);
    console.log("Connected to the database successfully!");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
};
//we will use async/await to handle the asynchronous nature of database operations. This allows us to write cleaner and more readable code when interacting with the database. We can use try/catch blocks to handle any errors that may occur during database operations and ensure that we release the client back to the pool after we're done with it.
//added try/ catch block to handle any potential errors that may occur during the database connection process. This will help us identify and troubleshoot any issues that may arise when connecting to the database, such as incorrect credentials, network issues, or other connection problems. By logging the error message, we can gain insights into what went wrong and take appropriate actions to resolve the issue.

initDB();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

// {   "name": "John Doe",
//     "email": "john.doe@example.com"
//     "password": "password123"
// }
app.post("/api/users", async (req: Request, res: Response): Promise<any> => {
  try {
    const data = req.body;
    const { name, email, password, age } = data;
    const result = await pool.query(
      "INSERT INTO users (name, email, password, age) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, password, age],
    );
    console.log(result.rows[0]); // Log the inserted user data
    // Process the data as needed
    //201 status code indicates that the request has been fulfilled and has resulted in the creation of a new resource. In this case, we are sending a response back to the client indicating that the data has been received successfully.
    res.status(201).json({
      message: "Data created successfully",
      //server to broweser automatically converts the JavaScript object into a JSON string before sending it back to the client. This is done because the response is being sent as JSON, and the client expects to receive data in that format. By using res.json(), we can ensure that the response is properly formatted as JSON and can be easily parsed by the client.
      data: result.rows[0],
      // In this example, we are sending back a JSON response that includes a message and the name and email that were received in the request body. The password is not included in the response for security reasons.
    });
  } catch (error: any) {
    console.error("Error inserting data:", error);

    // Postgres Error Code '23505' means "unique_violation"
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "This email is already registered!",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
app.get("/api/users", async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json({
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.get("/api/users/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User retrieved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.put("/api/users/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;
    const { name, email, password, age } = req.body;
    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, password = $3, age = $4, updated_at = NOW() WHERE id = $5 RETURNING *",
      [name, email, password, age, userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
app.patch("/api/users/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;
    const { name, email, password, age } = req.body;
    const result = await pool.query(
      "UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password), age = COALESCE($4, age), updated_at = NOW() WHERE id = $5 RETURNING *",
      [name, email, password, age, userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.delete("/api/users/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [
      userId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
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
