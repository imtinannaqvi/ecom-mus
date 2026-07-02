// Demo data seeder.  Run with:  node seed.js
// Safe to re-run: it clears the seeded collections first.
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const categoryModel = require("./src/models/category.model");
const productModel = require("./src/models/product.model");
const userModel = require("./src/models/user.model");
const addressModel = require("./src/models/address.model");
const orderModel = require("./src/models/order.model");

const img = (name) => ({ url: `/uploads/demo/${name}` });

const categories = [
  {
    name: "Men",
    image: "/uploads/demo/cat-men.jpg",
    subCategories: [
      { name: "Casual Shirts", image: "/uploads/demo/product1.jpg" },
      { name: "Jeans & Denims", image: "/uploads/demo/product2.jpg" },
      { name: "Hoodies & Sweatshirts", image: "/uploads/demo/product3.jpg" },
      { name: "Polo Tees", image: "/uploads/demo/product4.jpg" },
    ],
  },
  {
    name: "Women",
    image: "/uploads/demo/cat-women.jpg",
    subCategories: [
      { name: "Kurtas & Ethnic", image: "/uploads/demo/product5.jpg" },
      { name: "Tops & Blouses", image: "/uploads/demo/product6.jpg" },
      { name: "Trousers", image: "/uploads/demo/product7.jpg" },
    ],
  },
  {
    name: "Kids",
    image: "/uploads/demo/cat-kids.jpg",
    subCategories: [
      { name: "Infant Rompers", image: "/uploads/demo/product8.jpg" },
      { name: "Teens Casuals", image: "/uploads/demo/product1.jpg" },
    ],
  },
];

// Prices in INR.
const products = [
  {
    name: "Classic Oxford Shirt",
    description: "Breathable cotton Oxford shirt with a tailored fit. A wardrobe staple for work or weekend.",
    price: 1499,
    mainCategory: "Men",
    subCategory: "Casual Shirts",
    colors: ["White", "Navy", "Grey"],
    sizes: ["S", "M", "L", "XL"],
    stock: 40,
    images: [img("product1.jpg")],
  },
  {
    name: "Slim-Fit Blue Denim",
    description: "Stretchable slim-fit jeans in mid-blue wash with clean stitching and a comfortable rise.",
    price: 2299,
    mainCategory: "Men",
    subCategory: "Jeans & Denims",
    colors: ["Blue", "Black"],
    sizes: ["M", "L", "XL", "XXL"],
    stock: 30,
    images: [img("product2.jpg")],
  },
  {
    name: "Essential Pullover Hoodie",
    description: "Heavyweight fleece hoodie with a kangaroo pocket and ribbed cuffs. Warm and everyday-easy.",
    price: 1899,
    mainCategory: "Men",
    subCategory: "Hoodies & Sweatshirts",
    colors: ["Black", "Beige", "Grey"],
    sizes: ["S", "M", "L", "XL"],
    stock: 25,
    images: [img("product3.jpg")],
  },
  {
    name: "Cotton Pique Polo",
    description: "Classic pique polo tee with a two-button placket and soft collar. Smart-casual essential.",
    price: 1199,
    mainCategory: "Men",
    subCategory: "Polo Tees",
    colors: ["White", "Red", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    stock: 50,
    images: [img("product4.jpg")],
  },
  {
    name: "Embroidered Anarkali Kurta",
    description: "Flowing Anarkali kurta with delicate thread embroidery. Festive-ready and elegant.",
    price: 2599,
    mainCategory: "Women",
    subCategory: "Kurtas & Ethnic",
    colors: ["Beige", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 20,
    images: [img("product5.jpg")],
  },
  {
    name: "Ruffle-Sleeve Blouse",
    description: "Lightweight blouse with ruffled sleeves and a relaxed silhouette. Pairs with denim or trousers.",
    price: 1399,
    mainCategory: "Women",
    subCategory: "Tops & Blouses",
    colors: ["White", "Navy"],
    sizes: ["S", "M", "L"],
    stock: 35,
    images: [img("product6.jpg")],
  },
  {
    name: "High-Waist Tailored Trousers",
    description: "Structured high-waist trousers with a straight leg and side pockets. Office to evening.",
    price: 1799,
    mainCategory: "Women",
    subCategory: "Trousers",
    colors: ["Black", "Beige", "Grey"],
    sizes: ["S", "M", "L", "XL"],
    stock: 28,
    images: [img("product7.jpg")],
  },
  {
    name: "Soft Cotton Infant Romper",
    description: "Snap-button romper in gentle organic cotton. Comfortable for playtime and naptime.",
    price: 799,
    mainCategory: "Kids",
    subCategory: "Infant Rompers",
    colors: ["White", "Blue"],
    sizes: ["S", "M", "L"],
    stock: 60,
    images: [img("product8.jpg")],
  },
  {
    name: "Teens Graphic Tee",
    description: "Fun graphic-print tee in soft combed cotton. Durable everyday wear for growing kids.",
    price: 699,
    mainCategory: "Kids",
    subCategory: "Teens Casuals",
    colors: ["Black", "Red", "Blue"],
    sizes: ["S", "M", "L"],
    stock: 45,
    images: [img("product1.jpg")],
  },
];

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  // Clear previous seed data
  await Promise.all([
    categoryModel.deleteMany({}),
    productModel.deleteMany({}),
    orderModel.deleteMany({}),
    addressModel.deleteMany({}),
    userModel.deleteMany({ email: { $in: ["asha@example.com", "rahul@example.com"] } }),
  ]);
  console.log("Cleared old categories/products/orders/addresses + demo users");

  // Categories
  await categoryModel.insertMany(categories);
  console.log(`Inserted ${categories.length} categories`);

  // Products
  const createdProducts = await productModel.insertMany(products);
  console.log(`Inserted ${createdProducts.length} products`);

  // Demo users (verified so they can log in immediately)
  const passwordHash = await bcrypt.hash("Password123", 10);
  const [asha, rahul] = await userModel.create([
    {
      name: "Asha Verma",
      email: "asha@example.com",
      password: passwordHash,
      phoneNo: "9876543210",
      isVerified: true,
    },
    {
      name: "Rahul Nair",
      email: "rahul@example.com",
      password: passwordHash,
      phoneNo: "9812345678",
      isVerified: true,
    },
  ]);
  console.log("Inserted 2 demo users (password: Password123)");

  // Address for Asha
  const address = await addressModel.create({
    user: asha._id,
    firstName: "Asha",
    lastName: "Verma",
    country: "India",
    flatColony: "12B, Green Residency, MG Road",
    state: "Karnataka",
    city: "Bengaluru",
    zipCode: "560001",
    mobileNumber: { countryCode: "+91", number: "9876543210" },
    isDefault: true,
  });

  // A couple of orders so dashboard/report stats have data
  const line = (p, qty, size, color) => ({
    productId: p._id,
    quantity: qty,
    size,
    color,
    price: p.price,
  });

  const order1Items = [
    line(createdProducts[0], 2, "M", "White"),
    line(createdProducts[3], 1, "L", "Navy"),
  ];
  const order1Total = order1Items.reduce((s, i) => s + i.price * i.quantity, 0);

  const order2Items = [line(createdProducts[4], 1, "M", "Beige")];
  const order2Total = order2Items.reduce((s, i) => s + i.price * i.quantity, 0);

  const orders = await orderModel.create([
    {
      user: asha._id,
      orderItems: order1Items,
      shippingAddress: address._id,
      paymentMethod: "COD",
      totalPrice: order1Total,
      orderStatus: "Delivered",
      isPaid: true,
      paidAt: new Date(),
      paymentStatus: "Completed",
    },
    {
      user: asha._id,
      orderItems: order2Items,
      shippingAddress: address._id,
      paymentMethod: "COD",
      totalPrice: order2Total,
      orderStatus: "Processing",
    },
  ]);

  // Link orders back onto the user
  asha.orders = orders.map((o) => o._id);
  await asha.save();
  console.log(`Inserted ${orders.length} demo orders for Asha`);

  console.log("\n✅ Seed complete.");
  console.log("   Admin login : admin@maurish.com / admin123");
  console.log("   Demo user   : asha@example.com / Password123");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
