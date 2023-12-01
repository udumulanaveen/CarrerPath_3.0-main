import React from 'react';
import { Spinner } from 'react-bootstrap';

export default ({ isLoading, small, children }) => {
  const normalStyles = {
    padding: '20px',
    margin: '0 auto',
    width: '60px',
  };

  const smallStyles = {
    ...normalStyles,
    width: '30px',
  };

  const styles = small ? smallStyles : normalStyles;

  return isLoading ? (
    <div style={styles}>
      <Spinner animation='border' role='status' variant='primary' />
    </div>
  ) : (
    <> {children} </>
  );
};
