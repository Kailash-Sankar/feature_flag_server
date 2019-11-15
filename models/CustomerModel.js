const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    products: { type: [String], required: true }
    //user: { type: Schema.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema, "customer");
