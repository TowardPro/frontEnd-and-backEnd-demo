const mongoose = require("mongoose");

const ProductDetailsScehma = new mongoose.Schema(
  {
      image: String,
      name: String,
        price: String,
        productId: String,
        storage: String,
        category: String,
        date: String,
        supplier: String,
        staff: String,
  },
  {
    collection: "ProductStorage",
  }
);

mongoose.model("ProductStorage", ProductDetailsScehma);
