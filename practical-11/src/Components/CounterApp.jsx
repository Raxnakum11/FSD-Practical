import React, { useState } from 'react';

function CounterApp() {
  // State for counter value
  const [count, setCount] = useState(0);
  
  // State for name inputs
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');

  // Counter functions
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);
  const incrementFive = () => setCount(count + 5);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Counter App</h1>
      
      {/* Counter Section */}
      <div>
        <h2>Counter</h2>
        <p style={{ fontSize: '24px' }}>{count}</p>
        
        <div>
          <button onClick={increment}>Increment</button>
          <button onClick={decrement}>Decrement</button>
          <button onClick={incrementFive}>Increment by 5</button>
          <button onClick={reset}>Reset</button>
        </div>
      </div>

  
      <div style={{ marginTop: '30px' }}>
        <h2>Name Information</h2>
        
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
          />
        </div>
        
        <div style={{ marginTop: '10px' }}>
          <label>Surname:</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="Enter your surname"
          />
        </div>

        {(firstName || surname) && (
          <div style={{ marginTop: '20px' }}>
            <h3>Hello!</h3>
            <p>
              {firstName && surname 
                ? `${firstName} ${surname}` 
                : firstName || surname
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CounterApp;