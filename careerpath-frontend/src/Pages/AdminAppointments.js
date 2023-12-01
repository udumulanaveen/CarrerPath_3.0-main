import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAllAppointments } from '../apis';
import LoadingIndicator from '../Components/LoadingIndicator';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import appointmentiMG from '../assets/appointment.svg';
import AppointmentAppointmentsrow from '../Components/AdminAppointmentsRow';

export default function AdminAppointments() {
  const [appointments, setappointments] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setloading(true);
    getAllAppointments()
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
            {appointments.map((a, i) => (
              <AppointmentAppointmentsrow
                key={a.id}
                appointment={a}
                slot={a.slotDetails}
                image={appointmentiMG}
                title={'Appointment ' + (i + 1)}
                {...a}
                coach={a.coachDetails}
              />
            ))}
          </LoadingIndicator>
        </div>
      </div>
    </>
  );
}
