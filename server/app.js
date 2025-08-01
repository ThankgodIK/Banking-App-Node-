const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const accountRouter = require("./routes/accountRoutes");
const transactionRouter = require("./routes/transactionRoutes");

dotenv.config(); // ✅ This loads .env variables

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true })); // ✅ Enabling CORS for all origins
// Middlewares
app.use(express.urlencoded({ extended: true })); // ✅ Middleware to parse URL-encoded bodies
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET)); // ✅ Middleware to parse cookies

//Routes
app.use("/api/v1/auth", authRouter); // ✅ Registering the user routes
app.use("/api/v1/users", userRouter); // ✅ Registering the user routes
app.use("/api/v1/account", accountRouter); // ✅ Registering the user routes
app.use("/api/v1/transactions", transactionRouter); // ✅ Registering the user routes

app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);

  res.send("Welcome to the API!");
});

const PORT = process.env.PORT || 3011;

const MONGO_STRING = process.env.MONGO_DB;
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with failure
  }
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const start = async () => {
  try {
    console.log("hello world");

    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Error starting the server:", error);
  }
};

start();
