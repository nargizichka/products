const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    color: String,
    imagePath: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
      },})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product;