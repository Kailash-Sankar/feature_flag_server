const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FeatureSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    product: { type: String, required: true },
    status: { type: Number, default: 0 },
    attributes: [
      {
        id: String,
        name: String,
        field: String, // 'type' key should not be used
        meta: {}
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feature", FeatureSchema);
