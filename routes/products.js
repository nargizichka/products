const express = require("express");
const Product = require("../models/products");
const upload = require("../upload");
const router = express.Router();

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const { name, price, color, category } = req.body;
    const imagePath = req.file ? req.file.path : null;
    const newProduct = new Product({ name, price, color, category, imagePath });
    const savedProduct = await newProduct.save();
    res.status(201).send(savedProduct);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category").exec();
    if (!product) return res.status(404).send("Product not found.");
    res.send(product);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { color, category, lte, gte, page = 1, limit = 10 } = req.query;
    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).send("Page and limit must be numbers.");
    }
    if (lte && isNaN(lte)) return res.status(400).send("lte must be a number.");
    if (gte && isNaN(gte)) return res.status(400).send("gte must be a number.");

    let query = {};
    if (color) query.color = color;
    if (category) query.category = category;
    if (lte || gte) {
      query.price = {};
      if (lte) query.price.$lte = Number(lte);
      if (gte) query.price.$gte = Number(gte);
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
});


router.put("/:id", upload.single("image"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, color, category } = req.body;
    const imagePath = req.file ? req.file.path : null;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, color, category, ...(imagePath && { imagePath }) },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).send("Product not found.");
    res.send(updatedProduct);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id).exec();
    if (!deletedProduct) return res.status(404).send("Product not found.");
    res.send(`Product deleted successfully: ${deletedProduct.name}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
