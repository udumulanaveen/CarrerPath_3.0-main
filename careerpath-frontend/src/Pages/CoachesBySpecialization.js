import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCoachesOfSpecialization } from '../apis';
import LoadingIndicator from '../Components/LoadingIndicator';
import Coachrow from '../Components/Coachrow';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import Forminput from '../Components/Forminput';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function CoachesBySpecialization() {
  const [coaches, setcoaches] = useState([]);
  const [loading, setloading] = useState(false);
  const [coachFilter, setcoachFilter] = useState();
  const [filteredCoaches, setfilteredCoaches] = useState([]);

  let params = useParams();
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (coachFilter) {
      let coachesByFilter = coaches.filter(
        (a) => (a.name && a.name.indexOf(coachFilter) > -1) || (a.username && a.username.indexOf(coachFilter) > -1)
      );
      setcoaches(coachesByFilter);
    } else {
      fetchData();
    }
  }, [coachFilter])
  

  const fetchData = () => {
    setloading(true);
    getCoachesOfSpecialization(params.id)
      .then((response) => {
        if (response.success) {
          setcoaches(response.coaches);
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
        <div className='main-content col mx-0 px-0 pt-4'>
          <div style={{ height: '80px', borderBottom: '1px solid #000' }} className='row'>
            <div className='col'>
              <h4 className='px-2'>Schedule Appointment</h4>
            </div>
            <div className='col-4 text-end'>
              <div className='px-1'>
                <Forminput placeholder='Coach Search' onChange={(s) => setcoachFilter(s)} icon={faMagnifyingGlass} />
              </div>
            </div>
          </div>
          <LoadingIndicator isLoading={loading}>
            {coaches.length === 0 && (
              <>
                <div className='text-center'>No Coaches found!</div>
              </>
            )}
            {coaches.map((a, i) => {
              let description = (
                <>
                  <p className='mb-1'>Coach Name: {a.name || a.username}</p>
                  <p className='mb-1'>Email ID: {a.email}</p>
                  <p className='mb-1'>Contact Number: {a.contact}</p>
                  <p className='mb-1'>Area Of Specialization: {a.specialization && a.specialization.name}</p>
                </>
              );
              return (
                <Coachrow
                  key={a.id}
                  image={a.specialization && a.specialization.image}
                  title={`Coach ${i + 1}`}
                  id={a.id}
                  coach={a}
                  description={description}
                />
              );
            })}
          </LoadingIndicator>
        </div>
      </div>
    </>
  );
}
