import React, { useEffect, useState } from 'react';
import { getSpecializations } from '../apis';
import Coursesrow from '../Components/Coursesrow';
import LoadingIndicator from '../Components/LoadingIndicator';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';

export default function Courses() {
  const [specializations, setspecializations] = useState([]);
  const [loading, setloading] = useState(false);
  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = (e) => {
    setloading(true);
    getSpecializations()
      .then((response) => {
        if (response.success) {
          setspecializations(response.specializations);
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
          <LoadingIndicator isLoading={loading}>
            {specializations.map((course) => (
              <Coursesrow
                id={course.id}
                key={course.id}
                title={course.name}
                image={course.image}
                description={course.description}
              />
            ))}
          </LoadingIndicator>
        </div>
      </div>
    </>
  );
}
