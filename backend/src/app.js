const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')

app.use(cors({origin:['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'] , credentials:true}))

app.use(express.json());
app.use(cookieParser())
// server.js mein ye line add karein
app.use("/uploads", express.static("uploads"));

// import all route files
const authRoute = require("./routes/auth.route");
const productRoute = require("./routes/product.route");
const cartRoute = require('../src/routes/cart.route')
const orderRoute = require('../src/routes/order.route')
const adminRoute = require('../src/routes/admin.route')
const addressRoute = require('../src/routes/address.route')

// uses all files here

app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use('/api/cart' , cartRoute)
app.use('/api/order' , orderRoute)
app.use('/api/admin' , adminRoute)
app.use('/api/address' , addressRoute)

app.get("/", (req, res) => {
  res.send("hello world");
});

module.exports = app;
