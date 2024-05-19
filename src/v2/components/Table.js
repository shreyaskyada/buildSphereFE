import React, { useState } from "react";
import {
  Grid,
  makeStyles,
  TableBody,
  TableHead,
  TableCell,
  Table,
  TableRow,
  Typography,
  TableSortLabel,
  TableContainer,
} from "@material-ui/core";
import clsx from "clsx";
import _ from "lodash";
import Skull from "../../assets/v2/Skull.svg";
import EditIcon from "../../assets/v2/EditIcon.svg";
import DeleteIcon from "../../assets/v2/DeleteIcon.svg";
import InviteIcon from "../../assets/v2/Attachment.svg";
import { ReactComponent as Download } from "../../assets/v2/DownloadArrow.svg";
import { ReactComponent as Delete } from "../../assets/v2/Cross.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "1%",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
  },
  header: {
    marginRight: "0.5%",
    padding: "1.5% 3% 1% 3%",
    fontSize: 16,
    color: theme.v2.fonts.colors.darkFont,
    border: `1px solid ${theme.v2.borders.lightGrey}`,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    cursor: "pointer",
    "&:focus": {
      outline: "none",
      boxShadow: "none",
    },
  },
  headerSelected: {
    backgroundColor: theme.v2.backgrounds.lightGreyBackground,
    color: theme.v2.fonts.colors.blackShade2,
    fontWeight: "bold",
  },
  tableContainer: {
    backgroundColor: theme.v2.backgrounds.lightGreyBackground,
    padding: "1%",
    marginTop: -2,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    border: `1px solid ${theme.v2.borders.lightGrey}`,
    width: "97%",
  },
  imageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blackShade1,
  },
}));

const useStylesTable = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.v2.backgrounds.whiteBackground,
    borderRadius: 5,
    maxHeight: 0.8 * window.innerHeight,
    overflowY: "auto",
  },
  header: {
    fontSize: 14,
    color: theme.v2.fonts.colors.darkFont,
    fontWeight: 500,
    textTransform: "uppercase",
  },
  tableBodyRow: {
    position: "relative",
    fontSize: 14,
    fontWeigt: 400,
    color: theme.v2.fonts.colors.darkFont,
    justifyContent: "center",
    cursor: "pointer",
    height: 20,
    "&:hover": {
      backgroundColor: theme.v2.backgrounds.lightGreyBackground,
    },
  },
  tableHeadCell: {
    backgroundColor: theme.v2.backgrounds.whiteBackground,
  },
  noDataText: {
    fontSize: 16,
    fontColor: theme.v2.fonts.colors.darkFont,
  },
  tableBodyCell: {
    position: "relative",
  },
  showBtn: {
    display: "block",
    backgroundColor: theme.v2.backgrounds.blueBackgroundShade1,
    position: "absolute",
    width: 0.04 * window.innerWidth,
    minWidth: 55,
    top: "-75%",
    right: "50%",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    zIndex: 100,
  },
  hideBtn: {
    display: "none",
  },
  resolvedCipUnit: {
    backgroundColor: theme.v2.backgrounds.pinkBackgroundShade1,
  },
  unresolvedCipUnit: {
    backgroundColor: theme.v2.backgrounds.lightGreyBackground,
    //backgroundColor: theme.v2.backgrounds.yellowBackgroundShade1,
  },
  hideContainer: {
    display: "none",
  },
  editContainer: {
    width: 45,
    height: 35,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    backgroundColor: theme.v2.backgrounds.blueBackgroundShade1,
    position: "absolute",
    right: 40,
    top: -35,
    zIndex: 2000,
  },
  deleteContainer: {
    width: 45,
    height: 35,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    backgroundColor: theme.v2.backgrounds.redBackground,
    position: "absolute",
    right: 85,
    top: -35,
    zIndex: 2000,
  },
  inviteContainer: {
    width: 45,
    height: 35,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    backgroundColor: theme.v2.backgrounds.blueBackgroundShade1,
    position: "absolute",
    right: 125,
    top: -35,
    zIndex: 2000,
  },
}));

const MyTableContainer = (props) => {
  const classes = useStyles();
  const [selectedHeader, setSelectedHeader] = useState(
    props.selectedHeader || 0
  );
  const headers = props.sections || [];
  return (
    <Grid container className={classes.root}>
      <Grid container className={classes.headerContainer}>
        {headers.map((header, index) => {
          return (
            <div
              key={`Head_${index}`}
              className={clsx(classes.header, {
                [classes.headerSelected]: selectedHeader === index,
              })}
              onClick={() => {
                setSelectedHeader(index);
                header.onClick && header.onClick();
              }}
            >
              {_.get(header, "label")}
            </div>
          );
        })}
      </Grid>
      <Grid container className={classes.tableContainer}>
        <MyTable {...props} />
      </Grid>
    </Grid>
  );
};

const EnhancedTableHead = (props) => {
  const classes = useStylesTable();
  const direction = props.sortDirection || "asc";
  const activeHeader = props.sortBy || 0;
  const headers = props.headers || [];
  return (
    <TableHead>
      <TableRow>
        {headers.map((header, index) => {
          return (
            <TableCell
              key={`HeadRow_${index}`}
              className={classes.tableHeadCell}
            >
              <TableSortLabel
                active={Boolean(header.onClick)}
                direction={activeHeader === index ? direction : "asc"}
                onClick={() => {
                  header.onClick && header.onClick();
                }}
              >
                <Typography className={classes.header}>
                  {_.get(header, "label")}
                </Typography>
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

const MyTable = (props) => {
  const classes = useStylesTable();
  const [showEdit, setShowEdit] = useState({});
  const data = props.data || [];
  const rowClasses = props.rowClasses || [];
  const { edit, deleterow, inviteUserAgain } = props;
  return (
    <TableContainer className={classes.root}>
      <Table stickyHeader aria-label="sticky table">
        <EnhancedTableHead headers={props.headers} {...props} />
        <TableBody>
          {data &&
            _.get(data, "length", 0) > 0 &&
            data.map((row, index) => {
              return (
                <TableRow
                  key={`Row_${index}`}
                  className={clsx(classes.tableBodyRow, {
                    [classes[_.defaultTo(_.get(rowClasses, index), "")]]:
                      Boolean(rowClasses[index]),
                  })}
                  onMouseEnter={() => {
                    setShowEdit(index);
                  }}
                  onMouseLeave={() => {
                    setShowEdit(-1);
                  }}
                  onClick={
                    props.onClickRow && props.onClickRow.bind(this, index)
                  }
                  onDoubleClick={
                    props.onDoubleClickRow &&
                    props.onDoubleClickRow.bind(this, index)
                  }
                >
                  {row.map((column, index2) => {
                    return (
                      <MyTableCell
                        key={`MyTableCell_${index2}`}
                        i={index}
                        j={index2}
                        data={column}
                      />
                    );
                  })}
                  {edit && (
                    <Grid
                      container
                      justify="center"
                      alignItems="center"
                      className={clsx(
                        {
                          [classes.editContainer]: showEdit === index,
                        },
                        {
                          [classes.hideContainer]: showEdit !== index,
                        }
                      )}
                    >
                      <img
                        src={EditIcon}
                        style={{ cursor: "pointer", width: 20, height: 20 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          edit(index);
                        }}
                      />
                    </Grid>
                  )}
                  {row[0].deleteAllowed && deleterow && (
                    <Grid
                      container
                      justify="center"
                      alignItems="center"
                      className={clsx(
                        {
                          [classes.deleteContainer]: showEdit === index,
                        },
                        {
                          [classes.hideContainer]: showEdit !== index,
                        }
                      )}
                    >
                      <img
                        src={DeleteIcon}
                        style={{ cursor: "pointer", width: 20, height: 20 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleterow(index);
                        }}
                      />
                    </Grid>
                  )}
                  {row[0].inviteAgain && inviteUserAgain && (
                    <Grid
                      container
                      justify="center"
                      alignItems="center"
                      className={clsx(
                        {
                          [classes.inviteContainer]: showEdit === index,
                        },
                        {
                          [classes.hideContainer]: showEdit !== index,
                        }
                      )}
                    >
                      <img
                        src={InviteIcon}
                        style={{ cursor: "pointer", width: 20, height: 20 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          inviteUserAgain(index);
                        }}
                      />
                    </Grid>
                  )}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      {!data ||
        (_.get(data, "length", 0) === 0 && (
          <Grid
            container
            item
            xs={12}
            style={{
              height: 0.5 * window.innerHeight,
              flexDirection: "column",
            }}
            justify="center"
            alignItems="center"
          >
            <img src={Skull} alt={"No data"} />
            <Typography className={classes.noDataText}>No data</Typography>
          </Grid>
        ))}
    </TableContainer>
  );
};

const cellStyles = makeStyles((theme) => ({
  default: {
    fontSize: 16,
    color: theme.v2.fonts.colors.darkFont,
  },
  uppercase: {
    textTransform: "uppercase",
  },
  defaultBold: {
    fontSize: 16,
    fontWeight: "bold",
  },
  overdue: {
    color: theme.v2.fonts.colors.redShade1,
  },
  ongoing: {
    color: theme.v2.fonts.colors.greenShade2,
  },
  onHold: {
    color: theme.v2.fonts.colors.yellowShade1,
  },
  completed: {
    color: theme.v2.fonts.colors.blueShade1,
  },
  projectProgress: {
    width: "100%",
    height: 7,
    position: "relative",
    borderRadius: 10,
    background: theme.v2.backgrounds.lightGreyBackground,
    border: `0.2px solid ${theme.v2.borders.lightGrey1}`,
  },
  projectCompleted: {
    maxWidth: "100%",
    height: 7,
    position: "absolute",
    borderRadius: 10,
    left: 0,
    top: 0,
    zIndex: 100,
    backgroundColor: theme.v2.backgrounds.greenBackgroundShade2,
  },
  positiveProgress: {
    color: theme.v2.fonts.colors.greenShade2,
  },
}));

const GetEachCell = ({
  type,
  value,
  field1,
  field2,
  customClasses,
  onClick,
  color,
}) => {
  const classes = cellStyles();

  switch (type) {
    case "default":
      return (
        <Typography
          className={clsx(classes.default, {
            [customClasses]: Boolean(customClasses),
          })}
        >
          {value}
        </Typography>
      );

    case "clickableText":
      return (
        <Typography
          className={clsx(classes.default, {
            [customClasses]: Boolean(customClasses),
          })}
        >
          <span onClick={onClick}>{value}</span>
        </Typography>
      );
    case "defaultImage":
      return (
        <Grid
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
          }}
        >
          {field1 && (
            <img
              src={field1}
              alt="default"
              style={{
                height: 40,
                width: 40,
                borderRadius: 40,
              }}
            />
          )}
          {!field1 && (
            <Grid
              container
              justify="center"
              alignItems="center"
              style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                backgroundColor: "#04A349",
              }}
            >
              <Typography className={classes.imageText}>
                {_.upperCase(
                  (_.get(field2, "first_name") || "").substring(0, 1)
                )}
                {_.upperCase(
                  (_.get(field2, "last_name") || "").substring(0, 1)
                )}
              </Typography>
            </Grid>
          )}
          <Typography
            className={clsx(classes.default, {
              [customClasses]: Boolean(customClasses),
            })}
          >
            &nbsp;&nbsp;&nbsp;{value}
          </Typography>
        </Grid>
      );
    case "defaultUppercase":
      return (
        <Typography
          className={clsx(classes.default, classes.uppercase, {
            [customClasses]: Boolean(customClasses),
          })}
        >
          {value}
        </Typography>
      );
    case "projectStatus":
    case "timeBudget":
      return (
        <Typography
          className={clsx(
            classes.defaultBold,
            {
              [classes.overdue]: field1 === 0,
            },
            { [classes.ongoing]: field1 === 1 },
            { [classes.onHold]: field1 === 2 },
            { [classes.completed]: field1 === 3 }
          )}
        >
          {value}
        </Typography>
      );
    case "projectProgress":
      return (
        <Grid container>
          <Grid item>{`${value}%(+${field1 ? field1 : 0}%)`}</Grid>
          <div className={classes.projectProgress}>
            <div
              className={classes.projectCompleted}
              style={{ width: `${value}%` }}
            />
          </div>
        </Grid>
      );
    case "revenue":
      return (
        <Typography
          className={clsx(classes.defaultBold, {
            [classes.positiveProgress]: field1 > 0,
          })}
        >
          {value}
        </Typography>
      );
    case "download":
      return (
        <Download
          fill={color}
          style={{ width: "50%", cursor: "pointer", textAlign: "center" }}
          onClick={onClick}
        />
      );

    case "delete":
      return (
        <Delete
          fill={color}
          style={{ width: "50%", cursor: "pointer", textAlign: "center" }}
          onClick={value}
        />
      );
    default:
      return <></>;
  }
};

const MyTableCell = ({ i, j, data }) => {
  const classes = useStylesTable();

  return (
    <TableCell key={`Cell_${i}_${j}`} className={classes.tableBodyCell}>
      <GetEachCell
        key={`GetEachCell_${i}_${j}`}
        type={_.get(data, "type")}
        value={_.get(data, "value", "")}
        field1={_.get(data, "field1", null)}
        field2={_.get(data, "field2", null)}
        customClasses={_.get(data, "classes", null)}
        color={_.get(data, "color", null)}
        onClick={_.get(data, "onClick", null)}
      />
    </TableCell>
  );
};

export default MyTableContainer;
