import { LICENSE_EXPIRED } from "../../actions/v2/expired_license";

const expired = false;

export default (state = expired, action) => {
  switch (action.type) {
    case LICENSE_EXPIRED:
      return action.data;

    default:
      return state;
  }
};
