import React, { useContext, useState } from 'react';
import logo from '../assets/logo.png';
import { IoSearchCircleOutline, IoSearchCircleSharp } from 'react-icons/io5';
import { FaCircleUser } from 'react-icons/fa6';
import { MdOutlineShoppingCart, MdContacts } from 'react-icons/md';
import { IoMdHome } from 'react-icons/io';
import { HiOutlineCollection } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext.jsx';
import { shopDataContext } from '../context/ShopContext.jsx';

function Nav() {
  const { getCurrentUser, userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const { showSearch, setShowSearch, search, setSearch, getCartCount } = useContext(shopDataContext);

  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      console.log(result.data);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='w-full h-[70px] bg-[#ecfafaec] fixed top-0 z-10 flex items-center justify-between px-6 shadow-md shadow-black'>
      
      {/* Logo */}
      <div className='flex items-center gap-2 w-[20%] lg:w-[30%]'>
        <img src={logo} alt='logo' className='w-[30px]' />
        <h1 className='text-[25px] text-black font-sans'>BotCart</h1>
      </div>

      {/* Navigation Menu */}
      <div className='hidden md:flex w-[50%] lg:w-[40%]'>
        <ul className='flex items-center justify-center gap-5 text-black font-semibold'>
          <li className='nav-btn' onClick={() => navigate('/')}>HOME</li>
          <li className='nav-btn' onClick={() => navigate('/collection')}>COLLECTIONS</li>
          <li className='nav-btn' onClick={() => navigate('/about')}>ABOUT</li>
          <li className='nav-btn' onClick={() => navigate('/contact')}>CONTACT</li>
        </ul>
      </div>

      {/* Icons (Right side) */}
      <div className='flex items-center gap-5 w-[30%] justify-end'>
        {!showSearch ? (
          <IoSearchCircleOutline className='icon' onClick={() => { setShowSearch(prev => !prev); navigate('/collection'); }} />
        ) : (
          <IoSearchCircleSharp className='icon' onClick={() => setShowSearch(prev => !prev)} />
        )}
        {!userData ? (
          <FaCircleUser className='icon-sm' onClick={() => setShowProfile(prev => !prev)} />
        ) : (
          <div
            className='w-[30px] h-[30px] bg-black text-white rounded-full flex items-center justify-center cursor-pointer'
            onClick={() => setShowProfile(prev => !prev)}
          >
            {userData?.name?.[0]?.toUpperCase()}
          </div>
        )}
        <div className='relative hidden md:block'>
          <MdOutlineShoppingCart className='icon-sm' onClick={() => navigate('/cart')} />
          <p className='badge-cart absolute top-[-5px] right-[-5px]'>{getCartCount()}</p>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className='absolute top-full left-0 w-full h-[80px] bg-[#d8f6f9dd] flex items-center justify-center'>
          <input
            type='text'
            className='lg:w-1/2 w-4/5 h-3/5 bg-[#233533] rounded-full px-10 placeholder:text-white text-white text-lg'
            placeholder='Search Here'
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
      )}

      {/* Profile Dropdown */}
      {showProfile && (
        <div className='absolute top-[110%] right-4 w-[220px] h-[150px] bg-black/85 border border-gray-400 rounded-xl z-10'>
          <ul className='flex flex-col gap-2 text-white p-3 text-[17px]'>
            {!userData && (
              <li className='dropdown-item' onClick={() => { navigate('/login'); setShowProfile(false); }}>Login</li>
            )}
            {userData && (
              <li className='dropdown-item' onClick={() => { handleLogout(); setShowProfile(false); }}>Logout</li>
            )}
            <li className='dropdown-item' onClick={() => { navigate('/order'); setShowProfile(false); }}>Orders</li>
            <li className='dropdown-item' onClick={() => { navigate('/about'); setShowProfile(false); }}>About</li>
          </ul>
        </div>
      )}

      {/* Bottom Nav (Mobile) */}
      <div className='fixed bottom-0 left-0 w-full h-[90px] bg-[#191818] flex items-center justify-between px-5 md:hidden text-white text-[12px]'>
        <button className='mobile-nav-btn' onClick={() => navigate('/')}><IoMdHome className='mobile-icon' />Home</button>
        <button className='mobile-nav-btn' onClick={() => navigate('/collection')}><HiOutlineCollection className='mobile-icon' />Collections</button>
        <button className='mobile-nav-btn' onClick={() => navigate('/contact')}><MdContacts className='mobile-icon' />Contact</button>
        <button className='mobile-nav-btn relative' onClick={() => navigate('/cart')}>
          <MdOutlineShoppingCart className='mobile-icon' />Cart
          <p className='absolute top-0 right-0 badge-mobile-cart'>{getCartCount()}</p>
        </button>
      </div>
    </div>
  );
}

export default Nav;
