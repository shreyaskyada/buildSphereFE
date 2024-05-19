import { SHOW_LOADER, HIDE_LOADER } from "../../actions/v2/loader";

export default (state = 0, action) => {
  switch (action.type) {
    case SHOW_LOADER:
      return action.data ? action.data + 1 : state + 1;
    case HIDE_LOADER:
      return action.data ? action.data - 1 : state - 1;
    default:
      return 0;
  }
};
