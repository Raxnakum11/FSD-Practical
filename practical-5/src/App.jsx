import React, { useState } from "react";
import "./App.css";

const operators = ["/", "*", "+", "-", "DEL"];
const numbers = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["0", ".", "="],
];

function App() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  const handleButtonClick = (value) => {
    if (value === "DEL") {
      setExpression(expression.slice(0, -1));
      setResult("");
    } else if (value === "=") {
      try {
        // eslint-disable-next-line no-eval
        const evalResult = eval(expression);
        setResult(evalResult);
      } catch {
        setResult("Error");
      }
    } else {
      if (result && /[0-9.]/.test(value)) {
        setExpression(value);
        setResult("");
      } else {
        setExpression(expression + value);
        setResult("");
      }
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator-display">
        {result !== "" && <span className="calculator-result">({result})</span>}
        <span className="calculator-expression">{expression || "0"}</span>
      </div>
      <div className="calculator-operators">
        {operators.map((op) => (
          <button
            key={op}
            className={`calculator-btn operator${op === "DEL" ? " del" : ""}`}
            onClick={() => handleButtonClick(op)}
            type="button"
          >
            {op}
          </button>
        ))}
      </div>
      <div className="calculator-numpad">
        {numbers.map((row, i) => (
          <div className="calculator-row" key={i}>
            {row.map((num) => (
              <button
                key={num}
                className="calculator-btn"
                onClick={() => handleButtonClick(num)}
                type="button"
              >
                {num}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;