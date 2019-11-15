const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerFeatureSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    features: [
      {
        name: String,
        id: String,
        status: Number,
        attributes: {},
        product: String,
        config: {}
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerFeature", CustomerFeatureSchema);
