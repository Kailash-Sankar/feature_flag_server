const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuditSchema = new Schema(
  {
    key: {}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Audit", AuditSchema);
