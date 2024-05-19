import { NO_PLAN } from "../../actions/v2/no_plan";

const expired = false;

export default (state = expired, action) => {
  switch (action.type) {
    case NO_PLAN:
      return action.data;

    default:
      return state;
  }
};
