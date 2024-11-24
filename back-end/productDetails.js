const mongoose = require("mongoose");

const ProductDetailsScehma = new mongoose.Schema(
  {
    record:[{
            name: String,
        price: Number,
        quantity: Number,
        image: String,
        productId: Number,
        storage: Number,
        supplier: String,
  }],
  cost: Number,
  userId: String,
  },
  {
    collection: "ProductInfo",
  }
);

mongoose.model("ProductInfo", ProductDetailsScehma);
