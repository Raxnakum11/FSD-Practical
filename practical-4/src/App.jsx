import React, { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleIncrement = () => setCount(count + 1);
  const handleDecrement = () => setCount(count - 1);
  const handleReset = () => setCount(0);
  const handleIncrementFive = () => setCount(count + 5);

  return (
    <div className="container">
      <div className="counter-box">
        <h1 className="count-title">Count: {count}</h1>
        <div className="button-row">
          <button onClick={handleReset}>Reset</button>
          <button onClick={handleIncrement}>Increment</button>
          <button onClick={handleDecrement}>Decrement</button>
          <button onClick={handleIncrementFive}>Increment 5</button>
        </div>
        <h2 className="welcome">Welcome to CHARUSAT!!!</h2>
        <form className="name-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-row">
            <label htmlFor="firstName">First Name:</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="input-row">
            <label htmlFor="lastName">Last Name:</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="off"
            />
          </div>
        </form>
        <div className="output-row">
          <div>
            First Name: <span className="output-value">{firstName}</span>
          </div>
          <div>
            Last Name: <span className="output-value">{lastName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
