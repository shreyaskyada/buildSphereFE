import _ from "lodash";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import skull from "../../../assets/v2/Skull.svg";
import axios from "../../../axios";
import { HIDE_LOADER, SHOW_LOADER } from "../../../store/actions/v2/loader";
import TableNew from "../Table/TableNew";
import "./style.css";

const MembersDatabase = ({ filterRole }) => {
  const [members, setMembers] = useState([]);
  const [filterMembers, setFilterMembers] = useState({});
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");
  const dispatch = useDispatch();

  const cellStyles = {
    paddingY: "7px",
    fontSize: "14px",
    color: "#1c3d5a",
    fontWeight: "600",
    borderColor: "#e3f2fd",
    fontFamily: "Manrope",
  };

  const roleColor = {
    "Field User": "#a9def9",
    Inspector: "#E36767",
    Admin: "#89cef9",
    "Super Admin": "#a9def9",
  };

  const getDate = (date) => {
    const time = moment(date);
    return time.fromNow();
  };

  const columns = [
    {
      field: "userName",
      headerName: "User",
      sortable: true,
      format: (value, member) => {
        return (
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {member.file_url && (
                <img
                  src={member.file_url}
                  alt="default"
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 40,
                  }}
                />
              )}
              {!member.file_url && (
                <div
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#a9def9",
                  }}
                >
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {_.upperCase((member?.first_name || "").substring(0, 1))}
                    {_.upperCase((member?.last_name || "").substring(0, 1))}
                  </p>
                </div>
              )}
              <p>&nbsp;&nbsp;&nbsp;{value}</p>
            </div>
          </div>
        );
      },
    },
    { field: "email", headerName: "Username", sortable: true },
    {
      field: "role",
      headerName: "Role",
      sortable: true,
      format: (value) => {
        value = _.startCase(_.toLower(value));
        return (
          <span style={{ fontWeight: "bold", color: roleColor[value] }}>
            {value}
          </span>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Joined",
      sortable: true,
      format: (value) => {
        const time = moment(value);
        return time.format("MM-DD-YY");
      },
    },
    {
      field: "last_login",
      headerName: "Last Login",
      sortable: true,
      format: getDate,
    },
  ];

  const getAllMembers = useCallback(async () => {
    try {
      if (filterMembers[filterRole]) {
        setMembers([...filterMembers[filterRole]]);
      } else {
        dispatch({ type: SHOW_LOADER, data: 1 });
        const result = await axios.get(
          `groups/${groupId}/members?p=group:${groupId}&filters=${filterRole}&sort_by=""&sort_direction=""`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        dispatch({ type: HIDE_LOADER });
        if (result.status === 200) {
          let tempMembers = _.get(result, ["data", "message"]);

          tempMembers = tempMembers.map((member) => {
            member.userName = member.first_name + " " + member.last_name;

            return member;
          });
          setFilterMembers((prev) => {
            return {
              ...prev,
              [filterRole]: [...tempMembers],
            };
          });
          setMembers([...tempMembers]);
        }
      }
    } catch (err) {
      dispatch({ type: HIDE_LOADER });
    }
  }, [groupId, token, filterRole]);

  useEffect(() => {
    getAllMembers();
  }, [getAllMembers, filterRole]);
  return (
    <div className="membersTable">
      <TableNew columns={columns} data={members} cellStyles={cellStyles} />
      {members.length === 0 && (
        <div className="activitiesNoData">
          <img
            src={skull}
            alt="default"
            style={{
              height: 60,
              width: 60,
            }}
          />
          <p style={{ marginTop: "0px", color: "#1c3d5a" }}>No User</p>
        </div>
      )}
    </div>
  );
};

export default MembersDatabase;
