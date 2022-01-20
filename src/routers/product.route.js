const express = require("express");
const Product = require("../models/products.model");
const router = express.Router();

//get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (err) {
    res.status(500).send();
  }
});
//get product by id
router.get("/products/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(400).send(`Product not found - ${req.params.id}`);
    }
    res.send(product);
  } catch (err) {
    res.status(500).send(e);
  }
});
//get all active products
router.get("/products/isActive", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.send(products);
  } catch (err) {
    res.status(500).send(e);
  }
});
//get all producs in min-max price range
//gets values from (url) query parameters
router.get("/products", async (req, res) => {
  console.log("req.");
  const { minPrice, maxPrice } = req.query;
  try {
    await Product.find({
      "details.price": { $gte: minPrice, $lte: maxPrice },
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//upload new product
router.post("/products", async (req, res) => {
  const product = new Product(req.body);
  try {
    await product.save();
    res.status(201).send(product);
  } catch (err) {
    res.status(400).send(err);
  }
});

//delete a product
router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send(`Product not found - ${req.params.id}`);
    }
    res.send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});
//delete all products
router.delete("/products", async (req, res) => {
  try {
    const products = await Product.deleteMany({});
    if (products.deletedCount === 0) {
      return res.status(400).send("no products in shop");
    }
    res.send("all products have been deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

//Updates a Product (by certain parameters)
router.put("/products/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    // "name",
    // "category",
    "isActive",
    // "details.decription",
    // "details.price",
    "details.discount",
    // "details.imgs",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send("Invalid parameters for update");
  }

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(400).send(`Product not found - ${req.params.id}`);
    }
    res.send(product);
  } catch (err) {
    res.status(404).send(err);
  }
});

// const jsonProduct = {
//     "name": "watermelon",
//        "isActive":"true",
//     "category": "fruit",
//     "details": {
//       "description": "lemonsssssssssss",
//       "price": 25,
//       "images": ["fgdfg", "sdfg"],
//       "phone": "0501234547"
//     }
//   }
module.exports = router;
