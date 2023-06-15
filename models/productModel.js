const mongoose = require("mongoose");
// const Variant = require("./Variant");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  // variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variant" }],
  variants: [
    {
      name: String,
      sku: String,
      additionalCost: Number,
      stockCount: Number,
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
