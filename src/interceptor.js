import axios from "./axios";
import { LOGOUT_ACTION } from "./GlobalConstants";
import { SHOW_ERROR_MESSAGE } from "./store/actions/v2/message";
import { HIDE_LOADER, SHOW_LOADER } from "./store/actions/v2/loader";
import _ from "lodash";
import { LICENSE_EXPIRED } from "./store/actions/v2/expired_license";
import { NO_PLAN } from "./store/actions/v2/no_plan";

export default {
  setup: (store) => {
    axios.interceptors.request.use(
      (conf) => {
        store.dispatch({ type: SHOW_LOADER });
        return conf;
      },
      (error) => {
        store.dispatch({ type: SHOW_LOADER });
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      (response) => {
        if (response.headers.expired == "true") {
          store.dispatch({ type: LICENSE_EXPIRED, data: true });
        } else {
          store.dispatch({ type: LICENSE_EXPIRED, data: false });
        }

        if (response.headers.noplan == "true") {
          store.dispatch({ type: NO_PLAN, data: true });
        } else {
          store.dispatch({ type: NO_PLAN, data: false });
        }

        store.dispatch({ type: HIDE_LOADER });
        return response;
      },
      (error) => {
        store.dispatch({ type: HIDE_LOADER });
        if (
          _.get(error, ["response", "status"]) === 401 &&
          localStorage.getItem("token")
        ) {
          localStorage.clear();
          store.dispatch({ type: LOGOUT_ACTION });
        } else if (_.get(error, ["response", "status"]) === 403) {
          store.dispatch({
            type: SHOW_ERROR_MESSAGE,
            data: "You dont have the sufficient rights to perform this action",
          });
        }
        return Promise.reject(error);
      }
    );
  },
};
