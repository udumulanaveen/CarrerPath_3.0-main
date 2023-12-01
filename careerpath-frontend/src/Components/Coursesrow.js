import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Coursesrow({ title, image, description, id }) {
  const history = useHistory();
  const handleSelectCourse = () => {
    history.push('/coaches/' + id);
  };
  return (
    <div className='row no-gutters border-bottom'>
      <div className='row no-gutters'>
        <p className='px-4 mb-0'>{title}</p>
      </div>
      <div className='col-2 m-2'>
        <img src={image} alt='' width={140} className='pt-0 mt-0' />
      </div>
      <div style={{ height: '140px', textAlign: 'justify', overflow: 'hidden' }} className='col small'>
        {description}
      </div>
      <div className='col-3 m-2'>
        <button onClick={handleSelectCourse} className='btn logout-btn mx-4 px-5'>
          Select
        </button>
      </div>
    </div>
  );
}
