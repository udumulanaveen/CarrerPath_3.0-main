import axios from 'axios';
import { apis, baseurl } from '../constants';

const api = (method, url, data = null, token = null) => {
  if (token) {
    axios.defaults.headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      credentials: true,
    };
  }
  return axios({
    method: method,
    url: `${baseurl}${url}`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const login = (data) => {
  return api('post', apis.LOGIN, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const signup = (data) => {
  return api('post', apis.SIGNUP, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const uploadFile = (data) => {
  return api('post', apis.UPLOAD, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const getAreasOfInterest = (data) => {
  return api('get', apis.areasOfInterest, data)
    .then((res) => {
      console.log(res);
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

// SPECIALIZATIONS

export const getSpecializations = (data) => {
  return api('get', apis.SPECIALIZATIONS, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const getCoachesOfSpecialization = (id) => {
  return api('get', apis.COACHESOFSPECIALIZATION + id)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const registerCoach = (id, data) => {
  return api('post', apis.REGISTERCOACH + id, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const bookAppointment = (data) => {
  return api('post', apis.BOOKAPPOINTMENT, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const getSlots = (data) => {
  return api('post', apis.GETSLOTS, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

// /:userType/:userId

export const getAppointments = (userType, userId) => {
  return api('get', `${apis.USERSAPPOINTMENTS}${userType}/${userId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const getUserWithId = (userId) => {
  return api('get', `${apis.GETUSER}${userId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

// /user/:
// 'DELETEAPPOINTMENT'
export const deleteAppointment = (data) => {
  return api('post', apis.DELETEAPPOINTMENT, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const getusers = (userType) => {
  return api('get', apis.GETUSERS + userType)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const getAllAppointments = () => {
  return api('get', apis.ALLAPPOINTMENTS)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const deleteUser = (id) => {
  return api('get', apis.DELETEUSER + id)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const getProfile = (id) => {
  return api('get', apis.GETPROFILE + id)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const updateBasicInfo = (id, data) => {
  return api('post', apis.UPDATEBASICINFO + id, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const updateProfessionalInfo = (id, data) => {
  return api('post', apis.updateProfessionalInfo + id, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const updateEducationalInfo = (id, data) => {
  return api('post', apis.updateEducationalInfo + id, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
