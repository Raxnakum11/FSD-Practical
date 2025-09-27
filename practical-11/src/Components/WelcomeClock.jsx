import React, { useState, useEffect } from 'react';

function WelcomeClock() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>Welcome to my first React App!</h1>
      <h2>
        Current Date and Time:<br />
        {dateTime.toLocaleString()}
      </h2>
    </div>
  );
}

export default WelcomeClock;
