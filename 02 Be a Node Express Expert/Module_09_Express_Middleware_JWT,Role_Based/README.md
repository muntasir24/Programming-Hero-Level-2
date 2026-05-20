# 🚀 Express Middleware & Request-Response Flow

Welcome to the documentation for **Module 9: Express Middleware**. Based on the architecture flow, here is a detailed breakdown of what middleware is and why we need it in our server architecture.

## 📌 The Request-Response Architecture Flow

```mermaid
flowchart LR
    A([Client]) -- req --> B([route.ts])
    B -- req --> C{Middleware}
    C -- req --> D([controller.ts])
    D -- req --> E([service.ts])
    E -- res --> D
    D -- res --> A

    style A fill:#7CB342,stroke:#558B2F,color:white
    style B fill:#7CB342,stroke:#558B2F,color:white
    style C fill:#1E88E5,stroke:#1565C0,color:white
    style D fill:#7CB342,stroke:#558B2F,color:white
    style E fill:#7CB342,stroke:#558B2F,color:white
```

---

### Step 1: Middleware (`Middleware`)
*   **What it is:** Middleware is a function that intercepts an incoming request (`req`) before it reaches the final controller. It can check data, modify the request, or block it completely before passing the control to the next stage using the `next()` function.
*   **The Problem:** Without middleware, if we want to ensure a user is authorized or log request details, we would have to write the exact same checking logic inside every single controller function. This leads to massive **Code Duplication** and messy controllers.

**Problem Code:**
```typescript
// ❌ Problem: The controller is doing too much!
// controller.ts
const getProfile = (req: Request, res: Response) => {
    // ⚠️ Repetitive checking logic that we would have to copy-paste in EVERY controller
    if(!req.headers.authorization) {
        return res.status(401).send("Unauthorized Access!");
    }

    const data = { user: "Admin", role: "SuperUser" };
    res.status(200).json(data);
};
```

*   **The Solution:** Extract the repetitive logic into a separate `Middleware` function that sits directly between `route.ts` and `controller.ts`. 

**Solution Code:**
```typescript
// ✅ Solution: Extracted Middleware Function
// middleware.ts
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) {
        return res.status(401).send("Unauthorized Access!");
    }
    next(); // 👉 Passes control to the controller if everything is okay
};

// route.ts
// 🛠️ Middleware is injected in the middle!
router.get('/profile', authMiddleware, getProfile);

// controller.ts
// ✅ Controller is now clean and only focuses on its main job
const getProfile = (req: Request, res: Response) => {
    const data = { user: "Admin", role: "SuperUser" };
    res.status(200).json(data);
};
```

*   💡 **Real-Life Analogy:** **A Nightclub Bouncer / Security Guard**. The Client is a person trying to enter a nightclub (Controller). The Bouncer (Middleware) stands at the door checking IDs. If you don't have an ID, the bouncer turns you away (`res.send`). If you have a valid ID, the bouncer lets you inside (`next()`).

**Analogy Code:**
```typescript
class NightClub {
    // This represents the Controller
    party(person: string) {
        console.log(`🎉 ${person} is partying inside!`);
    }
}

class BouncerMiddleware {
    // This represents the Middleware
    checkIDAndLetIn(person: string, age: number, club: NightClub) {
        if (age < 18) {
            console.log(`❌ ${person}, you are underage! Entry Denied.`); // Block (res.send)
        } else {
            console.log(`✅ ID valid for ${person}. Go inside.`);
            club.party(person); // 👉 This acts like next()
        }
    }
}

// Execution Output Test
const club = new NightClub();
const bouncer = new BouncerMiddleware();

bouncer.checkIDAndLetIn("Alice", 17, club); // Entry Denied
bouncer.checkIDAndLetIn("Bob", 22, club);   // Partying inside!
```

---

### Step 2: Types of Middleware - Validation & Logger
*   **What it is:** As seen in the architecture diagram, Middleware serves specific functional roles. Two primary examples are **Validation** (like a guard checking if the incoming data is strictly correct) and **Logger** (like a record-keeper documenting every incoming request).
*   **The Problem:** 
    *   Without Validation, bad or malicious request bodies reach the controller directly, which can crash the server or create database errors.
    *   Without a Logger, if an error happens in production, you have no history or trace of who requested what and when.

**Problem Code:**
```typescript
// ❌ Problem: Controller handling validation and we have no logging
// controller.ts
const createUser = (req: Request, res: Response) => {
    // ⚠️ No Logger - We don't know who hit this API!
    
    // ⚠️ Validation logic mixed inside the controller
    if (!req.body.name || !req.body.password) {
        return res.status(400).send("Bad Request: Missing Name or Password");
    }

    // Actual core logic
    res.status(201).send("User created successfully!");
};
```

*   **The Solution:** Create specific middlewares. One for Logging requests and another for Validating request properties. These can be executed one after another chronologically in the route!

**Solution Code:**
```typescript
// ✅ Solution: Isolated Middlewares performing single duties

// 1. Logger Middleware
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`📝 [LOGGER]: ${req.method} request made to ${req.url} at ${new Date().toISOString()}`);
    next();
};

// 2. Validation Middleware
const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.name || !req.body.password) {
        return res.status(400).send("❌ [VALIDATION FAILED]: Missing Name or Password");
    }
    next(); // 👉 Data is valid, proceed
};

// 🛠️ route.ts: Chaining middlewares! 
// First logs the request, then validates the data, finally hits the controller.
router.post('/users', loggerMiddleware, validationMiddleware, createUser);

// ✅ controller.ts: Controller is now completely pure
const createUser = (req: Request, res: Response) => {
    res.status(201).send("User created successfully!");
};
```

*   💡 **Real-Life Analogy:** **Airport Security System**. 
    *   **Logger (The Check-in Record):** When you arrive, your entry is recorded automatically in the system log.
    *   **Validation (The Security Guard):** The guard checks if you have a valid ticket. If you don't, you are kicked out. If you do, you proceed to board the flight (the Controller).

**Analogy Code:**
```typescript
class FlightController {
    board(passenger: string) {
        console.log(`✈️ Success: ${passenger} boarded the flight!`);
    }
}

class AirportMiddlewares {
    // 📜 Logger Middleware (Scroll Icon)
    static checkInLogger(passenger: string, next: Function) {
        console.log(`📝 Log: ${passenger} entered the terminal.`);
        next();
    }

    // 💂 Validation Middleware (Soldier Icon)
    static securityValidation(passenger: string, hasTicket: boolean, next: Function) {
        if (!hasTicket) {
            console.log(`❌ Validation Error: ${passenger} has no ticket. Kick them out!`);
        } else {
            console.log(`✅ Validation Passed: ${passenger} is clear.`);
            next();
        }
    }
}

// simulate the Flow
const flight = new FlightController();

// AirportMiddlewares chaining sequentially
AirportMiddlewares.checkInLogger("Anis", () => {
    AirportMiddlewares.securityValidation("Anis", true, () => {
        flight.board("Anis"); // 👉 Reaches target because everything passed!
    });
});
```

---

### Step 3: Global Middlewares (Inside `app.ts`)

*   **What it is:** A global middleware is a middleware that runs for **EVERY SINGLE** request that hits our application, regardless of the route. It uses `app.use()`.
*   **The Problem:** If we have 50 different routes (e.g., `/users`, `/profile`, `/auth`) and we want to log the details of EVERY request or parse the body for EVERY request, writing `loggerMiddleware` inside every single `router.get()` / `router.post()` is exhausting and creates massive code duplication.

**Problem Code:**
```typescript
// ❌ Problem: Applying Logger to every single route individually
router.post('/users', loggerMiddleware, createUser);
router.get('/users', loggerMiddleware, getUsers);
router.get('/profile', loggerMiddleware, getProfile);
// Imagine doing this for 100 routes... 😫
```

*   **The Solution:** Use `app.use()` in the main `app.ts` file. By putting the middleware here, **Express** automatically injects it in front of all routes! 

**Solution Code:**
```typescript
// ✅ Solution: Global Logger Middleware using app.use()
// app.ts

// Any request to the server passes through this First!
app.use((req, res, next) => {
  console.log("📝 Global Logger -> Method:", req.method, "URL:", req.url, "Time:", Date.now());
  next(); // 👉 Don't forget next(), otherwise the request hangs here!
});

// Now, no need to add loggers inside these routes! They get logged automatically! 🎉
app.use('/api/users', userRoute);
app.use("/api/profile", profileRoute);
```

*   💡 **Real-Life Analogy:** **Shopping Mall Entrance Security**.
    *   If you put a security guard at the door of every single shop inside a mall (Zara, Apple, Food Court), it's expensive and repetitive (Route-Specific Middleware).
    *   Instead, you put a master security gate at the **Main Entrance of the Mall** (Global Middleware via `app.use()`). Everyone entering MUST pass through it, no matter which shop they are going to!

**Analogy Code:**
```typescript
class ShoppingMall {
    // 🚪 Global Mall Entrance Scanner
    mainEntranceSecurity(person: string, next: Function) {
        console.log(`🔍 Scanner Beep! Recording entry for: ${person} at Mall Main Gate.`);
        next();
    }

    visitZara(person: string) {
        console.log(`🛍️ ${person} is now shopping at Zara.`);
    }
}

const bashundharaCity = new ShoppingMall();

// Simulation: The person hits the Global Security First
bashundharaCity.mainEntranceSecurity("John", () => {
    // Then they go to the specific shop
    bashundharaCity.visitZara("John"); 
});
// Output: 
// 🔍 Scanner Beep! Recording entry for: John at Mall Main Gate.
// 🛍️ John is now shopping at Zara.
```

---

### Step 4: Execution Order (Top-to-Bottom Rule)

```mermaid
flowchart TD
    A[Incoming Request] --> B{Is it above the Route?}
    B -- Yes --> C[Global Middleware runs]
    C --> D[app.get Route runs & sends Response]
    B -- No --> D
    D -.-> E[Code below does NOT run]
    
    style A fill:#7CB342,stroke:#558B2F,color:white
    style C fill:#1E88E5,stroke:#1565C0,color:white
    style D fill:#E53935,stroke:#B71C1C,color:white
```

*   **What it is:** Express.js reads and executes code strictly from **Top to Bottom**. If a request matches a route and sends a response (e.g., `res.json()`), the cycle ends immediately. Any middleware written below that route will be completely ignored.
*   **The Problem:** In our `app.ts`, the base route `app.get("/")` was placed *before* our global Logger middleware. Because the route sent the "Hello World" response and didn't call `next()`, the execution stopped there. The logger never got the chance to run for the `/` route!

**Problem Code:**
```typescript
// ❌ Problem: Route is declared before the Middleware
const app: Application = express();

// The request matching "/" stops here!
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" }); 
}); 

// ⚠️ This logger will NEVER run if someone visits "/" 
app.use((req, res, next) => {
  console.log("Method:", req.method, "URL:", req.url);
  next();
});
```

*   **The Solution:** Always place your Global Middlewares **above** the routes they are supposed to intercept. By moving the `app.use()` logger to the top, it catches the request first, logs it, and uses `next()` to pass it down to `app.get("/")`.

**Solution Code:**
```typescript
// ✅ Solution: Middleware is placed Topmost
const app: Application = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// implement middleware for routes 
app.use((req, res, next) => {
  console.log("Method:", req.method, "URL:", req.url, "Time:", Date.now());
  next(); // 👉 Passes control down
});

// Now the logger successfully runs before hitting this route!
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});
```

*   💡 **Real-Life Analogy:** **A Highway Toll Plaza**. If you build a toll booth (Middleware) *after* the highway exit (Route), cars will simply leave the highway and never pay the toll. To ensure everyone pays, the toll booth MUST be placed **before** the exits.

**Analogy Code:**
```typescript
class Highway {
    payToll(car: string, next: Function) {
        console.log(`💰 Toll paid by ${car}.`);
        next();
    }

    takeExit(car: string) {
        console.log(`🚗 ${car} has left the highway.`);
    }
}

const road = new Highway();

// ❌ Wrong Order: Exit first, Toll later (Toll is never paid)
road.takeExit("Red Car");

console.log("--- Fixing the Order ---");

// ✅ Correct Order: Toll first, Exit later
road.payToll("Blue Car", () => {
    road.takeExit("Blue Car");
});
```

---

### Step 5: Higher-Order Functions (HOF) in Middleware

```mermaid
flowchart LR
    A[Router: auth'admin'] -->|Passes custom args| B(Outer Function)
    B -->|Returns| C{Inner Middleware}
    C -->|Has access to args via closure| D[Logic: Checks Role]
    
    style A fill:#7CB342,stroke:#558B2F,color:white
    style B fill:#F57C00,stroke:#B71C1C,color:white
    style C fill:#1E88E5,stroke:#1565C0,color:white
```

*   **What it is:** A Higher-Order Function (HOF) is simply a function that returns another function. In Express, we use it to pass customized data (like user "Roles") into a middleware.
*   **The Problem:** The standard structure of Express middleware is strictly `(req, res, next)`. Express will **not** let us pass custom arguments directly (like specifying which roles are allowed). If we want an admin route to check for "admin", and a user route to check for "user", a simple generic middleware function falls short.

**Problem Code:**
```typescript
// ❌ Problem: Standard middleware cannot accept our custom arguments
const auth = (req: Request, res: Response, next: NextFunction) => {
    // ⚠️ We want to check roles here, but how do we receive different roles dynamically?
    // Express strictly only gives us 'req', 'res', and 'next'!
    next();
}

// 😫 We CANNOT execute the middleware like this, it breaks the Express signature!
router.post('/create', auth('admin'), controller);
```

*   **The Solution:** We create an **Outer wrapper function** that accepts our custom arguments. This outer function then **Returns** the standard `(req, res, next)` inner function for Express to use. Thanks to JavaScript **Closure**, the inner function remembers the custom data passed to the outer function!

**Solution Code:**
```typescript
import type { NextFunction, Request, Response } from "express";

// ✅ Solution: Higher Order Function (A function returning a function)

// 1. The outer function takes our custom arguments
const auth = (...requiredRoles: string[]) => {
    
    // 2. It returns the exact standard middleware format that Express expects
    return async (req: Request, res: Response, next: NextFunction) => {
        
        // 3. Thanks to 'closure', this inner function remembers 'requiredRoles'
        console.log("Required roles for this route:", requiredRoles);
        
        // Proceed to next stage
        next();
  };
};

export default auth;

// 🛠️ Usage in route.ts:
// Now we can execute the outer function and pass dynamic arguments!
router.post('/delete', auth('admin', 'super-admin'), deleteUser);
router.get('/profile', auth('user', 'admin'), getProfile);
```

*   💡 **Real-Life Analogy:** **A Custom Security Guard Agency**. You can't just hire a generic guard for every event. You go to the agency (Outer Function), tell them your rule ("I need a guard who strictly allows VIPs"), and the agency provides (Returns) a specific Guard (Inner Function) who evaluates guests based strictly on your rule.

**Analogy Code:**
```typescript
class SecurityAgency {
    // 🏢 Outer Function: The Agency setup taking custom rules
    static hireGuard(requiredTier: string) {
        
        // 💂 Inner Function: The actual working guard given to the event
        return function checkGuest(guestName: string, guestTier: string) {
            if (guestTier !== requiredTier) {
                return `❌ ${guestName} blocked! Needs ${requiredTier} access.`;
            }
            return `✅ ${guestName} allowed!`;
        }
    }
}

// We execute the outer function to get a specialized guard!
const vipGuard = SecurityAgency.hireGuard("VIP");
const staffGuard = SecurityAgency.hireGuard("STAFF");

console.log(vipGuard("Anis", "Normal"));  // ❌ Anis blocked! Needs VIP access.
console.log(vipGuard("Muntasir", "VIP")); // ✅ Muntasir allowed!
```
