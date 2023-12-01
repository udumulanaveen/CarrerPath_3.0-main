import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import { faCreditCard, faGear, faInfoCircle, faPhone, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { customStyles, paymentStyles, setItemHelper } from '../utils';
import Modal from 'react-modal';
import { getSpecializations, registerCoach } from '../apis';
import Forminput from '../Components/Forminput';
import { updateUser } from '../redux/actions/user';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import razorIMG from '../assets/razorpay.svg';
import LoadingIndicator from '../Components/LoadingIndicator';

Modal.setAppElement('#root');

export default function WantToBeCoach() {
  const [isModalShowing, setisModalShowing] = useState(false);
  const [state, setstate] = useState({});
  const [loading, setloading] = useState(false);
  const [specializations, setspecializations] = useState([]);
  const [checkoutmodalOpen, setcheckoutmodalOpen] = useState(false);

  const { token, user } = useSelector((state) => state.userDetails);

  const dispatch = useDispatch();

  const setField = setItemHelper(state, setstate);
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

  const handleSave = () => {
    setloading(true);
    registerCoach(user.id, state)
      .then((response) => {
        if (response.success) {
          dispatch(updateUser({ user: response.user }));
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

  if (user.areaOfSpecialization) {
    return <Redirect to='/appointments' />;
  }

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className='d-flex'>
        <Sidebar />
        <div className='main-content'>
          {!user.areaOfSpecialization && (
            <h3 onClick={(e) => setisModalShowing(true)} className='text-start p-4 navigators'>
              <u>Want to become a coach?</u>
            </h3>
          )}
        </div>
      </div>
      <Modal isOpen={isModalShowing} style={customStyles}>
        <div className='modal-inner-div shadow'>
          <div onClick={(e) => setisModalShowing(false)} className='btn btn-modal-close'>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <div className='py-5'></div>
          <h2 className='text-center'>Coach Registration</h2>
          <div className='py-3'></div>
          <div className='px-4'>
            <div className='mb-4'>
              <div className='input-icons'>
                <FontAwesomeIcon className='icon' icon={faGear} />
                <select
                  className='input-field form-control form-select'
                  value={state.areaOfSpecialization}
                  onChange={(e) => setField('areaOfSpecialization')(e.target.value)}
                >
                  <option disabled selected>
                    Area of specialization
                  </option>
                  {specializations.map((s) => (
                    <option value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {[
              { placeholder: 'Contact Number', icon: faPhone, value: state.contact, onChange: setField('contact') },
            ].map((a) => (
              <Forminput key={a.placeholder} {...a} />
            ))}
            <div className='text-center mb-5'>
              <div className='row no-gutters'>
                <div className='col'>
                  <div onClick={(e) => setcheckoutmodalOpen(true)} className='btn login-btn-a px-5'>
                    Register
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal isOpen={checkoutmodalOpen} style={paymentStyles}>
        <div className='row no-gutters'>
          <div className='col'>
            <img src={razorIMG} width={400} alt='' />
          </div>
          <div className='col text-end'>
            <h3 className='pt-3 clr-gold'>Checkout | Confirmation</h3>
          </div>
        </div>
        <div className='my-3'></div>
        <div className='row no-gutters'>
          <h3 className='clr-grey'>Check out</h3>
          <div className='col clr-grey'>
            <div className='col-12 border-grey'>
              <h4>Personal Details</h4>
            </div>
            <div className='my-3'></div>
            <div className='row no-gutters'>
              <div className='col text-dark'>
                <p className='m-0'>First Name</p>
                <Forminput />
              </div>
              <div className='col text-dark'>
                <p className='m-0'>Last Name</p>
                <Forminput />
              </div>
            </div>
            <div className='col-8 text-dark'>
              <p className='m-0'>Email Address</p>
              <Forminput />
            </div>
            <div className='my-3'></div>
            <div className='col-12 text-dark border-grey'>
              <h5>Payment Method</h5>
            </div>
            <div className='my-3'></div>
            <div className='col text-dark'>
              <p className='m-0'>Wallet Payment</p>
              <div class='form-check form-check-inline'>
                <input
                  class='form-check-input'
                  type='radio'
                  name='inlineRadioOptions'
                  id='inlineRadio1'
                  value='option1'
                />
                <label class='form-check-label' for='inlineRadio1'>
                  Google Pay
                </label>
              </div>
              <div class='form-check form-check-inline'>
                <input
                  class='form-check-input'
                  type='radio'
                  name='inlineRadioOptions'
                  id='inlineRadio2'
                  value='option2'
                />
                <label class='form-check-label' for='inlineRadio2'>
                  PayPal
                </label>
              </div>
              <div className='my-3'></div>
              <p className='clr-grey'> Payment with cards</p>
              <div className='col-6 bg-gold p-1'>
                <h4 className='text-dark'>Debit Card / Credit Card</h4>
                <p className='clr-grey small m-0'>
                  You are choosing card payment option. Please fill the details of our card.
                </p>
              </div>
            </div>
          </div>
          <div className='col clr-grey'>
            <div className='col-12 border-grey'>
              <h4>Card Details</h4>
            </div>
            <div className='my-3'></div>
            <div className='col-12 text-dark'>
              <p className='m-0'>Name on Card</p>
              <Forminput />
            </div>
            <div className='col-12 text-dark'>
              <p className='m-0'>Card Number</p>
              <Forminput icon={faCreditCard} />
            </div>
            <div className='row no-gutters'>
              <div className='col text-dark'>
                <p className='m-0'>Valid Through (MM/YY)</p>
                <Forminput />
              </div>
              <div className='col text-dark'>
                <p className='m-0'>CVV 3 Digits</p>
                <Forminput icon={faInfoCircle} />
              </div>
            </div>
            <div className='my-3'></div>
            <LoadingIndicator isLoading={loading}>
              <div className='row'>
                <div className='col text-center'>
                  <div
                    onClick={(e) => setcheckoutmodalOpen(false)}
                    className='btn logout-btn logout-btn-appointment px-5'
                  >
                    Cancel
                  </div>
                </div>
                <div className='col text-center'>
                  <div onClick={handleSave} className='btn login-btn-a px-5'>
                    Checkout
                  </div>
                </div>
              </div>
            </LoadingIndicator>
          </div>
        </div>
      </Modal>
    </>
  );
}
