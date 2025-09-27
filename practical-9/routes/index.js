const express = require("express");
const router = express.Router();

// Home route: Respond with a welcome message
router.get("/", (req, res) => {
  res.send("Welcome to our site");
});

module.exports = router;
