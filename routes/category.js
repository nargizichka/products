const express = require("express");
const Category = require("../models/category");
const router2 = express.Router();

router2.post("/", async (req, res) => {
  console.log(req.body);
  const newCategory = new Category(req.body);
  const savedCategory = await newCategory.save();
  res.status(201).send(savedCategory);
});

router2.get("/:id", async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id).exec();
  res.send(category);
});

router2.get("/", async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

router2.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true }).exec();
  res.send(updatedCategory);
});

router2.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndDelete(id).exec();
  res.send(deletedCategory);
});

module.exports = router2;