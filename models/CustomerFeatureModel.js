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
        description: String,
        product: String,
        attributes: {},
        config: {}
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerFeature", CustomerFeatureSchema);
