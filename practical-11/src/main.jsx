import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WelcomeClock from "./Components/WelcomeClock";
import CounterApp from './Components/CounterApp.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    {/* <WelcomeClock /> */}
    <CounterApp />
  </StrictMode>,
)
