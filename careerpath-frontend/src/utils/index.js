export function setItemHelper(state, setState) {
    const setItem = (key) => {
        return  value => {
            setState({
                ...state,
                [key]: value
            });
        };
    };

    return setItem
};

export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: 'transparent',
    border: 'none',
  },
};

export const paymentStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#fff',
    border: 'none',
    width: '100vw',
    height: '100vh',
    color: 'black',
    padding: '20px',
  },
};