import React, { useState } from "react";
import "./style.css";
import MembersDatabase from "../../components/MembersDatabase/MembersDatabase";
import UserProfile from "../../components/UserProfile/UserProfile";
import AddUserModal from "../../components/AddUserModal/AddUserModal";
import SuccessMsgModal from "../../components/SuccessMsgModal/SuccessMsgModal";
import { Grid, makeStyles, MenuItem, Select } from "@material-ui/core";
import ArrowDown from "../../../assets/v2/ArrowDown.svg";
import filterIcon from "../../../assets/v2/Filter.svg";
import { ReactComponent as MyProfileIcon } from "../../../assets/v2/MyProfile.svg";
import { ReactComponent as MembersDatabaseIcon } from "../../../assets/v2/MembersDatabase.svg";
import { ReactComponent as DeletedUsers } from "../../../assets/v2/DeletedUser.svg";

const useStyles = makeStyles((theme) => ({
  arrowContainer: {
    backgroundColor: "#E5FAE7",
    height: 18,
    width: 18,
    borderRadius: "50%",
    pointerEvents: "none",
    position: "absolute",
    right: "10px",
  },
  chooseCustSelect: {
    marginLeft: "2%",
    height: "32px",
    fontSize: "12px",
    fontWeight: 500,
    paddingLeft: "10px",
    fontFamily: "Manrope",
    width: "158px",
    backgroundColor: "white",
    "& .MuiSelect-select": {
      backgroundColor: "white",
      "&:focus": {
        backgroundColor: "white",
      },
    },
  },

  menulabels: {
    fontFamily: "Manrope",
    backgroundColor: theme.v2.backgrounds.whiteBackground,
    fontSize: 14,
    fontWeight: 500,
    color: theme.v2.fonts.colors.blackShade1,
  },
}));

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const classes = useStyles();
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
        maxWidth: 200,
        minWidth: 130,
        marginTop: 50,
        marginLeft: -10,
      },
    },
  };

  return (
    <div className="profileContainer">
      <div className="profileHeader">
        <div className="profileHeaderLeftSide">
          <p className="profileText">Profile</p>
        </div>
        {activeTab === 2 && (
          <div className="userFilter">
            <div className="userFilterIcon">
              <img
                src={filterIcon}
                alt="filterIcon"
                style={{ height: "17px" }}
              />
              <p className="userFilterText">Filter</p>
            </div>
            <Select
              variant="standard"
              value={filterRole}
              className={classes.chooseCustSelect}
              style={{
                color: `${filterRole !== "all" ? "#113C23" : "#84A391"}`,
              }}
              IconComponent={() => {
                return (
                  <Grid
                    className={classes.arrowContainer}
                    container
                    justify="center"
                    alignItems="center"
                  >
                    <img src={ArrowDown} alt="Down" style={{ height: "4px" }} />
                  </Grid>
                );
              }}
              onChange={(e) => {
                setFilterRole(e.target.value);
              }}
              defaultValue={"all"}
              MenuProps={MenuProps}
            >
              {[
                <MenuItem key={-1} value={"all"} className={classes.menulabels}>
                  Select Role
                </MenuItem>,
                <MenuItem
                  key={1}
                  value={"admins"}
                  className={classes.menulabels}
                >
                  Admin
                </MenuItem>,
                <MenuItem
                  key={2}
                  value={"inspectors"}
                  className={classes.menulabels}
                >
                  Inspector
                </MenuItem>,
                <MenuItem
                  key={3}
                  value={"field_users"}
                  className={classes.menulabels}
                >
                  Field User
                </MenuItem>,
              ]}
            </Select>
          </div>
        )}
      </div>
      <div className="profileBodyContainer">
        <div className="profileBodyHeader">
          <div
            onClick={() => {
              setActiveTab(1);
            }}
            style={{
              padding: "0px 25px 0px 25px",
              color: activeTab === 1 ? "#0CA14A" : "#84A391",
              borderBottom: activeTab === 1 ? "3px solid #0CA14A" : "",
              marginBottom: "-1.6px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <MyProfileIcon fill={activeTab === 1 ? "#0CA14A" : "#84A391"} />

            <p style={{ fontWeight: activeTab === 1 ? "600" : "500" }}>
              My Profile
            </p>
          </div>
          <div
            onClick={() => {
              setActiveTab(2);
            }}
            style={{
              padding: "0px 25px 0px 25px",
              color: activeTab === 2 ? "#0CA14A" : "#84A391",
              borderBottom: activeTab === 2 ? "3px solid #0CA14A" : "",
              marginBottom: "-1.6px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <MembersDatabaseIcon
              fill={activeTab === 2 ? "#0CA14A" : "#84A391"}
            />
            <p style={{ fontWeight: activeTab === 2 ? "600" : "500" }}>
              Members Database
            </p>
          </div>
          <div
            onClick={() => {
              setActiveTab(3);
            }}
            style={{
              padding: "0px 25px 0px 25px",
              color: activeTab === 3 ? "#0CA14A" : "#84A391",
              borderBottom: activeTab === 3 ? "3px solid #0CA14A" : "",
              marginBottom: "-1.6px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <DeletedUsers fill={activeTab === 3 ? "#0CA14A" : "#84A391"} />
            <p style={{ fontWeight: activeTab === 3 ? "600" : "500" }}>
              Deleted Users
            </p>
          </div>
        </div>
        {activeTab === 2 && <MembersDatabase filterRole={filterRole} />}
        {activeTab === 1 && <UserProfile />}
        {setShowAddUserModal && (
          <AddUserModal
            showAddUserModal={showAddUserModal}
            setShowAddUserModal={setShowAddUserModal}
            setSuccessMsg={setSuccessMsg}
          />
        )}
        {successMsg !== "" && (
          <SuccessMsgModal
            successMsg={successMsg}
            setSuccessMsg={setSuccessMsg}
          />
        )}
        {activeTab === 2 && (
          <div>
            <button
              className="addUserBtn"
              onClick={() => {
                setShowAddUserModal(true);
              }}
            >
              <p>Add User</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
