import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getusers } from '../apis';
import LoadingIndicator from '../Components/LoadingIndicator';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import UsersRow from '../Components/UsersRow';
import * as _ from 'lodash';
import userIMG from '../assets/coach.svg';

export default function Users() {
  const params = useParams();
  const [users, setusers] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    fetchUsers(params.userType);
  }, [params.userType]);

  const fetchUsers = (userType) => {
    setloading(true);
    getusers(userType)
      .then((response) => {
        if (response.success) {
          setusers(response.users);
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
            {users.map((user, i) => {
              let description = (
                <>
                  <p className='mb-1'>
                    {_.capitalize(user.userType)} Name: {user.name || user.username}
                  </p>
                  <p className='mb-1'>Email ID: {user.email}</p>
                  <p className='mb-1'>Contact Number: {user.contact}</p>
                </>
              );
              return (
                <UsersRow
                  key={user.id}
                  user={user.id}
                  title={_.capitalize(user.userType) + ' ' + (i + 1)}
                  id={user.id}
                  image={userIMG}
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
