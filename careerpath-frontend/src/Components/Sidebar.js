import React from 'react';
import { useSelector } from 'react-redux';
import logo from '../assets/logo-alt.svg';
import * as _ from 'lodash';
import { Link } from 'react-router-dom';
export default function Sidebar() {
  const { user } = useSelector((s) => s.userDetails);
  return (
    <div className='side-bar'>
      <p className='text-center pt-3 loggedin-user'>{_.capitalize(user.userType)} Dashboard</p>
      <div className='logo-div text-center'>
        <img src={logo} className='sidebar-logo' width='250' alt='' />
      </div>
      <div className='small mt-5 sidebar-info-div mx-auto'>
        <p>Name: {user.name || user.username}</p>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
      </div>
      {user.userType === 'student' && (
        <div className='side-links sidebar-info-div small mx-auto'>
          <div className='btn-side'>
            <Link to={'/profile/' + user.id} className=''>
              Personal Information
            </Link>
          </div>
          <div className='btn-side'>
            <Link to='/appointments' className='btn-side'>
              Scheduled Appointments
            </Link>
          </div>
          <div className='btn-side'>
            <Link to='/recommendations' className='btn-side'>
              View Recommendations
            </Link>
          </div>
        </div>
      )}
      {user.userType === 'coach' && (
        <div className='side-links sidebar-info-div small mx-auto'>
          <div className='btn-side'>
            <Link to={'/profile/' + user.id} className=''>
              Personal Information
            </Link>
          </div>
          <div className='btn-side'>
            <Link to='/appointments' className='btn-side'>
              Scheduled Appointments
            </Link>
          </div>
        </div>
      )}
      {user.userType === 'admin' && (
        <div className='side-links sidebar-info-div small mx-auto'>
          <div className='btn-side'>
            <Link to='/dashboard' className=''>
              Dashboard
            </Link>
          </div>
          <div className='btn-side'>
            <Link to={'/profile/' + user.id} className=''>
              Personal Information
            </Link>
          </div>
        </div>
      )}
      <div className='side-bar-footer sidebar-info-div small mx-auto'>
        For further assistance, please contact admin@pfw.edu{' '}
      </div>
    </div>
  );
}
