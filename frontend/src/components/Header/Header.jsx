import React from 'react'
import './Header.css'
const Header = () => {

  const handleScrollToMenu = () => {
    document.getElementById('explore-menu').scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div>
      <div className="header">
        <div className="header-contents">
            <h2>Order your favourite food</h2>
            <p>Choose from a diverse menu featuring a delactable array of dishes crafted with the finest ingredients and satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
            <button onClick={handleScrollToMenu}>View Menu</button>
        </div>
      </div>
    </div>
  )
}

export default Header
