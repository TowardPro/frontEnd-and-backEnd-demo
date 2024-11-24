const mongoose = require("mongoose");

const OrderModelSchema = new mongoose.Schema(
  {
  buyTime: { 
    day: Number,
    month: Number,
    year: Number,
    record:{    
      order:String,
  cost: Number,
  userId: String,
  userName: String,
},
  },
  },
  {
    collection: "OrderInfo",
  }
);

mongoose.model("OrderInfo", OrderModelSchema);
