import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { faGear, faPhone, faTimes, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { customStyles, setItemHelper } from '../utils';
import Forminput from './Forminput';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { bookAppointment, deleteAppointment, getSlots } from '../apis';
import moment from 'moment';
import LoadingIndicator from './LoadingIndicator';
import DatePicker from 'react-date-picker';

Modal.setAppElement('#root');
export default function Appointmentrow({ title, image, coach, description, appointment, slot }) {
  const [isModalShowing, setisModalShowing] = useState(false);
  const [state, setstate] = useState({});
  const { user } = useSelector((state) => state.userDetails);
  const [date, setdate] = useState(null);
  const [slots, setslots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const setField = setItemHelper(state, setstate);
  const [loading, setloading] = useState(false);
  const [deleting, setdeleting] = useState(false);
  const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setisUpdateModalOpen] = useState(false);

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
  const handleDeleteAppointment = () => {
    setdeleting(true);
    deleteAppointment({
      oldSlotId: slot.id,
      oldAppointmentId: appointment.id,
    }).then((res) => {
      if (res.success) {
        window.location.reload();
      } else {
        return;
      }
    });
  };

  const handleBookSlot = () => {
    setloading(true);
    bookAppointment({
      coachId: appointment.coachId,
      contact: state.contact,
      studentId: appointment.studentId,
      slotId: selectedSlot,
      oldSlotId: slot.id,
      oldAppointmentId: appointment.id,
    }).then((res) => {
      if (res.success) {
        setdate(new Date());
        setSelectedSlot(null);
        window.location.reload();
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
      <LoadingIndicator isLoading={deleting}>
        <div className='col m-2'>
          <button
            onClick={(e) => setisUpdateModalOpen(true)}
            className='btn my-2 logout-btn logout-btn-appointment mx-4 small'
          >
            Reshedule Appointment
          </button>
          <button onClick={(e) => setisDeleteModalOpen(true)} className='btn logout-btn logout-btn-appointment my-2 mx-4 small'>
            Cancel Appointment
          </button>
        </div>
      </LoadingIndicator>
      <Modal isOpen={isModalShowing} style={customStyles}>
        <div className='modal-inner-div shadow'>
          <div onClick={(e) => setisModalShowing(false)} className='btn btn-modal-close'>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <div className='py-5'></div>
          <h2 className='text-center'>Update An Appointment</h2>
          <div className='px-4'>
            <div className='mb-4'>
              <div className='input-icons'>
                <FontAwesomeIcon className='icon' icon={faCalendar} />
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
                      <FontAwesomeIcon className='icon' icon={faGear} />
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
                </div>
              )}
              <div className='text-center mb-5'>
                <div className='row no-gutters'>
                  <div className='col'>
                    <div onClick={handleBookSlot} className='btn login-btn-a px-5'>
                      Reschedule
                    </div>
                  </div>
                </div>
              </div>
            </LoadingIndicator>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} style={customStyles}>
        <div className='modal-inner-div shadow'>
          <div onClick={(e) => setisDeleteModalOpen(false)} className='btn btn-modal-close'>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <div className='py-5'></div>
          <h2 className='text-center'>Cancel Appointment</h2>
          <div className='px-5 mx-2'>
            <p className='text-justify'>
              You have to make a new appointment upon cancelling this appointment, you can no longer use this
              appointment. <br />
              Are you sure?
            </p>
            <LoadingIndicator isLoading={loading}>
              <div className='text-center mb-5'>
                <div className='row no-gutters'>
                  <div className='col'>
                    <div onClick={handleDeleteAppointment} className='btn login-btn-a px-5'>
                      Yes
                    </div>
                  </div>
                  <div className='col'>
                    <div onClick={(e) => setisDeleteModalOpen(false)} className='btn login-btn-a px-5'>
                      No
                    </div>
                  </div>
                </div>
              </div>
            </LoadingIndicator>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isUpdateModalOpen} style={customStyles}>
        <div className='modal-inner-div shadow'>
          <div onClick={(e) => setisUpdateModalOpen(false)} className='btn btn-modal-close'>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <div className='py-5'></div>
          <h2 className='text-center'>Reshedule Appointment</h2>
          <div className='px-5 mx-2'>
            <p className='text-justify'>
              The appointment details will be updated. <br />
              Are you sure?
            </p>
            <LoadingIndicator isLoading={loading}>
              <div className='text-center mb-5'>
                <div className='row no-gutters'>
                  <div className='col'>
                    <div
                      onClick={(e) => {
                        setisUpdateModalOpen(false);
                        setisModalShowing(true);
                      }}
                      className='btn login-btn-a px-5'
                    >
                      Yes
                    </div>
                  </div>
                  <div className='col'>
                    <div onClick={(e) => setisUpdateModalOpen(false)} className='btn login-btn-a px-5'>
                      No
                    </div>
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
