import React from 'react'
import "./navbar.css"
import logo_dark from "../../src/assets/logo-black.png"
import logo_light from "../../src/assets/logo-white.png"
import search_icon_dark from "../../src/assets/search-b.png"
import search_icon_light from "../../src/assets/search-w.png"
import toggle_icon_dark from "../../src/assets/day.png"
import toggle_icon_light from "../../src/assets/night.png"

const navbar = ({theme,setTheme}) => {

    const toggle_mode = () =>{
        theme == 'dark' ? setTheme('light') : setTheme('dark');
    }
  return (
    <div className='navbar'>
      <img src={theme == 'dark' ? logo_dark : logo_light} alt="" className='logo' />
      <ul>
        <li>Home</li>
        <li>Services</li>
        <li>About</li>
        <li>Contact</li>
      </ul>

      <div className="search-box">
        <input type="text"  placeholder="Search"/>
        <img src={theme == 'dark' ? search_icon_dark: search_icon_light} alt="" />
      </div>

      

      <img onClick={()=>{toggle_mode()}} src={theme == 'dark' ? toggle_icon_dark : toggle_icon_light} alt="" className="toggle-icon" />
    </div>
  )
}

export default navbar
