const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FeatureSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    product: { type: String, required: true },
    attributes: [
      {
        name: String,
        value: {}
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feature", FeatureSchema);
