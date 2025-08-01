// Utility function to generate a unique transaction reference
// This function generates a random reference string for transactions
module.exports = () =>
  "TX-" + Math.random().toString(36).substr(2, 9).toUpperCase();
