import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  const [showCreateContractModal, setShowCreateContractModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState(undefined);
  const [contracts, setContracts] = useState([]);
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
    textAlign: "center",
  };

  const columns = [
    { field: "customer_name", headerName: "Customer", sortable: true, align: 'center' },
    { field: "contract_name", headerName: "Contract Name", sortable: true, align: 'center' },
    {
      field: "project_count",
      headerName: "Count Of Projects",
      sortable: true,
      align: 'center'
    },
    {
      field: "actual_value",
      headerName: "Revenue",
      sortable: true,
      align: 'center',
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
    } catch (err) { }
  }, [groupId, token]);

  const getContracts = useCallback(async () => {
    try {
      const result = await axios.get(`/contracts/table-view?p=group:${groupId}`, {
        headers: {
          Authorization: token,
        },
      });
      setContracts(_.get(result, ["data", "message"]) || []);
    } catch (err) { }
  }, [groupId, token]);

  useEffect(() => {
    getCustomers();
    getContracts();
  }, [getCustomers, getContracts]);

  const contractsData = useMemo(() => {
    if (filters?.customerId || filters?.contractId) {
      if (filters.customerId && filters.contractId) {
        return contracts.filter((contract) => contract.contract_id === filters.contractId && contract.customer_id === filters.customerId)
      }
      if (filters.customerId) {
        return contracts.filter((contract) => contract.customer_id === filters.customerId)
      }
      if (filters.contractId) {
        return contracts.filter((contract) => contract.contract_id === filters.contractId)
      }
    } else {
      return contracts;
    }
  }, [contracts, filters]);

  return (
    <div className="contractsContainer">
      <div className="contractsHeaderContainer">
        <div className="contractsHeaderLeft">
          <p className="contractsText">Contracts</p>
        </div>
        <div className="contractsHeaderRight">
          <Filter customers={customers} contracts={contracts} setFilters={setFilters} />
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
        <TableNew columns={columns} data={contractsData} cellStyles={cellStyles} />
        {contracts.length === 0 || !contractsData.length && (
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
          customers={customers}
          contracts={contracts}
          setSuccessMsg={setSuccessMsg}
          getContracts={getContracts}
          getCustomers={getCustomers}
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
