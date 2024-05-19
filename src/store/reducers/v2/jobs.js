const { ADD_JOBS } = require("../../actions/v2/jobs");

module.exports = (state = [], action) => {
  switch (action.type) {
    case ADD_JOBS:
      return action.data;
    default:
      return state;
  }
};
