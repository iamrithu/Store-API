require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

//middleware

app.use(express.json());

//rootes
app.get("/", (req, res) => {
  res.send(`<h1>Store API</h1><a href="/api/v1/products">Product Route</a>`);
});
app.use("/api/v1/products", productsRouter);

//error handling

app.use(notFoundMiddleware);
app.use(errorMiddleware);

//server routes

const port = process.env.PORT || 3000;

const start = async (second) => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`App listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
