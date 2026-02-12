import React, { useEffect, useState } from "react";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { Grid, makeStyles, TextField } from "@material-ui/core";
import ArrowDown from "../../../../assets/v2/ArrowDown.svg";
import filterIcon from "../../../../assets/v2/Filter.svg";

const useStyles = makeStyles((theme) => ({
  arrowContainer: {
    backgroundColor: "#E5FAE7",
    height: 18,
    width: 18,
    borderRadius: "50%",
  },
  textField: {
    "& .MuiInput-root": {
      height: "32px",
      width: "150px",
      fontWeight: 500,
      backgroundColor: "white",
      paddingLeft: "10px",
      fontFamily: "Manrope",
      fontSize: "14px",
      border: "2px solid #DBF4EE",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#84A391",
      //   opacity: 1,
    },
    "& .MuiInputBase-input:not(:placeholder-shown)": {
      color: "#1c3d5a",
    },
    "& .Mui-focused": {
      border: "2px solid #4BCE82",
    },

    "& .MuiFormHelperText-root": {
      border: 0,
    },
  },
  autocompleteRoot: {
    "& .MuiAutocomplete-popupIndicator": {
      marginRight: "10px",
    },
  },
}));

const Filter = ({ customers, contracts, setFilters }) => {
  const classes = useStyles();
  const [newCustomers, setNewCustomers] = useState(null);
  const [newContracts, setNewContracts] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [contract, setContract] = useState(null);
  const [customerContracts, setCustomerContracts] = useState({});
  const filter = createFilterOptions();

  useEffect(() => {
    let temp = [...customers];

    temp = customers.map((customer) => {
      return {
        id: customer.customer_id,
        name: customer.customer.name,
      };
    });
    setNewCustomers([...temp]);

    temp = [...contracts];
    temp = contracts.map((contract) => {
      return {
        id: contract.contract_id,
        name: contract.contract_name,
      };
    });
    setNewContracts([...temp]);
  }, [customers, contracts]);

  const manageCustomerContracts = (customerId) => {
    if (!customerContracts?.[customerId]) {
      let tempContracts = contracts.filter((contract) => {
        return contract.customer_id === customerId;
      });

      tempContracts = tempContracts.map((contract) => {
        return {
          id: contract.contract_id,
          name: contract.contract_name,
        };
      });

      setCustomerContracts((prev) => {
        return {
          ...prev,
          [customerId]: tempContracts,
        };
      });
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginRight: "10px",
          alignItems: "center",
        }}
      >
        <img src={filterIcon} alt="filterIcon" style={{ height: "17px" }} />
        <p
          className="filterText"
          style={{ fontWeight: "bold", fontSize: "12px" }}
        >
          Filter
        </p>

        <Autocomplete
          value={customer}
          className={classes.autocompleteRoot}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              setCustomer({
                name: newValue,
              });
            } else if (newValue && newValue.inputValue) {
              setCustomer({
                name: newValue.inputValue,
              });
            } else {
              setCustomer(newValue);
            }
            setContract(null);
            if (newValue) {
              manageCustomerContracts(newValue.id);
            }
            setFilters((filters) => ({
              customerId: newValue ? newValue.id : undefined,
              contractId: undefined,
            }));
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="customer"
          options={newCustomers}
          getOptionLabel={(option) => {
            if (typeof option === "string") {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.name;
          }}
          renderOption={(option) => option.name}
          popupIcon={
            <Grid
              className={classes.arrowContainer}
              container
              justify="center"
              alignItems="center"
            >
              <img src={ArrowDown} alt="Down" style={{ height: "4px" }} />
            </Grid>
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Customer"
              variant={"standard"}
              className={classes.textField}
            />
          )}
        />
        <Autocomplete
          value={contract}
          className={classes.autocompleteRoot}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              setContract({
                name: newValue,
              });
            } else if (newValue && newValue.inputValue) {
              setContract({
                name: newValue.inputValue,
              });
            } else {
              setContract(newValue);
            }

            setFilters((filters) => ({
              ...filters,
              contractId: newValue ? newValue.id : undefined,
            }));
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="contract"
          options={customer ? customerContracts[customer.id] : newContracts}
          getOptionLabel={(option) => {
            if (typeof option === "string") {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.name;
          }}
          renderOption={(option) => option.name}
          popupIcon={
            <Grid
              className={classes.arrowContainer}
              container
              justify="center"
              alignItems="center"
            >
              <img src={ArrowDown} alt="Down" style={{ height: "4px" }} />
            </Grid>
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Contract"
              variant={"standard"}
              className={classes.textField}
            />
          )}
        />
      </div>
    </>
  );
};

export default Filter;
