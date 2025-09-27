import React, { useState } from "react";
import "./App.css";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <button
        className="sidebar-toggle"
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        onClick={() => setSidebarOpen((open) => !open)}
      >
        <span className="menu-icon">&#9776;</span>
      </button>
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <nav>
          <ul>
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className={sidebarOpen ? "shifted" : ""}>
        <h1>Welcome to My Website</h1>
        <p>This is the main content of the webpage.</p>
      </main>
    </div>
  );
}

export default App;
