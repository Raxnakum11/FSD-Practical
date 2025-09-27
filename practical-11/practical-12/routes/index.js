var express = require("express");
var router = express.Router();

/* GET home page - Show calculator form */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Simple Calculator",
    result: null,
    error: null,
    num1: "",
    num2: "",
    operation: "",
  });
});

/* POST calculator operation */
router.post("/", function (req, res, next) {
  const { num1, num2, operation } = req.body;
  let result = null;
  let error = null;

  // Validate inputs
  if (!num1 || !num2 || !operation) {
    error = "Please fill in all fields!";
  } else if (isNaN(num1) || isNaN(num2)) {
    error = "Please enter valid numbers only!";
  } else {
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);

    // Perform calculation
    switch (operation) {
      case "add":
        result = number1 + number2;
        break;
      case "subtract":
        result = number1 - number2;
        break;
      case "multiply":
        result = number1 * number2;
        break;
      case "divide":
        if (number2 === 0) {
          error = "Cannot divide by zero!";
        } else {
          result = number1 / number2;
        }
        break;
      default:
        error = "Please select a valid operation!";
    }
  }

  res.render("index", {
    title: "Kids Calculator",
    result: result,
    error: error,
    num1: num1 || "",
    num2: num2 || "",
    operation: operation || "",
  });
});

module.exports = router;
