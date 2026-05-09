const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(cookieParser())

// import all route files
const authRoute = require("./routes/auth.route");
const productRoute = require("./routes/product.route");
const cartRoute = require('../src/routes/cart.route')
const orderRoute = require('../src/routes/order.route')

// uses all files here

app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use('/api/cart' , cartRoute)
app.use('/api/order' , orderRoute)

app.get("/", (req, res) => {
  res.send("hello world");
});

module.exports = app;
