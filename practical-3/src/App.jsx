import React, { useEffect, useState } from "react";

function App() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();

  return (
    <div style={{ padding: "32px" }}>
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          color: "#212529",
          marginBottom: "24px",
        }}
      >
        Welcome to CHARUSAT!!!!
      </h1>
      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "#212529",
          marginBottom: "12px",
        }}
      >
        It is {formattedDate}
      </div>
      <div style={{ fontSize: "1.5rem", fontWeight: 600, color: "#212529" }}>
        It is {formattedTime}
      </div>
    </div>
  );
}

export default App;
