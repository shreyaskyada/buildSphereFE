import React, { useCallback, useEffect, useState } from "react";
import "./style.css";
import TableNew from "../../components/Table/TableNew";
import skull from "../../../assets/v2/Skull.svg";
import { ReactComponent as EditIcon } from "../../../assets/v2/EditIcon.svg";
import { ReactComponent as Plus } from "../../../assets/v2/Plus.svg";
import { useSelector } from "react-redux";
import axios from "../../../axios";
import _ from "lodash";
import EditContractModal from "../../components/EditContractModal/EditContractModal";
import DeleteContractModal from "../../components/DeleteContractModal/DeleteContractModal";
import CreateContractModal from "../../components/CreateContractModal/CreateContractModal";
import SuccessMsgModal from "../../components/SuccessMsgModal/SuccessMsgModal";
import Filter from "./Filter/Filter";

const Contracts = () => {
  const [showEditContractModal, setShowEditContractModal] = useState(false);
  const [showDeleteContractModal, setShowDeleteContractModal] = useState(false);
  const [showCreateContractModal, setShowCreateContractModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [contracts2, setContracts2] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");

  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const cellStyles = {
    paddingY: "7px",
    fontSize: "14px",
    color: "#123C23",
    fontWeight: "600",
    borderColor: "#DCF4EE",
    fontFamily: "Manrope",
  };

  const columns = [
    { field: "checkbox", headerName: "", width: 50, sortable: false },
    { field: "customer_name", headerName: "Customer", sortable: true },
    { field: "contract_name", headerName: "Contract Name", sortable: true },
    {
      field: "project_count",
      headerName: "Count Of Projects",
      sortable: true,
    },
    {
      field: "actual_value",
      headerName: "Revenue",
      sortable: true,
      format: (value) => {
        return (
          <p style={{ color: "#59A77B", fontWeight: "bold" }}>
            {`+ ${formatter.format((value || 0).toFixed(2))}`}
          </p>
        );
      },
    },
  ];

  const getCustomers = useCallback(async () => {
    try {
      const result = await axios.get(
        `/groups/${groupId}/customers?p=group:${groupId}&sortBy`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setCustomers(_.get(result, ["data", "message"]) || []);
      }
    } catch (err) {}
  }, [groupId, token]);

  const getContracts = useCallback(async () => {
    try {
      const result = await axios.get(`/contracts?p=group:${groupId}`, {
        headers: {
          Authorization: token,
        },
      });
      setContracts2(_.get(result, ["data", "message"]) || []);
    } catch (err) {}
  }, [groupId, token]);

  useEffect(() => {
    getCustomers();
    getContracts();
  }, [getCustomers, getContracts]);

  const contracts = [
    {
      id: "1",
      customer_name: "TDS",
      contract_name: "contract 1",
      project_count: 10,
      actual_value: 220,
    },
    {
      id: "2",
      customer_name: "TDS 2",
      contract_name: "contract 2",
      project_count: 100,
      actual_value: 1220,
    },
    {
      id: "3",
      customer_name: "TDS 3",
      contract_name: "contract 3",
      project_count: 160,
      actual_value: 12200,
    },
  ];

  return (
    <div className="contractsContainer">
      <div className="contractsHeaderContainer">
        <div className="contractsHeaderLeft">
          <p className="contractsText">Contracts</p>
        </div>
        <div className="contractsHeaderRight">
          <Filter customers={customers} contracts={contracts2} />
          <button
            className="editContractBtn"
            onClick={() => {
              setShowEditContractModal(true);
            }}
          >
            <EditIcon /> <p>Edit Contract</p>
          </button>
          <button
            className="addContractBtn"
            onClick={() => {
              setShowCreateContractModal(true);
            }}
          >
            <Plus fill="#FAFBFB" /> <p>New Contract</p>
          </button>
        </div>
      </div>
      <div className="contractTable">
        <TableNew columns={columns} data={contracts} cellStyles={cellStyles} />
        {contracts.length === 0 && (
          <div className="activitiesNoData">
            <img
              src={skull}
              alt="default"
              style={{
                height: 60,
                width: 60,
              }}
            />
            <p style={{ marginTop: "0px", color: "#113C23" }}>No data</p>
          </div>
        )}
      </div>
      {showEditContractModal && (
        <EditContractModal
          showEditContractModal={showEditContractModal}
          setShowEditContractModal={setShowEditContractModal}
          setShowDeleteContractModal={setShowDeleteContractModal}
          customers={customers}
          contracts={contracts2}
        />
      )}
      {showDeleteContractModal && (
        <DeleteContractModal
          showDeleteContractModal={showDeleteContractModal}
          setShowDeleteContractModal={setShowDeleteContractModal}
        />
      )}
      {showCreateContractModal && (
        <CreateContractModal
          getContracts={getContracts}
          getCustomers={getCustomers}
          showCreateContractModal={showCreateContractModal}
          setShowCreateContractModal={setShowCreateContractModal}
          customers={customers}
          setSuccessMsg={setSuccessMsg}
        />
      )}
      {successMsg !== "" && (
        <SuccessMsgModal
          successMsg={successMsg}
          setSuccessMsg={setSuccessMsg}
        />
      )}
    </div>
  );
};

export default Contracts;
