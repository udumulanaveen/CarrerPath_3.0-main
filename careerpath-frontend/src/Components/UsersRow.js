import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import { deleteUser } from '../apis';
import LoadingIndicator from './LoadingIndicator';

Modal.setAppElement('#root');
export default function UsersRow({ title, image, description, user }) {
  const [deleting, setdeleting] = useState(false);

  const history = useHistory();

  const handleDeleteUser = () => {
    setdeleting(true);
    deleteUser(user).then((res) => {
      if (res.success) {
        window.location.reload();
      } else {
        return;
      }
    });
  };

  return (
    <div className='row no-gutters border-bottom'>
      <div className='row no-gutters'>
        <p className='px-4 mb-0'>{title}</p>
      </div>
      <div className='col-2 m-2'>
        <img src={image} alt='' width={140} className='pt-0 mt-0' />
      </div>
      <div style={{ height: '140px', textAlign: 'justify' }} className='col small'>
        {description}
      </div>
      <LoadingIndicator isLoading={deleting}>
        <div className='col m-2 text-center'>
          <button
            onClick={(e) => history.push(`/profile/${user}`)}
            className='btn my-2 logout-btn logout-btn-appointment mx-4 small'
          >
            View Profile
          </button>
          <button onClick={handleDeleteUser} className='btn logout-btn logout-btn-appointment my-2 mx-4 small'>
            Delete Account
          </button>
        </div>
      </LoadingIndicator>
    </div>
  );
}
