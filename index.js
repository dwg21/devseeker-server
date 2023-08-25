const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Calls next on aysnc erros so server carrys onto next middleware
require("express-async-errors");

const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  })
);

app.use(express.json());

//router imports
const scraperRouter = require("./routes/scraperRoutes");
const userRouter = require("./routes/userRoutes");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// database
const connectDB = require("./db/connect");

//route initialization
app.use("/api/v1/scraper", scraperRouter);
app.use("/api/v1/user", userRouter);

app.get("/", (request, response) => {
  response.send("Hi there");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log("error starting server : ", error);
  }
};

start();
