import {
  SHOW_SUCCESS_MESSAGE,
  SHOW_ERROR_MESSAGE,
  HIDE_MESSAGE,
} from "../../actions/v2/message";

export default (state = {}, action) => {
  switch (action.type) {
    case SHOW_SUCCESS_MESSAGE:
      return {
        success: action.data || "Your request is successfull",
      };
    case SHOW_ERROR_MESSAGE:
      return {
        error: action.data || "Something went wrong. Please try again",
      };
    case HIDE_MESSAGE:
      return { success: false, error: false };
    default:
      return { success: false, error: false };
  }
};
