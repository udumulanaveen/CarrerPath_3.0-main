import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { faGear, faPhone, faTimes, faCalendar, faCreditCard, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { customStyles, paymentStyles, setItemHelper } from '../utils';
import Forminput from '../Components/Forminput';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { bookAppointment, getSlots } from '../apis';
import moment from 'moment';
import LoadingIndicator from './LoadingIndicator';
import DatePicker from 'react-date-picker';
import razorIMG from '../assets/razorpay.svg';

Modal.setAppElement('#root');
export default function Coursesrow({ title, image, coach, description }) {
  const [isModalShowing, setisModalShowing] = useState(false);
  const [state, setstate] = useState({});
  const { user } = useSelector((state) => state.userDetails);
  const [date, setdate] = useState(null);
  const [slots, setslots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [checkoutmodalOpen, setcheckoutmodalOpen] = useState(false);
  const setField = setItemHelper(state, setstate);
  const [loading, setloading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (isModalShowing && date) {
      fetchSlots();
    }
    // eslint-disable-next-line
  }, [date, isModalShowing]);

  const fetchSlots = () => {
    setloading(true);
    getSlots({
      date: moment(date).format('YYYY-MM-DD'),
      coachId: coach.id,
    }).then((res) => {
      if (res.success) {
        setslots(res.slots);
        setloading(false);
      } else {
        return;
      }
    });
  };

  const handleBookSlot = () => {
    setloading(true);
    bookAppointment({
      coachId: coach.id,
      contact: state.contact,
      studentId: user.id,
      slotId: selectedSlot,
    }).then((res) => {
      if (res.success) {
        setdate(new Date());
        setSelectedSlot(null);
        history.push('/appointments');
        setloading(false);
      } else {
        setloading(false);
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
      <div className='col-3 m-2'>
        <button onClick={(e) => setisModalShowing(true)} className='btn logout-btn logout-btn-appointment mx-4 small'>
          Make an Appointment
        </button>
      </div>
      <Modal isOpen={isModalShowing} style={customStyles}>
        <div className='modal-inner-div shadow'>
          <div onClick={(e) => setisModalShowing(false)} className='btn btn-modal-close'>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <div className='py-5'></div>
          <h2 className='text-center'>Make An Appointment</h2>
          <div className='px-4'>
            <div className='mb-4'>
              <div className='input-icons'>
                <FontAwesomeIcon className='icon' icon={faGear} />
                <DatePicker
                  clearIcon={''}
                  calendarIcon={''}
                  minDate={new Date()}
                  yearPlaceholder={'YYYY'}
                  dayPlaceholder={'DD'}
                  monthPlaceholder={'MM'}
                  className='input-field form-control'
                  onChange={setdate}
                  value={date}
                />
              </div>
            </div>
            <LoadingIndicator isLoading={loading}>
              {slots.length > 0 && (
                <div>
                  <div className='mb-4'>
                    <div className='input-icons'>
                      <FontAwesomeIcon className='icon' icon={faCalendar} />
                      <select
                        className='input-field form-control form-select'
                        value={selectedSlot && selectedSlot.id}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                      >
                        <option disabled selected>
                          Time Of Appointment
                        </option>
                        {slots.map((s) => (
                          <option disabled={s.booked} value={s.id}>
                            {s.start}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {[
                    {
                      placeholder: 'Contact Number',
                      icon: faPhone,
                      value: state.contact,
                      onChange: setField('contact'),
                    },
                  ].map((a) => (
                    <Forminput key={a.placeholder} {...a} />
                  ))}
                  <div className='text-center mb-5'>
                    <div className='row no-gutters'>
                      <div className='col'>
                        <div onClick={(e) => setcheckoutmodalOpen(true)} className='btn login-btn-a px-5'>
                          Schedule
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </LoadingIndicator>
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
                  <div onClick={(e) => setcheckoutmodalOpen(false)} className='btn logout-btn logout-btn-appointment px-5'>
                    Cancel
                  </div>
                </div>
                <div className='col text-center'>
                  <div onClick={handleBookSlot} className='btn login-btn-a px-5'>
                    Checkout
                  </div>
                </div>
              </div>
            </LoadingIndicator>
          </div>
        </div>
      </Modal>
    </div>
  );
}
