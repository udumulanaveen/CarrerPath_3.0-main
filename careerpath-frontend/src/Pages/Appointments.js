import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAppointments } from '../apis';
import Appointmentrow from '../Components/Appointmentrow';
import LoadingIndicator from '../Components/LoadingIndicator';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import appointmentiMG from '../assets/appointment.svg'
export default function Appointments() {
  const [appointments, setappointments] = useState([]);
  const [loading, setloading] = useState(false);

  const { user } = useSelector((state) => state.userDetails);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setloading(true);
    getAppointments(user.userType, user.id)
      .then((response) => {
        if (response.success) {
          setappointments(response.appointments);
          setloading(false);
          return;
        } else {
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className='d-flex'>
        <Sidebar />
        <div className='main-content col'>
          <div style={{ height: '80px', borderBottom: '1px solid #000' }} className=''>
            <h4 className='pt-4 px-2'>Scheduled Appointments</h4>
          </div>
          <LoadingIndicator isLoading={loading}>
            {appointments.length === 0 && (
              <>
                <div className='text-center'>No appointments found!</div>
              </>
            )}
            {appointments.map((a, i) => {
              let coach = user.userType === 'student' ? a.otherUserDetails : user;
              let description = (
                <>
                  {a.otherUserDetails && (
                    <>
                      <p className='mb-1'>
                        {!a.isCoach ? 'Coach ' : 'Student '} Name:{' '}
                        {(a.otherUserDetails && a.otherUserDetails.name) || a.otherUserDetails.username}
                      </p>
                      <p className='mb-1'>Email ID: {a.otherUserDetails.email}</p>
                      <p className='mb-1'>Contact Number: {a.otherUserDetails.contact}</p>
                      <p className='mb-1'>
                        Schedule Time: {moment(a.slotDetails.start).format('MMMM Do YYYY, h:mm:ss a')}
                      </p>
                    </>
                  )}
                </>
              );
              return (
                <Appointmentrow
                  key={a.id}
                  description={description}
                  image={appointmentiMG}
                  coach={coach}
                  appointment={a}
                  slot={a.slotDetails}
                  title={(!a.isCoach ? 'Coach ' : 'Student ') + (i + 1)}
                />
              );
            })}
          </LoadingIndicator>
        </div>
      </div>
    </>
  );
}
