import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export default function Forminput({ klass, type, placeholder, value, icon, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  return (
    <div className='mb-4'>
      <div className='input-icons'>
        {icon && <FontAwesomeIcon className='icon' icon={icon} />}
        <input
          className={'input-field form-control ' + klass}
          type={type ?? 'text'}
          onChange={handleChange}
          value={value}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
