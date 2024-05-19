import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";
import _ from "lodash";
import CollapsibleTableContainer from "../components/CollapsibleTableContainer";
import axios from "../../axios";
import moment from "moment";
import MembersModal from "../components/MembersModal";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  SHOW_ERROR_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
} from "../../store/actions/v2/message";

const useStyles = makeStyles((theme) => ({
  admin: {
    fontSize: 13,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.greenShade2,
    borderRadius: 5,
    width: 100,
  },
  super_admin: {
    fontSize: 13,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.greenShade2,
    borderRadius: 5,
    width: 100,
  },
  inspector: {
    fontSize: 13,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.redShade2,
    borderRadius: 5,
    width: 100,
  },
  field_user: {
    fontSize: 13,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blueShade1,
    borderRadius: 5,
    width: 100,
  },
}));

const Members = (props) => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [filters, setFilters] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortByIndex, setSortByIndex] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [openMembers, setOpenMembers] = useState(false);
  const [deleteData, setDeleteData] = useState();
  const dispatch = useDispatch();
  const filterData = (data) => {
    setFilters(data);
  };
  const sections = [
    { label: "All Members", onClick: filterData.bind(this, "all") },
    { label: "Admins", onClick: filterData.bind(this, "admins") },
    { label: "Field Users", onClick: filterData.bind(this, "field_users") },
    { label: "Inspectors", onClick: filterData.bind(this, "inspectors") },
  ];
  const sortData = (field, index) => {
    if (sortByIndex === index) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortDirection("asc");
    }
    switch (field) {
      case "user":
        setSortBy(`user`);
        setSortByIndex(index);
        break;
      case "username":
        setSortBy(`username`);
        setSortByIndex(index);
        break;
      case "type":
        setSortBy(`type`);
        setSortByIndex(index);
        break;
      case "joined":
        setSortBy(`joined`);
        setSortByIndex(index);
        break;
      default:
        return "";
    }
  };
  const tableHeaders = [
    { label: "User", onClick: sortData.bind(this, "user", 0) },
    { label: "Username", onClick: sortData.bind(this, "username", 1) },
    { label: "Type", onClick: sortData.bind(this, "type", 2) },
    { label: "Joined", onClick: sortData.bind(this, "joined", 3) },
  ];
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");

  const getAllMembers = useCallback(async () => {
    try {
      const result = await axios.get(
        `groups/${groupId}/members?p=group:${groupId}&filters=${filters}&sort_by=${sortBy}&sort_direction=${sortDirection}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setData(_.get(result, ["data", "message"]));
      }
    } catch (err) {}
  }, [groupId, token, filters, sortDirection, sortBy]);

  useEffect(() => {
    getAllMembers();
  }, [getAllMembers]);

  const deleteMember = async (index) => {
    setDeleteData(data[index]);
    setDeleteConfirmation(true);
  };

  const onConfirmDelete = async () => {
    try {
      const result = await axios.delete(
        `groups/${groupId}/members/${_.get(
          deleteData,
          "user_id"
        )}?p=group:${groupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setData(data.filter((item) => item.user_id !== deleteData.user_id));
        setDeleteConfirmation(false);
        setDeleteData(null);
      }
    } catch (err) {
      console.log(err);

      dispatch({
        type: SHOW_ERROR_MESSAGE,
        data:
          _.get(err, ["response", "data", "message"]) || "Something went wrong",
      });
    }
  };

  const inviteUserAgain = async (index) => {
    const userData = data[index];

    try {
      const result = await axios.post(
        `groups/${groupId}/members/${_.get(
          userData,
          "user_id"
        )}/inviteagain?p=group:${groupId}`,
        null,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        dispatch({
          type: SHOW_SUCCESS_MESSAGE,
          data: "User has been invited again",
        });
      }
    } catch (err) {
      console.log(err);

      dispatch({
        type: SHOW_ERROR_MESSAGE,
        data:
          _.get(err, ["response", "data", "message"]) || "Something went wrong",
      });
    }
  };

  return (
    <>
      <ConfirmationModal
        header={`Are you sure you want to delete this ${_.get(
          deleteData,
          "first_name"
        )} ${_.get(deleteData, "last_name")}?`}
        open={deleteConfirmation}
        onCancel={() => {
          setDeleteConfirmation(false);
          setDeleteData(null);
        }}
        onConfirm={onConfirmDelete}
        actionLabel="Delete"
        delete={true}
      />
      <CollapsibleTableContainer
        header="Members"
        table={{
          sections,
          headers: tableHeaders,
          data: data.map((record) => {
            return [
              {
                type: "defaultImage",
                deleteAllowed:
                  _.get(record, "role") == "SUPER_ADMIN" ? false : true,
                inviteAgain: Boolean(_.get(record, "is_new_user")),
                field1: _.get(record, ["file_url"]),
                field2: {
                  first_name: _.get(record, ["first_name"]) || "",
                  last_name: _.get(record, ["last_name"]) || "",
                },
                value: `${_.get(record, ["first_name"]) || ""} ${
                  _.get(record, ["last_name"]) || ""
                }`,
              },
              {
                type: "default",
                value: _.get(record, ["email"]),
              },
              {
                type: "default",
                value: _.startCase(_.toLower(_.get(record, ["role"]))),
                classes: classes[_.toLower(_.get(record, "role"))],
              },
              {
                type: "default",
                value: moment(_.get(record, "createdAt")).format("MM/DD/YYYY"),
              },
            ];
          }),
          sortDirection: sortDirection,
          sortBy: sortByIndex,
          deleterow: deleteMember,
          inviteUserAgain,
        }}
        button={{
          header: "Add Member",
          onClick: setOpenMembers.bind(this, true),
        }}
      />
      <MembersModal
        open={openMembers}
        onClose={setOpenMembers.bind(this, false)}
      />
    </>
  );
};

export default Members;
