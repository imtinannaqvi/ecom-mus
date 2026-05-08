const express = require("express");
const app = express();

app.use(express.json());

// import all route files
const authRoute = require("./routes/auth.route");
const productRoute = require("./routes/product.route");

// uses all files here

app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);

app.get("/", (req, res) => {
  res.send("hello world");
});

module.exports = app;
