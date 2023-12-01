import { LOGIN, LOGOUT, EDIT_USER } from '../actions/constants';

const initialState = {
  user: null,
  resume: [],
  experience: [],
  certifications: [],
  education: [],
  token: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.data.user,
        experience: action.data.experience,
        certifications: action.data.certifications,
        resume: action.data.resume,
        education: action.data.education,
        token: action.data.token,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        experience: [],
        certifications: [],
        resume: [],
        education: [],

      };

    case EDIT_USER:
      return {
        ...state,
        user: action.data.user,
        experience: action.data.experience ? action.data.experience : state.experience,
        certifications: action.data.certifications ? action.data.certifications : state.certifications,
        resume: action.data.resume ? action.data.resume : state.resume,
        education: action.data.education ? action.data.education : state.education,
      };

    default:
      return state;
  }
};
