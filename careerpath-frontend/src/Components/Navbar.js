import React from 'react';
import { useDispatch } from 'react-redux';
import logo from '../assets/logonew.png';
import { removeUser } from '../redux/actions/user';
export default function Navbar({ isLoggedIn }) {
  const dispatch = useDispatch();
  return (
    <nav className='navbar navbar-light'>
      <div className='d-flex'>
        <a className='navbar-brand' href='#'>
          <img src={logo} width='200' className='d-inline-block align-top logo-img' alt='' />
        </a>
        <div className='app-name'>CAREER PATH 3.0</div>
      </div>
      {isLoggedIn && (
        <button onClick={(e) => dispatch(removeUser())} className='btn logout-btn'>
          Sign out
        </button>
      )}
    </nav>
  );
}
