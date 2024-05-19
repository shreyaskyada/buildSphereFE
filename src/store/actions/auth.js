const _ = require("lodash");
export const LOGIN_ACTION = "LOGIN";
export const SIGNUP_ACTION = "SIGNUP";
export const UPDATE_ACTION = "PROFILE_UPDATE";

export const login = (data, route, axios) => {
  return async (dispatch) => {
    const response = await axios.post(`${route}/admin`, data, {
      headers: { id: route },
    });
    const token = _.get(response, ["headers", "authorization"]);
    const profile = _.get(response, ["data", "message"]);
    if (route === "login") {
      localStorage.setItem("token", token);
      localStorage.setItem("profile", JSON.stringify(profile));
    }
    dispatch({
      type: LOGIN_ACTION,
      token,
      profile: JSON.stringify(profile),
    });
  };
};

export const updateProfile = (data, token, axios) => {
  return async (dispatch) => {
    const options = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: token,
      },
    };
    const response = await axios.patch("/social/user", data, options);
    const profile = _.get(response, ["data", "message"]);
    localStorage.setItem("profile", JSON.stringify(profile));
    dispatch({
      type: UPDATE_ACTION,
      profile: JSON.stringify(profile),
    });
  };
};
