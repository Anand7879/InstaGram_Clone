import { Home, Search, Compass, PlaySquare, Send, Heart, PlusSquare, User, Menu, Grid3x3 } from 'lucide-react';
import React from 'react';  
const HomePage = () => {
    
  const navItems = [
    { icon: Home, label: 'Home' },
    { icon: Search, label: 'Search' },
    { icon: Compass, label: 'Explore' },
    { icon: PlaySquare, label: 'Reels' },
    { icon: Send, label: 'Messages' },
    { icon: Heart, label: 'Notifications' },
    { icon: PlusSquare, label: 'Create' },
    { icon: User, label: 'Profile' },
  ];
   
  const bottomItems = [
    { icon: Menu, label: 'Menu' },
    { icon: Grid3x3, label: 'More' },
  ];  

  return (
    <div className='home-container'>
      <div className='sidebar'>
        <div className='logo'>
          <h2>Instagram</h2>
        </div>
        <nav>
          <ul>
            {navItems.map((item, index) => (
              <li key={index} className='nav-item'>
                <item.icon size={24} />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
        <div className='bottom-items'>
          {bottomItems.map((item, index) => (
            <button key={index} className='nav-item '>
              <item.icon size={24} />
              <span>{item.label}</span>
            </button>
          ))}

        </div>
      </div>
      <div className='main-content'>
    </div>
    </div>
  );
};
export default HomePage;