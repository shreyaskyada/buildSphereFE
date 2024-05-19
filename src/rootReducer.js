import { combineReducers } from "redux";
import { LOGOUT_ACTION } from "./GlobalConstants";
import auth from "./store/reducers/auth";
import loader from "./store/reducers/v2/loader";
import message from "./store/reducers/v2/message";
import jobs from "./store/reducers/v2/jobs";
import units from "./store/reducers/v2/units";
import expired_license from "./store/reducers/v2/expired_license";
import no_plan from "./store/reducers/v2/no_plan";

const appReducer = combineReducers({
  auth: auth,
  units: units,
  loader: loader,
  message: message,
  jobs: jobs,
  expired_license: expired_license,
  no_plan: no_plan,
});

export const rootReducer = (state, action) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === LOGOUT_ACTION) {
    state = undefined;
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
  }

  return appReducer(state, action);
};
