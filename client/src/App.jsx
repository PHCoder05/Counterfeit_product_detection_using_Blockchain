import { useEffect, useState } from 'react'
import { EthProvider } from "./contexts/EthContext";
import Navbar from "./components/navbar"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Auth from "./components/Auth";
import Home from "./components/Home";
import React from "react";

function App() {
  const current_theme = localStorage.getItem('current_theme');
  const [theme,setTheme] = useState(current_theme ? current_theme: 'dark');

  useEffect(() => {
    localStorage.setItem('current_theme',theme);
  },[theme])
  return (
  
    <EthProvider>
       <div className={`navcontainer ${theme}`}>
      <Navbar theme={theme} setTheme={setTheme}/>
    </div>
      <div id="App" >
        <div className={`container ${theme}`}>
        <Router>
          <Routes>
            <Route path="" element={<Auth />} />
            <Route path="home" element={<Home />} />
          </Routes>
        </Router>
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
