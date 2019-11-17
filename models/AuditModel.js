const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuditSchema = new Schema(
  {
    key: {
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Audit", AuditSchema);
