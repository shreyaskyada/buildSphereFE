import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";
import { ReactComponent as DownArrow } from "../../../assets/v2/DownArrow.svg";
import { ReactComponent as UpArrow } from "../../../assets/v2/UpArrow.svg";

const TableNew = ({
  columns,
  data,
  cellStyles,
  handleRowClick = () => {},
  cursorPointer = false,
}) => {
  const [defaultData, setDefaultData] = useState([]);
  const [data_, setData_] = useState([]);
  const [sortedData, setSortedData] = useState({});
  const [sortingInfo, setSortingInfo] = useState({});

  const sort = (key) => {
    const data_ = [...defaultData];
    const sorted_data = data_.sort((a, b) => {
      if (typeof a[key] === "string") {
        if (a[key]?.toLowerCase() < b[key]?.toLowerCase()) {
          return -1;
        }
        if (a[key]?.toLowerCase() > b[key]?.toLowerCase()) {
          return 1;
        }
        return 0;
      } else {
        if (a[key] < b[key]) {
          return -1;
        }
        if (a[key] > b[key]) {
          return 1;
        }
        return 0;
      }
    });

    return sorted_data;
  };

  const manageSorting = () => {
    let sort_data = {};
    columns.forEach((column) => {
      const sortBy = sort(column.field);
      sort_data[column.headerName] = {
        asc: [...sortBy],
        dec: [...sortBy.reverse()],
      };
    });

    setSortedData({ ...sort_data });
  };

  const handleSorting = (e) => {
    const key = e.currentTarget.id;
    if (sortingInfo?.[key]) {
      if (sortingInfo[key] === null) {
        setSortingInfo({ [key]: "dec" });
        const temp = sortedData[key]?.dec;
        if (temp) setData_([...temp]);
      }
      if (sortingInfo[key] === "dec") {
        setSortingInfo({ [key]: "asc" });
        const temp = sortedData[key]?.asc;
        if (temp) setData_([...temp]);
      }
      if (sortingInfo[key] === "asc") {
        setSortingInfo({ [key]: null });
        setData_([...defaultData]);
      }
    } else {
      setSortingInfo({ [key]: "dec" });
      const temp = sortedData[key]?.dec;
      if (temp) setData_([...temp]);
    }
  };

  useEffect(() => {
    setDefaultData([...data]);
    setData_([...data]);
    setSortingInfo({});
  }, [data]);

  useEffect(() => {
    manageSorting();
  }, [defaultData]);

  return (
    <TableContainer sx={{ maxHeight: "100%", borderRadius: "10px" }}>
      <Table stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell
                key={index}
                id={col.headerName}
                sx={{
                  fontSize: "12px",
                  paddingY: "10px",
                  color: "#113C23",
                  borderColor: "#DCF4EE",
                  fontFamily: "Manrope",
                  fontWeight: "650",
                  cursor: col.sortable ? "pointer" : "",
                }}
                onClick={col.sortable ? handleSorting : null}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  {col.headerName}
                  {col.sortable && (
                    <div
                      style={{
                        height: "15px",
                        width: "15px",
                        borderRadius: "50%",
                        backgroundColor:
                          sortingInfo[col.headerName] && sortingInfo !== null
                            ? "#DCF4EE"
                            : "",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {sortingInfo[col.headerName] === "asc" ? (
                        <UpArrow style={{ height: "11px" }} />
                      ) : (
                        <DownArrow style={{ height: "11px" }} />
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data_.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{
                cursor: cursorPointer ? "pointer" : "",
                "&:hover": { background: "#F1F8F5" },
              }}
              onClick={() => handleRowClick(row)}
            >
              {columns.map((col, colIndex) => (
                <TableCell
                  key={colIndex}
                  sx={{
                    ...cellStyles,
                    width: col.width || "auto",
                    paddingRight: colIndex === 0 ? 0 : undefined,
                  }}
                >
                  {col.field === "checkbox" ? (
                    <Checkbox
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    />
                  ) : col.format ? (
                    col.format(row[col.field], row)
                  ) : (
                    row[col.field]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableNew;
