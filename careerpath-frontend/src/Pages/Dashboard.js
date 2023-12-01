import React from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom';

Modal.setAppElement('#root');

export default function Dashboard() {
  const history = useHistory();
  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className='d-flex'>
        <Sidebar />
        <div className='main-content'>
          <h5 onClick={(e) => history.push('/admin/users/coach')} className='text-start p-4 navigators'>
            <u>List of Coaches</u>
          </h5>
          <h5 onClick={(e) => history.push('/admin/users/student')} className='text-start p-4 navigators'>
            <u>List of Students</u>
          </h5>
          <h5 onClick={(e) => history.push('/admin/appointments')} className='text-start p-4 navigators'>
            <u>List of Scheduled Appointments</u>
          </h5>
        </div>
      </div>
    </>
  );
}
