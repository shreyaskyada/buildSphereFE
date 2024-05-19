import { LOGIN_ACTION } from "../actions/auth";
import { UPDATE_ACTION } from "../actions/auth";

const token = {};

export default (state = token, action) => {
  switch (action.type) {
    case LOGIN_ACTION:
      return {
        token: action.token,
        profile: action.profile,
      };
    case UPDATE_ACTION: {
      return {
        ...state,
        profile: action.profile,
      };
    }
    default:
      return {
        token: localStorage.getItem('token'),
        profile: localStorage.getItem('profile')
      };
  }
};
