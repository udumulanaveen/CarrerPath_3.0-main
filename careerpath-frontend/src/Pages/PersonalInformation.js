import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Modal from 'react-modal';
import {
  faBuildingUser,
  faCalendar,
  faCalendarDays,
  faFileCircleCheck,
  faGraduationCap,
  faKey,
  faPencil,
  faTimes,
  faUsersBetweenLines,
} from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getProfile, updateBasicInfo, updateEducationalInfo, updateProfessionalInfo } from '../apis';
import LoadingIndicator from '../Components/LoadingIndicator';
import { Link } from 'react-router-dom';
import { customStyles, setItemHelper } from '../utils';
import { faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import Forminput from '../Components/Forminput';
import axios from 'axios';
import { baseurl } from '../constants';
import FileSaver from 'file-saver';

export default function PersonalInformation() {
  const history = useHistory();
  const [userDetails, setUserDetails] = useState();
  const [loading, setloading] = useState(false);
  const [basicInfo, setbasicInfo] = useState({});
  const [educationInfo, seteducationInfo] = useState({});
  const [professionalInfo, setprofessionalInfo] = useState({});
  const [basicInfoModal, setbasicInfoModal] = useState(false);
  const [educationModal, setEducationModal] = useState(false);
  const [professionalInfoModal, setProfessionalInfoModal] = useState(false);
  const params = useParams();
  const userId = params.userId;

  const setEduField = setItemHelper(educationInfo, seteducationInfo);
  const setProField = setItemHelper(professionalInfo, setprofessionalInfo);
  const setBasicField = setItemHelper(basicInfo, setbasicInfo);

  const toggleModal = (modalName) => {
    setEducationModal(false);
    setbasicInfoModal(false);
    setProfessionalInfoModal(false);
    if (modalName === 'edu') {
      setEducationModal(true);
    }

    if (modalName === 'prof') {
      setProfessionalInfoModal(true);
    }

    if (modalName === 'basic') {
      setbasicInfoModal(true);
    }
  };
  let basicInformation = userDetails && userDetails.user;
  let educationalInformation = {
    'Highest Level of Education Pursuing/Completed':
      userDetails && userDetails.education && userDetails.education[0] && userDetails.education[0].highestEducation,
  };

  let eduFlex = {
    'Start Year':
      userDetails && userDetails.education && userDetails.education[0] && userDetails.education[0].startYear,
    'End Year': userDetails && userDetails.education && userDetails.education[0] && userDetails.education[0].endYear,
    Grade: userDetails && userDetails.education && userDetails.education[0] && userDetails.education[0].grade,
  };

  let professionalInformation = {
    'Name of Company':
      userDetails && userDetails.experience && userDetails.experience[0] && userDetails.experience[0].nameOfCompany,
    Role: userDetails && userDetails.experience && userDetails.experience[0] && userDetails.experience[0].role,
    'Years of experience':
      userDetails && userDetails.experience && userDetails.experience[0] && userDetails.experience[0].yearsOfExperience,
  };

  const handleDownload = async (resumeId) => {
    let response = await axios.get(`${baseurl}/download/${resumeId}`, {
      responseType: 'arraybuffer',
      headers: {
        Accept: 'application/pdf',
      },
    });

    FileSaver.saveAs(
      new Blob([response.data], { type: 'application/pdf' }),
      `${userDetails && userDetails.user.username}.pdf`
    );
  };

  const handleBasicSave = () => {
    setloading(true);

    updateBasicInfo(userDetails.id, basicInfo)
      .then((response) => {
        if (response.success) {
          setloading(false);
          window.location.reload();
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

  const handleProSave = () => {
    setloading(true);

    updateProfessionalInfo(userDetails.experienceId, professionalInfo)
      .then((response) => {
        if (response.success) {
          setloading(false);
          window.location.reload();
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

  const handleEduSave = () => {
    setloading(true);

    updateEducationalInfo(userDetails.educationId, educationInfo)
      .then((response) => {
        if (response.success) {
          setloading(false);
          window.location.reload();
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

  const proView = () => {
    const page = [
      {
        placeholder: 'Name of the Company',
        value: professionalInfo.nameOfCompany,
        icon: faBuildingUser,
        onChange: setProField('nameOfCompany'),
      },
      {
        placeholder: 'Years of Experience',
        value: professionalInfo.yearsOfExperience,
        icon: faCalendarDays,
        onChange: setProField('yearsOfExperience'),
      },
      {
        placeholder: 'Role',
        value: professionalInfo.role,
        icon: faUsersBetweenLines,
        onChange: setProField('role'),
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

    return (
      <>
        <h2 className='mt-5 text-center'>Update Professional Info</h2>
        <div className='my-3'></div>
        {page}
        <div className='col text-center'>
          <LoadingIndicator isLoading={loading}>
            <div onClick={handleProSave} className='btn login-btn-a px-5'>
              Save
            </div>
          </LoadingIndicator>
        </div>
      </>
    );
  };
  let basicView = () => {
    const view = [
      {
        placeholder: 'Username',
        value: basicInfo.username,
        icon: faUser,
        onChange: setBasicField('username'),
      },
      {
        placeholder: 'Name',
        value: basicInfo.name,
        icon: faUser,
        onChange: setBasicField('name'),
      },
      {
        placeholder: 'Email',
        value: basicInfo.email,
        icon: faEnvelope,
        onChange: setBasicField('email'),
      },
      {
        placeholder: 'Password',
        value: basicInfo.password,
        icon: faKey,
        type: 'password',
        onChange: setBasicField('password'),
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

    return (
      <>
        <h2 className='mt-5 text-center'>Update Basic Details</h2>
        <div className='my-3'></div>
        {view}
        <div className='col text-center'>
          <LoadingIndicator isLoading={loading}>
            <div onClick={handleBasicSave} className='btn login-btn-a px-5'>
              Save
            </div>
          </LoadingIndicator>
        </div>
      </>
    );
  };

  let eduView = () => {
    let page = (
      <>
        <Forminput
          value={educationInfo.highestEducation}
          onChange={setEduField('highestEducation')}
          icon={faGraduationCap}
          placeholder={'Highest Level of Education Pursuing/Completed'}
        />
        <div className='row no-gutters'>
          <div className='col'>
            <Forminput
              value={educationInfo.startYear}
              onChange={setEduField('startYear')}
              icon={faCalendar}
              placeholder={'Start Year'}
            />
          </div>
          <div className='col'>
            <Forminput
              value={educationInfo.endYear}
              onChange={setEduField('endYear')}
              icon={faCalendar}
              placeholder={'End Year'}
            />
          </div>
          <Forminput
            value={educationInfo.grade}
            onChange={setEduField('grade')}
            icon={faFileCircleCheck}
            placeholder={'Grade'}
          />
        </div>
      </>
    );

    return (
      <>
        <h2 className='mt-5 text-center'>Update Education Details</h2>
        <div className='my-3'></div>
        {page}
        <div className='col text-center'>
          <LoadingIndicator isLoading={loading}>
            <div onClick={handleEduSave} className='btn login-btn-a px-5'>
              Save
            </div>
          </LoadingIndicator>
        </div>
      </>
    );
  };
  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = () => {
    setloading(true);
    getProfile(userId)
      .then((response) => {
        if (response.success) {
          setUserDetails(response);
          seteducationInfo(response.educationInfo);
          setprofessionalInfo(response.experienceInfo);
          setbasicInfo(response.basicInfo);
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

  const data = loading
    ? []
    : [
        {
          title: 'Basic Information',
          arr: basicInformation ? Object.entries(basicInformation) : [],
          showModal: (e) => toggleModal('basic'),
        },
        {
          title: 'Educational Information',
          arr: educationalInformation ? Object.entries(educationalInformation) : [],
          flex: eduFlex ? Object.entries(eduFlex) : [],
          showModal: (e) => toggleModal('edu'),
        },
        {
          title: 'Professional Information',
          arr: professionalInformation ? Object.entries(professionalInformation) : [],
          showModal: (e) => toggleModal('prof'),
        },
      ];
  console.log(data);
  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className='mx-0 px-0 pt-4'>
        <LoadingIndicator isLoading={loading}>
          <div className='container-fluid px-3'>
            <div className='row'>
              <div className='col'>
                <h3>Personal Information</h3>
              </div>
            </div>

            {data.map((d) => {
              return (
                <div key={d.title}>
                  <div className='row'>
                    <p className='col gold-heading'>{d.title}</p>
                    <div onClick={(e) => d.showModal()} className='col btn small text-end px-5 mx-5'>
                      <FontAwesomeIcon icon={faPencil} />
                      &nbsp; Edit Information
                    </div>
                  </div>
                  {d.arr.map((a) => (
                    <p key={a[0]} className=''>
                      {a[0]} : {a[1]}
                    </p>
                  ))}
                  <div className='row col-6'>
                    {d.flex &&
                      d.flex.map((f) => (
                        <p className='col'>
                          {f[0]} : {f[1]}
                        </p>
                      ))}
                  </div>
                </div>
              );
            })}
            <p className=''>
              Resume:{' '}
              {userDetails &&
                userDetails.resume &&
                userDetails.resume.length > 0 &&
                userDetails.resume.map((r) => (
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDownload(r.resumeId);
                    }}
                    key={r.id}
                  >
                    {r.resumeId}
                  </Link>
                ))}
            </p>
            <p className=''>
              Certificates:{' '}
              {userDetails &&
                userDetails.certifications &&
                userDetails.certifications.length > 0 &&
                userDetails.certifications.map((r) => (
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDownload(r.documentId);
                    }}
                    key={r.id}
                  >
                    {r.documentId}
                  </Link>
                ))}
            </p>
            <div className='col-12 text-end px-5 mb-5'>
              <button onClick={(e) => history.push('/')} className='btn logout-btn mx-4 px-5'>
                Cancel
              </button>
              {/* <button className='btn logout-btn mx-4 px-5'>Save</button> */}
            </div>
          </div>
        </LoadingIndicator>
      </div>
      <Modal isOpen={basicInfoModal} onRequestClose={toggleModal} style={customStyles}>
        <div className='modal-inner-div shadow'>
          <div onClick={(e) => toggleModal()} className='btn btn-modal-close'>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <div className='px-4'>{basicView()}</div>
        </div>
      </Modal>
      <Modal isOpen={educationModal} onRequestClose={toggleModal} style={customStyles}>
        <div className='modal-inner-div shadow'>
          <div onClick={(e) => toggleModal()} className='btn btn-modal-close'>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <div className='px-4'>{eduView()}</div>
        </div>
      </Modal>
      <Modal isOpen={professionalInfoModal} onRequestClose={toggleModal} style={customStyles}>
        <div className='modal-inner-div shadow'>
          <div onClick={(e) => toggleModal()} className='btn btn-modal-close'>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <div className='px-4'>{proView()}</div>
        </div>
      </Modal>
    </>
  );
}
