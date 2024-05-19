import React, { useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  Image as Image2,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import RobotoFontRegular from "../../../assets/fonts/Roboto/Roboto-Regular.ttf";
import RobotoFontLight from "../../../assets/fonts/Roboto/Roboto-Light.ttf";
import RobotoFontMedium from "../../../assets/fonts/Roboto/Roboto-Medium.ttf";
import RobotoFontBold from "../../../assets/fonts/Roboto/Roboto-Bold.ttf";
import RobotoFontThin from "../../../assets/fonts/Roboto/Roboto-Thin.ttf";
import LogoBig from "../../../assets/v2/Logo.png";
import ReportLogo from "../../../assets/v2/ReportLogo.png";
import moment from "moment";
import _ from "lodash";
const fileDownload = require("js-file-download");

Font.register({
  family: "Roboto",
  fonts: [
    { src: RobotoFontRegular, fontWeight: 400 },
    { src: RobotoFontLight, fontWeight: 200 },
    { src: RobotoFontMedium, fontWeight: 500 },
    { src: RobotoFontBold, fontWeight: 600 },
    { src: RobotoFontThin, fontWeight: 100 },
  ],
});

const Header = (props) => {
  return (
    <View
      style={{
        backgroundColor: "#24231F",
        width: "100%",
        padding: "5% 5% 3% 5%",
        color: "white",
        justifyContent: "center",
      }}
    >
      <View style={{ width: "30%", paddingBottom: 20 }}>
        <Image2 source={ReportLogo} />
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          flex: 1,
          paddingBottom: "1%",
        }}
      >
        <View style={{ width: "100%" }}>
          <Text style={[styles.headerTitles, { fontWeight: 400 }]}>
            INSPECTION REPORT
          </Text>
        </View>
        <View style={{ width: "70%", alignItems: "flex-end" }}>
          <Text
            style={[styles.headerTitles, { fontWeight: 200, fontSize: 16 }]}
          >
            {moment(_.get(props, "updatedAt")).format("MM-DD-YYYY")}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", width: "100%" }}>
        <View style={{ width: "100%" }}>
          <Text style={[styles.headerTitles, { fontWeight: 400 }]}>
            {_.get(props, ["user", "first_name"])}{" "}
            {_.get(props, ["user", "last_name"])}
          </Text>
        </View>
        <View style={{ width: "100%", alignItems: "flex-end" }}>
          <Text
            style={[
              styles.headerTitles,
              {
                fontWeight: 200,
                fontSize: 16,
              },
            ]}
          >
            Customer: {_.get(props, ["project", "customer", "name"])}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          marginTop: "3%",
          paddingTop: "3%",
          borderTop: 1,
          borderTopColor: "white",
        }}
      >
        <View style={styles.headerSectionWithoutBorder}>
          <View
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={styles.headerList}>
              {_.get(props, ["project", "contract_no"])}
            </Text>
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.headerListLabel}>Project</Text>
          </View>
        </View>
        <View style={styles.headerSectionWithBorder}>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.headerList}>
              {_.get(props, ["job", "job_name"])}
            </Text>
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.headerListLabel}>Job</Text>
          </View>
        </View>
        <View style={styles.headerSectionWithBorder}>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.headerList}>{_.get(props, "sheet_no")}</Text>
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.headerListLabel}>Sheet</Text>
          </View>
        </View>
        <View style={styles.headerSectionWithBorder}>
          <View
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={styles.headerList}>{`${_.get(props, "ld_no")}`}</Text>
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.headerListLabel}>Location</Text>
          </View>
        </View>
        <View style={styles.headerSectionWithBorder}>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.headerList}>
              {_.get(props, ["unit", "unit_name"])}
            </Text>
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.headerListLabel}>Unit</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const Footer = ({ pageNo, user, list_out_issues, signature }) => {
  return (
    <View>
      {signature && (
        <>
          <View
            style={{
              width: "90%",
              alignSelf: "center",
              backgroundColor: "#F2F2F2",
              padding: "2%",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#707070",
              }}
            >
              {list_out_issues}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "90%",
              alignSelf: "center",
              justifyContent: "space-between",
              paddingTop: 20,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "baseline",
                justifyContent: "flex-end",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                }}
              >
                {_.get(user, "first_name")} {_.get(user, "last_name")}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#707070",
                }}
              >
                Inspector Name
              </Text>
            </View>
            <View>
              {_.get(user, ["user_files", 0, "file_url"]) && (
                <Image2
                  style={{
                    width: "100",
                    height: "40",
                    borderTopLeftRadius: "5%",
                    borderTopRightRadius: "5%",
                  }}
                  src={_.get(user, ["user_files", 0, "file_url"])}
                />
              )}
              <Text
                style={{
                  fontSize: 12,
                  color: "#707070",
                }}
              >
                Inspector Signature
              </Text>
            </View>
          </View>
        </>
      )}
      <View
        style={{
          marginTop: "2%",
          width: "95%",
          paddingTop: "1%",
          paddingRight: "5%",
          marginLeft: "5%",
          color: "white",
          justifyContent: "center",
          borderTop: "1",
          borderColor: "#959592",
          flexDirection: "row",
          marginBottom: "5%",
        }}
      >
        <View style={{ width: "3%", justifyContent: "center" }}>
          <Image2 style={{ width: "100%" }} src={LogoBig} />
        </View>
        <View
          style={{
            width: "47%",
            paddingLeft: "1%",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#959592",
              fontSize: 12,
              fontWeight: 400,
              fontFamily: "Roboto",
            }}
          >
            RUS2BILL | Inspection Report
          </Text>
        </View>
        <View
          style={{
            width: "50%",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#959592",
              fontSize: 10,
              fontWeight: 600,
              fontFamily: "Roboto",
            }}
          >
            PAGE | {pageNo}
          </Text>
        </View>
      </View>
    </View>
  );
};

const MyDocument = (props) => {
  const filesArray = [];
  let tempImages = [];

  for (let i = 0; i < _.get(props, ["images", "length"]); i++) {
    const image = props.images[i];
    if (tempImages.length < 4) {
      tempImages.push(image);
    } else {
      filesArray.push(tempImages);
      tempImages = [];
      tempImages.push(image);
    }
  }

  if (tempImages.length > 0) {
    filesArray.push(tempImages);
  }

  return (
    <Document>
      {filesArray.length == 0 && (
        <Page size="A4">
          <Header {...props} />
          <FirstPageBody {...props} filesdata={[]} signature={true} />
          <Footer pageNo={1} {...props} signature={true} />
        </Page>
      )}
      {filesArray.map((images, index) => {
        if (filesArray.length == 1) {
          return (
            <Page size="A4">
              <Header {...props} />
              <FirstPageBody {...props} filesdata={images} signature={true} />
              <Footer pageNo={index + 1} {...props} signature={true} />
            </Page>
          );
        } else {
          if (index === filesArray.length - 1) {
            return (
              <Page size="A4">
                <Header {...props} />
                <OtherPagesBody
                  {...props}
                  filesdata={images}
                  signature={true}
                />
                <Footer pageNo={index + 1} {...props} signature={true} />
              </Page>
            );
          } else if (index == 0) {
            return (
              <Page size="A4">
                <Header {...props} />
                <FirstPageBody
                  {...props}
                  filesdata={images}
                  signature={false}
                />
                <Footer pageNo={index + 1} {...props} signature={false} />
              </Page>
            );
          } else {
            return (
              <Page size="A4">
                <Header {...props} />
                <OtherPagesBody
                  {...props}
                  filesdata={images}
                  signature={false}
                />
                <Footer
                  pageNo={index + 1}
                  {...props}
                  signature={false}
                  questions={index == 0}
                />
              </Page>
            );
          }
        }
      })}
    </Document>
  );
};

const FirstPageBody = (props) => {
  return (
    <View
      style={{
        padding: "5% 5% 0% 5%",
        height: props.signature ? "54%" : "66%",
      }}
    >
      <View style={{ flexDirection: "row", paddingBottom: 20 }}>
        <View style={{ width: "80%" }}>
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 15,
              fontWeight: 400,
              color: "#707070",
            }}
          >
            Is the facility installed per Customer requirements?
          </Text>
        </View>
        <View style={{ alignItems: "flex-end", width: "20%" }}>
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 15,
              fontWeight: 600,
              color: _.get(props, "completed_as_per_req")
                ? "#04A349"
                : "#EB4223",
            }}
          >
            {_.get(props, "completed_as_per_req") == true ? "Yes" : "No"}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", paddingBottom: 20 }}>
        <View style={{ width: "80%" }}>
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 15,
              fontWeight: 400,
              color: "#707070",
            }}
          >
            Are the Redlines uploaded and accurate?{" "}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end", width: "20%" }}>
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 15,
              fontWeight: 600,
              color: _.get(props, "red_lines") ? "#04A349" : "#EB4223",
            }}
          >
            {_.get(props, "red_lines") == true ? "Yes" : "No"}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", paddingBottom: 20 }}>
        <View style={{ width: "80%" }}>
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 15,
              fontWeight: 400,
              color: "#707070",
            }}
          >
            Is the area surrounding the completed facility, restored per TDS
            Requirements?
          </Text>
        </View>
        <View style={{ alignItems: "flex-end", width: "20%" }}>
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 15,
              fontWeight: 600,
              color: _.get(props, "fac_inst_p_req") ? "#04A349" : "#EB4223",
            }}
          >
            {_.get(props, "fac_inst_p_req") == true ? "Yes" : "No"}
          </Text>
        </View>
      </View>

      {/* <View style={{ flexDirection: "row", paddingBottom: 20 }}>
        <View style={{ width: "80%" }}>
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 15,
              fontWeight: 400,
              color: "#707070",
            }}
          >
            Are sufficient traffic control measures being taken?
          </Text>
        </View>
        <View style={{ alignItems: "flex-end", width: "20%" }}>
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 15,
              fontWeight: 600,
              color: _.get(props, "suff_traf_control") ? "#04A349" : "#EB4223",
            }}
          >
            {_.get(props, "suff_traf_control") == true ? "Yes" : "No"}
          </Text>
        </View>
      </View> */}

      <MakeImage files={_.get(props, "filesdata", [])} />
    </View>
  );
};

const OtherPagesBody = (props) => {
  return (
    <View
      style={{
        padding: "5% 5% 0% 5%",
        height: props.signature ? "54%" : "66%",
      }}
    >
      <MakeImage files={_.get(props, "filesdata", [])} />
    </View>
  );
};

const SecondPageBody = (props) => {
  return (
    <View style={{ padding: "5%", height: "70%" }}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "80%" }}>
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 15,
              fontWeight: 400,
              color: "#707070",
            }}
          >
            Are the redlines uploaded and accurate?
          </Text>
        </View>
        <View style={{ alignItems: "flex-end", width: "20%" }}>
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 15,
              fontWeight: 600,
              color: _.get(props, "red_lines") ? "#04A349" : "#EB4223",
            }}
          >
            {_.get(props, "red_lines") == true ? "Yes" : "No"}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", marginTop: "5%" }}>
        <View style={{ width: "80%" }}>
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 15,
              fontWeight: 400,
              color: "#707070",
            }}
          >
            Do the units accurately reflect the work completed in the field?
          </Text>
        </View>
        <View style={{ alignItems: "flex-end", width: "20%" }}>
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 15,
              fontWeight: 600,
              color: _.get(props, "units_ref_work") ? "#04A349" : "#EB4223",
            }}
          >
            {_.get(props, "units_ref_work") == true ? "Yes" : "No"}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", marginTop: "5%" }}>
        <View style={{ width: "80%" }}>
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 15,
              fontWeight: 400,
              color: "#707070",
            }}
          >
            Is the area surrounding the completed facility, restored per TDS
            Requirements?
          </Text>
        </View>
        <View style={{ alignItems: "flex-end", width: "20%" }}>
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 15,
              fontWeight: 600,
              color: _.get(props, "area_surr_fac") ? "#04A349" : "#EB4223",
            }}
          >
            {_.get(props, "area_surr_fac") == true ? "Yes" : "No"}
          </Text>
        </View>
      </View>
      <MakeImage files={_.get(props, "areaSurrFiles", []).splice(0, 4)} />
    </View>
  );
};

const ThirdPageBody = (props) => {
  const signature = _.get(props, ["user", "user_files", 0]);
  const showImages = _.get(props, ["areaSurrFiles", "length"], 0) > 0;
  return (
    <View style={{ padding: "5%", height: "70%" }}>
      {showImages && (
        <MakeImage files={_.get(props, "areaSurrFiles", []).splice(0, 4)} />
      )}
      <View style={{ flexDirection: "column" }}>
        <View style={{ width: "100%" }}>
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 15,
              fontWeight: 400,
              color: "#707070",
            }}
          >
            List out any other issues that need to be adressed with this
            activity below :
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            padding: "2%",
            backgroundColor: "#F2F2F2",
            borderRadius: "10%",
            marginTop: "2%",
          }}
        >
          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 14,
              fontWeight: 400,
              color: "#41403C",
            }}
          >
            {_.get(props, "any_other_issue_notes")}
          </Text>
        </View>
      </View>
      <View
        style={{
          maxHeight: "25%",
          paddingTop: "5%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontFamily: "Roboto",
            fontSize: 15,
            fontWeight: 600,
            color: "#24231F",
          }}
        >
          {`${_.get(props, ["user", "first_name"]) || ""} ${
            _.get(props, ["user", "last_name"]) || ""
          }`}
        </Text>
        {_.get(signature, "file_url") && <Image2 src={signature.file_url} />}
      </View>
      <View
        style={{
          paddingTop: "5%",
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontFamily: "Roboto",
            fontSize: 15,
            fontWeight: 400,
            color: "#707070",
          }}
        >
          Inspector Name
        </Text>
        <Text
          style={{
            fontFamily: "Roboto",
            fontSize: 15,
            fontWeight: 400,
            color: "#707070",
          }}
        >
          Inspector Signature
        </Text>
      </View>
    </View>
  );
};

const InspectionReport = (props) => {
  return (
    <>
      <PDFDownloadLink
        document={<MyDocument {...props} />}
        fileName={`InspectionReport_${_.get(props, "ld_no")}_${_.get(
          props,
          "sheet_no"
        )}_${_.get(props, ["unit", "unit_name"])}.pdf`}
      >
        {({ blob, url, loading, error }) => {
          if (error) console.log("error", error);
          else {
            if (!loading && url) {
              fileDownload(
                blob,
                `InspectionReport_${_.get(props, "ld_no")}_${_.get(
                  props,
                  "sheet_no"
                )}_${_.get(props, ["unit", "unit_name"])}.pdf`
              );
              props.onClose();
            }
          }
        }}
      </PDFDownloadLink>
    </>
  );
};

const MakeImage = ({ files }) => {
  const filesFirstSet = files.splice(0, 4);
  const filesSecondSet = files.splice(0, 4);
  return (
    <View style={{ flexDirection: "column" }}>
      <View
        style={{
          paddingTop: "2%",
          flexDirection: "row",
        }}
      >
        {filesFirstSet.map((file, index) => (
          <View
            key={index}
            style={{
              flexDirection: "column",
              margin: "1%",
              width: "20vw",
              height: "40vw",
              borderWidth: 1,
              borderRadius: "5%",
              borderColor: "#E2E2E2",
            }}
          >
            {_.isEmpty(file) && (
              <View
                style={{
                  width: "100%",
                  height: "80%",
                  backgroundColor: "#F4F4F4",
                }}
              />
            )}
            {_.get(file, "doc_url") && (
              <Image2
                style={{
                  width: "100%",
                  height: "80%",
                  borderTopLeftRadius: "5%",
                  borderTopRightRadius: "5%",
                }}
                src={_.get(file, "doc_url")}
              />
            )}
            <View
              style={{
                width: "100%",
                padding: "3%",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 400,
                  fontSize: 9,
                  fontColor: "#24231F",
                }}
              >
                {_.get(file, "doc_desc", "")}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View
        style={{
          marginTop: "2%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {filesSecondSet &&
          filesSecondSet.map((file, index) => (
            <View
              key={`2${index}`}
              style={{
                flexDirection: "column",
                margin: "1%",
                width: "20vw",
                height: "30vw",
                borderWidth: 1,
                borderRadius: "5%",
                borderColor: "#E2E2E2",
              }}
            >
              {_.isEmpty(file) && (
                <View
                  style={{
                    width: "100%",
                    height: "80%",
                    backgroundColor: "#F4F4F4",
                  }}
                />
              )}
              {_.get(file, "doc_url") && (
                <Image2
                  style={{
                    width: "100%",
                    height: "80%",
                    borderTopLeftRadius: "5%",
                    borderTopRightRadius: "5%",
                  }}
                  src={_.get(file, "doc_url")}
                />
              )}
              <View style={{ width: "100%", padding: "2%" }}>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: 400,
                    fontSize: 9,
                    fontColor: "#24231F",
                  }}
                >
                  {_.get(file, "doc_desc", "")}
                </Text>
              </View>
            </View>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerTitles: {
    fontFamily: "Roboto",
    fontSize: 19,
    color: "#E2E2E2",
  },
  headerList: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: 600,
    textAlign: "center",
    flex: 1,
  },
  headerListLabel: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: 200,
    color: "#E2E2E2",
  },
  headerSectionWithoutBorder: { width: "20%" },
  headerSectionWithBorder: {
    width: "20%",
    borderLeft: 1,
    borderLeftColor: "#6E6B6B",
  },
});

export default InspectionReport;
