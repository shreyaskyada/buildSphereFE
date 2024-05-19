const { ADD_UNITS } = require("../../actions/v2/units");

module.exports = (state = [], action) => {
  switch (action.type) {
    case ADD_UNITS:
      return action.data;
    default:
      return state;
  }
};
