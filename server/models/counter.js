// models/Counter.js
const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 9000000000 },
});

module.exports = mongoose.model("Counter", counterSchema);
// This schema is used to generate unique account numbers in a safe, atomic way.
// The `value` field starts at 9000000000 and increments by 1 each
