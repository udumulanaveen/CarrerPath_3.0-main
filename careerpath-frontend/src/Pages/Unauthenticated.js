import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Modal from 'react-modal';
import { customStyles, setItemHelper } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuildingUser,
  faCalendar,
  faCalendarDays,
  faFileCircleCheck,
  faGraduationCap,
  faKey,
  faPaperclip,
  faTimes,
  faUser,
  faUsersBetweenLines,
} from '@fortawesome/free-solid-svg-icons';
import Forminput from '../Components/Forminput';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { login, signup, uploadFile } from '../apis';
import LoadingIndicator from '../Components/LoadingIndicator';
import { useDispatch } from 'react-redux';
import { addUser } from '../redux/actions/user';

Modal.setAppElement('#root');

export default function Unauthenticated() {
  const [signUpmodalIsOpen, setsignUpmodalIsOpen] = useState(false);
  const [loginmodalIsOpen, setloginmodalIsOpen] = useState(false);
  const [logindetails, setlogindetails] = useState({});
  const [signupdetails, setsignupdetails] = useState({});
  const [view, setview] = useState(1);
  const [resumeShowname, setresumeShowname] = useState(null);
  const [certShowname, setcertShowname] = useState(null);
  const [loading, setloading] = useState(false);

  const certRef = React.useRef();
  const resumeRef = React.useRef();
  const setField = setItemHelper(logindetails, setlogindetails);
  const setItem = setItemHelper(signupdetails, setsignupdetails);

  const dispatch = useDispatch();
  let loginForm = () => {
    const form = [
      {
        placeholder: 'Email/Username',
        value: logindetails.emailOrUsername,
        icon: faUser,
        onChange: setField('emailOrUsername'),
      },
      {
        placeholder: 'Password',
        value: logindetails.password,
        icon: faKey,
        type: 'password',
        onChange: setField('password'),
      },
    ].map((a) => (
      <Forminput
        key={a.placeholder}
        type={a.type}
        value={a.value}
        onChange={a.onChange}
        icon={a.icon}
        placeholder={a.placeholder}
      />
    ));

    let rememberme = (
      <>
        <div className='form-check'>
          <input
            className='form-check-input'
            type='checkbox'
            onChange={(e) => {
              setField('remember')(e.target.checked);
            }}
            id='remember'
            checked={logindetails.remember}
          />
          <label className='form-check-label' for='remember'>
            Remember me
          </label>
        </div>
      </>
    );

    const handleLogin = () => {
      setloading(true);
      login(logindetails)
        .then((response) => {
          if (response.success) {
            setloading(false);
            setlogindetails({});
            dispatch(addUser(response));
            return;
          } else {
            alert(response.message);
            setloading(false);
            return;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    return (
      <>
        {form}
        {rememberme}
        <div className='small my-3'>
          <u>Forgot password?</u>
        </div>
        <div className='text-center my-5'>
          <LoadingIndicator isLoading={loading}>
            <div onClick={handleLogin} className='btn login-btn-a px-5'>
              Login
            </div>
          </LoadingIndicator>
        </div>
      </>
    );
  };

  let signUpForm = (view) => {
    
    const page1 = [
      {
        placeholder: 'Username',
        value: signupdetails.username,
        icon: faUser,
        view: 1,
        onChange: setItem('username'),
      },
      {
        placeholder: 'Email',
        value: signupdetails.email,
        icon: faEnvelope,
        view: 1,
        onChange: setItem('email'),
      },
      {
        placeholder: 'Password',
        value: signupdetails.password,
        icon: faKey,
        type: 'password',
        view: 1,
        onChange: setItem('password'),
      },
    ].map((a) => (
      <Forminput
        key={a.placeholder}
        type={a.type}
        value={a.value}
        onChange={a.onChange}
        icon={a.icon}
        placeholder={a.placeholder}
      />
    ));

    let page2 = (
      <>
        <Forminput
          value={signupdetails.highestEducation}
          onChange={setItem('highestEducation')}
          icon={faGraduationCap}
          placeholder={'Highest Level of Education Pursuing/Completed'}
        />
        <div className='row no-gutters'>
          <div className='col'>
            <Forminput
              value={signupdetails.startYear}
              onChange={setItem('startYear')}
              icon={faCalendar}
              placeholder={'Start Year'}
            />
          </div>
          <div className='col'>
            <Forminput
              value={signupdetails.endYear}
              onChange={setItem('endYear')}
              icon={faCalendar}
              placeholder={'End Year'}
            />
          </div>
          <Forminput
            value={signupdetails.grade}
            onChange={setItem('grade')}
            icon={faFileCircleCheck}
            placeholder={'Grade'}
          />
        </div>
      </>
    );

    const page3 = [
      {
        placeholder: 'Name of the Company',
        value: signupdetails.nameOfCompany,
        icon: faBuildingUser,
        onChange: setItem('nameOfCompany'),
      },
      {
        placeholder: 'Years of Experience',
        value: signupdetails.yearsOfExperience,
        icon: faCalendarDays,
        onChange: setItem('yearsOfExperience'),
      },
      {
        placeholder: 'Role',
        value: signupdetails.role,
        icon: faUsersBetweenLines,
        onChange: setItem('role'),
      },
    ].map((a) => (
      <Forminput
        key={a.placeholder}
        type={a.type}
        value={a.value}
        onChange={a.onChange}
        icon={a.icon}
        placeholder={a.placeholder}
      />
    ));

    const handleResumeUpload = (e) => {
      setresumeShowname(e.target.files[0] && e.target.files[0].name);
      let data = new FormData();
      data.append('document', e.target.files[0]);

      uploadFile(data)
        .then((response) => {
          if (response.success) {
            setItem('resumeId')(response.uploadedFile);
            return;
          } else {
            return;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const handleSignup = () => {
      setloading(true);
      signup(signupdetails)
        .then((response) => {
          if (response.success) {
            setloading(false);
            setresumeShowname('');
            setcertShowname('');
            setsignupdetails({});
            setview(1);
            dispatch(addUser(response));
            return;
          } else {
            alert(response.message);
            setloading(false);
            return;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const handleCertUpload = (e) => {
      setcertShowname(e.target.files[0] && e.target.files[0].name);
      let data = new FormData();
      data.append('document', e.target.files[0]);

      uploadFile(data)
        .then((response) => {
          if (response.success) {
            setItem('documentId')(response.uploadedFile);
            return;
          } else {
            return;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    let usertype = (
      <div className='d-flex my-5 sign-up_user-type'>
        Type of User : &nbsp;
        {[
          {
            userType: 'student',
            checked: signupdetails.userType === 'student',
            onChange: (e) => setItem('userType')('student'),
          },
          {
            userType: 'coach',
            checked: signupdetails.userType === 'coach',
            onChange: (e) => setItem('userType')('coach'),
          },
        ].map((u) => (
          <>
            <div key={u.userType} className='form-check mx-2'>
              <input
                className='form-check-input'
                type='checkbox'
                id={u.userType}
                onChange={u.onChange}
                checked={u.checked}
              />
              <label className='form-check-label' id={u.userType}>
                {u.userType}
              </label>
            </div>
          </>
        ))}
      </div>
    );

    const colourOptions = [
      { value: "ocean1", label: "Ocean" },
      { value: "blue", label: "Blue" },
      { value: "purple", label: "Purple" },
      { value: "red", label: "Red" },
      { value: "orange", label: "Orange" },
      { value: "yellow", label: "Yellow" },
      { value: "green", label: "Green" },
      { value: "forest", label: "Forest" },
      { value: "slate", label: "Slate" },
      { value: "silver", label: "Silver" }
    ];

    return (
      <>
        <h2 className='mt-5 text-center'>Sign Up</h2>
        <p className='text-center'>Step {view} out of 4</p>
        {view === 1 && page1}
        {view === 2 && page2}
        {view === 3 && page3}
        {view === 4 && (
          <>
            <input type='file' className='d-none' accept='application/pdf' ref={certRef} onChange={handleCertUpload} />
            <div className='mb-4'>
              <div className='input-icons'>
                <FontAwesomeIcon className='icon' icon={faPaperclip} />
                <button className='input-field text-start form-control' onClick={(e) => certRef.current.click()}>
                  {certShowname || 'Upload Certifications'}
                </button>
              </div>
            </div>
            <input
              type='file'
              className='d-none'
              accept='application/pdf'
              ref={resumeRef}
              onChange={handleResumeUpload}
            />
            <div className='mb-4'>
              <div className='input-icons'>
                <FontAwesomeIcon className='icon' icon={faPaperclip} />
                <button className='input-field text-start form-control' onClick={(e) => resumeRef.current.click()}>
                  {resumeShowname || 'Upload Resume'}
                </button>
              </div>
            </div>
            <div className='col'>
              {/* <Forminput
                value={signupdetails.areasOfInterest}
                onChange={setItem('areasOfInterest')}
                placeholder={'Areas of Interest'}
              /> */}
            </div>
            {usertype}
          </>
        )}
        <LoadingIndicator isLoading={loading}>
          <div className='text-center mb-5'>
            <div className='row no-gutters'>
              {view > 1 && (
                <div className='col'>
                  <div onClick={(e) => setview(view - 1)} className='btn login-btn-a px-5'>
                    Back
                  </div>
                </div>
              )}
              {view < 4 && (
                <div className='col'>
                  <div onClick={(e) => setview(view + 1)} className='btn login-btn-a px-5'>
                    Next
                  </div>
                </div>
              )}
              {view === 4 && (
                <div className='col'>
                  <div onClick={handleSignup} className='btn login-btn-a px-5'>
                    Signup
                  </div>
                </div>
              )}
            </div>
          </div>
        </LoadingIndicator>
      </>
    );
  };

  const closeModals = () => {
    setsignUpmodalIsOpen(false);
    setloginmodalIsOpen(false);
    setresumeShowname('');
    setcertShowname('');
    setsignupdetails({});
    setlogindetails({});
    setview(1);
  };
  return (
    <>
      <Navbar isLoggedIn={false} />
      <div className='main-container'>
        <div className='container pt-5'>
          <p className='top-heading pt-2'>Easiest way to choose correct Career Options</p>
          <div className='d-flex pt-5 col-10 mx-auto'>
            <div className='col'>
              <div className='justify-content-right'>
                <div className='col-10 mx-auto px-4'>
                  <p className='mb-0'>Already have an account?</p>
                </div>
                <div onClick={(e) => setloginmodalIsOpen(true)} className='col-10 mx-auto login-btn'>
                  Login
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='justify-content-right'>
                <div className='col-10 mx-auto px-4'>
                  <p className='mb-0 pl-2'>Don't have an account?</p>
                </div>
                <div onClick={(e) => setsignUpmodalIsOpen(true)} className='col-10 mx-auto signup-btn'>
                  Signup
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={signUpmodalIsOpen || loginmodalIsOpen} style={customStyles}>
          <div className='modal-inner-div shadow'>
            <div onClick={(e) => closeModals()} className='btn btn-modal-close'>
              <FontAwesomeIcon icon={faTimes} />
            </div>

            {loginmodalIsOpen && (
              <>
                <div className='py-5'></div>
                <div className='container px-4'>{loginForm()}</div>
              </>
            )}
            {signUpmodalIsOpen && (
              <>
                <div className='container px-4'>{signUpForm(view)}</div>
              </>
            )}
          </div>
        </Modal>
      </div>
    </>
  );
}
