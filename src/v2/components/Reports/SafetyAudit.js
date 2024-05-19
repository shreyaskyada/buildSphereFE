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

const IMG_COUNT = 8;
let count = 0;

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
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          flex: 1,
          paddingBottom: "1%",
        }}
      >
        <View style={{ width: "30%" }}>
          <Image2 source={ReportLogo} />
        </View>
        <View style={{ width: "70%", alignItems: "flex-end" }}>
          <Text
            style={[styles.headerTitles, { fontWeight: 200, fontSize: 16 }]}
          >
            {moment(_.get(props, "createdAt")).format("MM-DD-YYYY")}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", width: "100%" }}>
        <View style={{ width: "100%" }}>
          <Text style={[styles.headerTitles, { fontWeight: 400 }]}>
            SAFETY REPORT
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
          <View style={{ width: "100%", alignItems: "center" }}>
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
            <Text style={styles.headerList}>
              {_.get(props, "work_location")}
            </Text>
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.headerListLabel}>Location</Text>
          </View>
        </View>
        <View style={styles.headerSectionWithBorder}>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.headerList}>{`${
              _.get(props, ["user", "first_name"]) || ""
            } ${_.get(props, ["user", "last_name"]) || ""}`}</Text>
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.headerListLabel}>Inspector</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const Footer = ({ pageNo }) => {
  return (
    <View
      style={{
        marginTop: "5%",
        width: "95%",
        paddingTop: "1%",
        paddingRight: "5%",
        marginLeft: "5%",
        color: "white",
        justifyContent: "center",
        borderTop: "1",
        borderColor: "#959592",
        flexDirection: "row",
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
          RUS2BILL | Safety Report
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
  );
};

const MyDocument = (props) => {
  const {
    ppeFilesNewPage,
    safetyRiskFilesNewPage,
    equipmentFilesNewPage,
    environmentalRiskFilesNewPage,
    otherFilesNewPage,
    trafficFilesNewPage,
    ppeFiles,
    equipmentFiles,
    safetyRiskFiles,
    environmentalRiskFiles,
    otherFiles,
    trafficFiles,
  } = props;

  useEffect(() => {
    return () => (count = 0);
  }, []);

  return (
    <Document>
      <Page size="A4">
        <Header {...props} />
        <FirstPageBody {...props} />
        <Footer pageNo={++count} {...props} />
      </Page>
      {/* first question then */}
      <Page size="A4">
        <Header {...props} />
        <View style={{ padding: "5%", height: "70%" }}>
          <SecondPageBody {...props} />
          {ppeFiles.length > 0 && <MakeImage files={ppeFiles[0] || []} />}
          {ppeFiles.length <= 1 && !equipmentFilesNewPage && (
            <>
              <ThirdPageBody {...props} />
              {equipmentFiles.length > 0 && (
                <MakeImage files={equipmentFiles[0].slice(0, 4) || []} />
              )}
              {((equipmentFiles.length <= 0 && ppeFiles.length <= 1) ||
                (equipmentFiles.length <= 1 && ppeFiles.length <= 0)) &&
                !safetyRiskFilesNewPage && (
                  <>
                    <FourthPageBody {...props} />
                    {safetyRiskFiles.length > 0 && (
                      <MakeImage files={safetyRiskFiles[0].slice(0, 4) || []} />
                    )}
                    {((safetyRiskFiles.length <= 0 &&
                      ppeFiles.length <= 1 &&
                      equipmentFiles.length <= 0) ||
                      (safetyRiskFiles.length <= 1 &&
                        ppeFiles.length <= 0 &&
                        equipmentFiles.length <= 0) ||
                      (safetyRiskFiles.length <= 0 &&
                        ppeFiles.length <= 0 &&
                        equipmentFiles.length <= 1)) &&
                      !environmentalRiskFilesNewPage && (
                        <>
                          <FifthPageBody {...props} />
                          {environmentalRiskFiles.length > 0 && (
                            <MakeImage
                              files={
                                environmentalRiskFiles[0].slice(0, 4) || []
                              }
                            />
                          )}
                          {((safetyRiskFiles.length <= 1 &&
                            ppeFiles.length <= 0 &&
                            equipmentFiles.length <= 0 &&
                            environmentalRiskFiles.length <= 0) ||
                            (safetyRiskFiles.length <= 0 &&
                              ppeFiles.length <= 1 &&
                              equipmentFiles.length <= 0 &&
                              environmentalRiskFiles.length <= 0) ||
                            (safetyRiskFiles.length <= 0 &&
                              ppeFiles.length <= 0 &&
                              equipmentFiles.length <= 1 &&
                              environmentalRiskFiles.length <= 0) ||
                            (safetyRiskFiles.length <= 0 &&
                              ppeFiles.length <= 0 &&
                              equipmentFiles.length <= 0 &&
                              environmentalRiskFiles.length <= 1)) &&
                            !trafficFilesNewPage && (
                              <>
                                <TrafficControll {...props} />
                                {trafficFiles.length > 0 && (
                                  <MakeImage
                                    files={trafficFiles[0].slice(0, 4) || []}
                                  />
                                )}
                              </>
                            )}
                        </>
                      )}
                  </>
                )}
            </>
          )}
        </View>
        <Footer pageNo={++count} {...props} />
      </Page>

      {ppeFiles.length > 1 &&
        ppeFiles.slice(1).map((fileArr, index) => {
          return (
            <Page size="A4">
              <Header {...props} />
              <View style={{ padding: "5%", height: "70%" }}>
                <MakeImage files={fileArr || []} />

                {index === ppeFiles.length - 2 && !equipmentFilesNewPage && (
                  <>
                    <ThirdPageBody {...props} />
                    {equipmentFiles.length > 0 ? (
                      <MakeImage files={equipmentFiles[0].slice(0, 4) || []} />
                    ) : (
                      <>
                        <FourthPageBody {...props} />
                        {safetyRiskFiles.length < 1 && (
                          <>
                            <FifthPageBody {...props} />
                            {environmentalRiskFiles.length < 1 && (
                              <TrafficControll {...props} />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </View>
              <Footer pageNo={++count} {...props} />
            </Page>
          );
        })}

      {equipmentFilesNewPage ? (
        <>
          <Page size="A4">
            <Header {...props} />
            <View style={{ padding: "5%", height: "70%" }}>
              <ThirdPageBody {...props} />
              {equipmentFiles.length > 0 && (
                <MakeImage files={equipmentFiles[0] || []} />
              )}
              {equipmentFiles.length <= 1 && !safetyRiskFilesNewPage && (
                <>
                  <FourthPageBody {...props} />
                  {safetyRiskFiles.length > 0 && (
                    <MakeImage files={safetyRiskFiles[0].slice(0, 4) || []} />
                  )}

                  {((safetyRiskFiles.length <= 0 &&
                    equipmentFiles.length <= 1) ||
                    (safetyRiskFiles.length <= 1 &&
                      equipmentFiles.length <= 0)) &&
                    !environmentalRiskFilesNewPage && (
                      <>
                        <FifthPageBody {...props} />
                        {environmentalRiskFiles.length > 0 && (
                          <MakeImage
                            files={environmentalRiskFiles[0].slice(0, 4) || []}
                          />
                        )}
                        {((safetyRiskFiles.length <= 1 &&
                          equipmentFiles.length <= 0 &&
                          environmentalRiskFiles.length <= 0) ||
                          (safetyRiskFiles.length <= 0 &&
                            equipmentFiles.length <= 1 &&
                            environmentalRiskFiles.length <= 0) ||
                          (safetyRiskFiles.length <= 0 &&
                            equipmentFiles.length <= 0 &&
                            environmentalRiskFiles.length <= 1)) &&
                          !trafficFilesNewPage && (
                            <>
                              <TrafficControll {...props} />
                              {trafficFiles.length > 0 && (
                                <MakeImage
                                  files={trafficFiles[0].slice(0, 4) || []}
                                />
                              )}
                            </>
                          )}
                      </>
                    )}
                </>
              )}
            </View>
            <Footer pageNo={++count} {...props} />
          </Page>

          {equipmentFiles.length > 1 &&
            equipmentFiles.slice(1).map((fileArr, index) => {
              return (
                <Page size="A4">
                  <Header {...props} />
                  <View style={{ padding: "5%", height: "70%" }}>
                    <MakeImage files={fileArr || []} />

                    {index === equipmentFiles.length - 2 &&
                      !safetyRiskFilesNewPage && (
                        <>
                          <FourthPageBody {...props} />
                          {safetyRiskFiles.length > 0 ? (
                            <MakeImage
                              files={safetyRiskFiles[0].slice(0, 4) || []}
                            />
                          ) : (
                            <>
                              <FifthPageBody {...props} />
                              {environmentalRiskFiles.length < 1 && (
                                <TrafficControll {...props} />
                              )}
                            </>
                          )}
                        </>
                      )}
                  </View>
                  <Footer pageNo={++count} {...props} />
                </Page>
              );
            })}
        </>
      ) : (
        equipmentFiles[0] &&
        equipmentFiles[0].slice(4, 8).length > 0 && (
          <>
            <Page size="A4">
              <Header {...props} />
              <View style={{ padding: "5%", height: "70%" }}>
                <MakeImage files={equipmentFiles[0].slice(4, 8)} />
                {equipmentFiles.length <= 1 && !safetyRiskFilesNewPage && (
                  <>
                    <FourthPageBody {...props} />
                    {safetyRiskFiles.length > 0 ? (
                      <MakeImage files={safetyRiskFiles[0].slice(0, 4) || []} />
                    ) : (
                      <>
                        <FifthPageBody {...props} />
                        {environmentalRiskFiles.length < 1 && (
                          <TrafficControll {...props} />
                        )}
                      </>
                    )}
                  </>
                )}
              </View>
              <Footer pageNo={++count} />
            </Page>
            {equipmentFiles.length > 2 &&
              equipmentFiles.slice(2).map((fileArr, index) => {
                return (
                  <Page size="A4">
                    <Header {...props} />
                    <View style={{ padding: "5%", height: "70%" }}>
                      <MakeImage files={fileArr || []} />

                      {index === equipmentFiles.length - 3 &&
                        !safetyRiskFilesNewPage && (
                          <>
                            <FourthPageBody {...props} />
                            {safetyRiskFiles.length > 0 ? (
                              <MakeImage
                                files={safetyRiskFiles[0].slice(0, 4) || []}
                              />
                            ) : (
                              <>
                                <FifthPageBody {...props} />
                                {environmentalRiskFiles.length < 1 && (
                                  <TrafficControll {...props} />
                                )}
                              </>
                            )}
                          </>
                        )}
                    </View>
                    <Footer pageNo={++count} {...props} />
                  </Page>
                );
              })}
          </>
        )
      )}

      {safetyRiskFilesNewPage ? (
        <>
          <Page size="A4">
            <Header {...props} />
            <View style={{ padding: "5%", height: "70%" }}>
              <FourthPageBody {...props} />
              {safetyRiskFiles.length > 0 && (
                <MakeImage files={safetyRiskFiles[0] || []} />
              )}
              {safetyRiskFiles.length <= 1 && !environmentalRiskFilesNewPage && (
                <>
                  <FifthPageBody {...props} />
                  {environmentalRiskFiles.length > 0 && (
                    <MakeImage
                      files={environmentalRiskFiles[0].slice(0, 4) || []}
                    />
                  )}

                  {((safetyRiskFiles.length <= 0 &&
                    environmentalRiskFiles.length <= 1) ||
                    (safetyRiskFiles.length <= 1 &&
                      environmentalRiskFiles.length <= 0)) &&
                    !trafficFilesNewPage && (
                      <>
                        <TrafficControll {...props} />
                        {trafficFiles.length > 0 && (
                          <MakeImage
                            files={trafficFiles[0].slice(0, 4) || []}
                          />
                        )}
                      </>
                    )}
                </>
              )}
            </View>
            <Footer pageNo={++count} {...props} />
          </Page>

          {safetyRiskFiles.length > 1 &&
            safetyRiskFiles.slice(1).map((fileArr, index) => {
              return (
                <Page size="A4">
                  <Header {...props} />
                  <View style={{ padding: "5%", height: "70%" }}>
                    <MakeImage files={fileArr || []} />

                    {index === safetyRiskFiles.length - 2 &&
                      !environmentalRiskFilesNewPage && (
                        <>
                          <FifthPageBody {...props} />
                          {environmentalRiskFiles.length > 0 ? (
                            <>
                              <MakeImage
                                files={
                                  environmentalRiskFiles[0].slice(0, 4) || []
                                }
                              />
                            </>
                          ) : (
                            <>
                              <TrafficControll {...props} />
                            </>
                          )}
                        </>
                      )}
                  </View>
                  <Footer pageNo={++count} {...props} />
                </Page>
              );
            })}
        </>
      ) : (
        safetyRiskFiles[0] &&
        safetyRiskFiles[0].slice(4, 8).length > 0 && (
          <>
            <Page size="A4">
              <Header {...props} />
              <View style={{ padding: "5%", height: "70%" }}>
                <MakeImage files={[...safetyRiskFiles[0].slice(4, 8)]} />
                {safetyRiskFiles.length <= 1 && !environmentalRiskFilesNewPage && (
                  <>
                    <FifthPageBody {...props} />
                    {environmentalRiskFiles.length > 0 ? (
                      <MakeImage
                        files={environmentalRiskFiles[0].slice(0, 4) || []}
                      />
                    ) : (
                      <>
                        <TrafficControll {...props} />
                      </>
                    )}
                  </>
                )}
              </View>
            </Page>
            {safetyRiskFiles.length > 1 &&
              safetyRiskFiles.slice(1).map((fileArr, index) => {
                return (
                  <Page size="A4">
                    <Header {...props} />
                    <View style={{ padding: "5%", height: "70%" }}>
                      <MakeImage files={fileArr || []} />

                      {index === safetyRiskFiles.length - 2 &&
                        !environmentalRiskFilesNewPage && (
                          <>
                            <FifthPageBody {...props} />
                            {environmentalRiskFiles.length > 0 ? (
                              <MakeImage
                                files={
                                  environmentalRiskFiles[0].slice(0, 4) || []
                                }
                              />
                            ) : (
                              <>
                                <TrafficControll {...props} />
                              </>
                            )}
                          </>
                        )}
                    </View>
                    <Footer pageNo={++count} {...props} />
                  </Page>
                );
              })}
          </>
        )
      )}

      {environmentalRiskFilesNewPage ? (
        <>
          <Page size="A4">
            <Header {...props} />
            <View style={{ padding: "5%", height: "70%" }}>
              <FifthPageBody {...props} />
              {environmentalRiskFiles.length > 0 && (
                <MakeImage files={environmentalRiskFiles[0] || []} />
              )}
              {environmentalRiskFiles.length <= 1 && !trafficFilesNewPage && (
                <>
                  <TrafficControll {...props} />
                  {trafficFiles.length > 0 && (
                    <MakeImage files={trafficFiles[0].slice(0, 4) || []} />
                  )}
                </>
              )}
            </View>
            <Footer pageNo={++count} {...props} />
          </Page>

          {environmentalRiskFiles.length > 1 &&
            environmentalRiskFiles.slice(1).map((fileArr, index) => {
              return (
                <Page size="A4">
                  <Header {...props} />
                  <View style={{ padding: "5%", height: "70%" }}>
                    <MakeImage files={fileArr || []} />

                    {index === environmentalRiskFiles.length - 2 &&
                      !trafficFilesNewPage && (
                        <>
                          <TrafficControll {...props} />
                          {trafficFiles.length > 0 ? (
                            <MakeImage
                              files={trafficFiles[0].slice(0, 4) || []}
                            />
                          ) : null}
                        </>
                      )}
                  </View>
                  <Footer pageNo={++count} {...props} />
                </Page>
              );
            })}
        </>
      ) : (
        environmentalRiskFiles[0] &&
        environmentalRiskFiles[0].slice(4, 8).length > 0 && (
          <>
            <Page size="A4">
              <Header {...props} />
              <View style={{ padding: "5%", height: "70%" }}>
                <MakeImage files={environmentalRiskFiles[0].slice(4, 8)} />
                {environmentalRiskFiles.length <= 1 && !trafficFilesNewPage && (
                  <>
                    <TrafficControll {...props} />
                    {trafficFiles.length > 0 ? (
                      <MakeImage files={trafficFiles[0].slice(0, 4) || []} />
                    ) : null}
                  </>
                )}
              </View>
            </Page>
            {environmentalRiskFiles.length > 1 &&
              environmentalRiskFiles.slice(1).map((fileArr, index) => {
                return (
                  <Page size="A4">
                    <Header {...props} />
                    <View style={{ padding: "5%", height: "70%" }}>
                      <MakeImage files={fileArr || []} />

                      {index === environmentalRiskFiles.length - 2 &&
                        !trafficFilesNewPage && (
                          <>
                            <TrafficControll {...props} />
                            {trafficFiles.length > 0 ? (
                              <MakeImage
                                files={trafficFiles[0].slice(0, 4) || []}
                              />
                            ) : null}
                          </>
                        )}
                    </View>
                    <Footer pageNo={++count} {...props} />
                  </Page>
                );
              })}
          </>
        )
      )}

      {trafficFilesNewPage ? (
        <>
          <Page size="A4">
            <Header {...props} />
            <View style={{ padding: "5%", height: "70%" }}>
              <TrafficControll {...props} />
              {trafficFiles.length > 0 && (
                <MakeImage files={trafficFiles[0] || []} />
              )}
            </View>
            <Footer pageNo={++count} {...props} />
          </Page>

          {trafficFiles.length > 1 &&
            trafficFiles.slice(1).map((fileArr, index) => {
              return (
                <Page size="A4">
                  <Header {...props} />
                  <View style={{ padding: "5%", height: "70%" }}>
                    <MakeImage files={fileArr || []} />
                  </View>
                  <Footer pageNo={++count} {...props} />
                </Page>
              );
            })}
        </>
      ) : (
        trafficFiles[0] &&
        trafficFiles[0].slice(4, 8).length > 0 && (
          <>
            <Page size="A4">
              <Header {...props} />
              <View style={{ padding: "5%", height: "70%" }}>
                <MakeImage files={[...trafficFiles[0].slice(4, 8)]} />
              </View>
            </Page>
            {trafficFiles.length > 1 &&
              trafficFiles.slice(1).map((fileArr, index) => {
                return (
                  <Page size="A4">
                    <Header {...props} />
                    <View style={{ padding: "5%", height: "70%" }}>
                      <MakeImage files={fileArr || []} />
                    </View>
                    <Footer pageNo={++count} {...props} />
                  </Page>
                );
              })}
          </>
        )
      )}

      <Page size="A4">
        <Header {...props} />
        <SixthPageBody {...props} />
        <Footer pageNo={++count} {...props} />
      </Page>
    </Document>
  );
};

const FirstPageBody = (props) => {
  const categories = _.get(props, ["safety_audit_category_mappings"], []).map(
    (mapping) => _.toUpper(mapping.category)
  );
  const staff = _.get(props, ["safety_audit_staff_mappings"], []).map(
    (mapping) => _.get(mapping, "name")
  );
  return (
    <View style={{ padding: "5%", width: "100%", height: "70%" }}>
      <View>
        <Text
          style={{
            fontSize: 15,
            fontFamily: "Roboto",
            color: "#707070",
            fontWeight: 400,
          }}
        >
          What work is being performed?
        </Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{
            width: "23%",
            height: 45,
            borderRadius: "10%",
            marginTop: "2%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: categories.includes("HDD") ? "#24231F" : "#F2F2F2",
          }}
        >
          <Text
            style={{
              color: categories.includes("HDD") ? "#FFFFFF" : "#24231F",
              fontSize: 14,
              fontWeight: 200,
            }}
          >
            HDD
          </Text>
        </View>
        <View
          style={{
            width: "23%",
            height: 45,
            borderRadius: "10%",
            marginTop: "2%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: categories.includes("PLOW")
              ? "#24231F"
              : "#F2F2F2",
          }}
        >
          <Text
            style={{
              color: categories.includes("PLOW") ? "#FFFFFF" : "#24231F",
              fontSize: 14,
              fontWeight: 200,
            }}
          >
            Plow
          </Text>
        </View>
        <View
          style={{
            width: "23%",
            height: 45,
            borderRadius: "10%",
            marginTop: "2%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: categories.includes("TRENCH")
              ? "#24231F"
              : "#F2F2F2",
          }}
        >
          <Text
            style={{
              color: categories.includes("TRENCH") ? "#FFFFFF" : "#24231F",
              fontSize: 14,
              fontWeight: 200,
            }}
          >
            Trench
          </Text>
        </View>
        <View
          style={{
            width: "23%",
            height: 45,
            borderRadius: "10%",
            marginTop: "2%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: categories.includes("ARIAL")
              ? "#24231F"
              : "#F2F2F2",
          }}
        >
          <Text
            style={{
              color: categories.includes("ARIAL") ? "#FFFFFF" : "#24231F",
              fontSize: 14,
              fontWeight: 200,
            }}
          >
            Arial
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{
            width: "23%",
            height: 45,
            backgroundColor: "#24231F",
            borderRadius: "10%",
            marginTop: "2%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: categories.includes("SPLICING")
              ? "#24231F"
              : "#F2F2F2",
          }}
        >
          <Text
            style={{
              color: categories.includes("SPLICING") ? "#FFFFFF" : "#24231F",
              fontSize: 14,
              fontWeight: 200,
            }}
          >
            Splicing
          </Text>
        </View>
        <View
          style={{
            width: "23%",
            height: 45,
            borderRadius: "10%",
            marginTop: "2%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: categories.includes("FIBER")
              ? "#24231F"
              : "#F2F2F2",
          }}
        >
          <Text
            style={{
              color: categories.includes("FIBER") ? "#FFFFFF" : "#24231F",
              fontSize: 14,
              fontWeight: 200,
            }}
          >
            Fiber
          </Text>
        </View>
        <View
          style={{
            width: "23%",
            height: 45,
            backgroundColor: "#24231F",
            borderRadius: "10%",
            marginTop: "2%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: categories.includes("DROP SERVICE")
              ? "#24231F"
              : "#F2F2F2",
          }}
        >
          <Text
            style={{
              color: categories.includes("DROP SERVICE")
                ? "#FFFFFF"
                : "#24231F",
              fontSize: 14,
              fontWeight: 200,
            }}
          >
            Drop Service
          </Text>
        </View>
        <View
          style={{
            width: "23%",
            height: 45,
            borderRadius: "10%",
            marginTop: "2%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: categories.includes("INSIDE PLANT")
              ? "#24231F"
              : "#F2F2F2",
          }}
        >
          <Text
            style={{
              color: categories.includes("INSIDE PLANT")
                ? "#FFFFFF"
                : "#24231F",
              fontSize: 14,
              fontWeight: 200,
            }}
          >
            Inside Plant
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: "23%",
            height: 45,
            borderRadius: "10%",
            marginTop: "2%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: categories.includes("ROCK")
              ? "#24231F"
              : "#F2F2F2",
          }}
        >
          <Text
            style={{
              color: categories.includes("ROCK") ? "#FFFFFF" : "#24231F",
              fontSize: 14,
              fontWeight: 200,
            }}
          >
            Rock
          </Text>
        </View>
        <View
          style={{
            marginLeft: "3%",
            width: "23%",
            height: 45,
            borderRadius: "10%",
            marginTop: "2%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: categories.includes("OTHER")
              ? "#24231F"
              : "#F2F2F2",
          }}
        >
          <Text
            style={{
              color: categories.includes("OTHER") ? "#FFFFFF" : "#24231F",
              fontSize: 14,
              fontWeight: 200,
            }}
          >
            Other
          </Text>
        </View>
      </View>
      <View
        style={{
          borderRadius: "10%",
          borderColor: "#E2E2E2",
          borderWidth: "1",
          width: "100%",
          height: 50,
          marginTop: "5%",
        }}
      >
        <Text
          style={{
            fontSize: 9,
            fontFamily: "Roboto",
            fontWeight: "200",
            padding: "1%",
          }}
        >
          {_.get(props, [
            "safety_audit_category_mappings",
            0,
            "work_description",
          ]) || ""}
        </Text>
      </View>
      <View style={{ paddingTop: "10%" }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            fontFamily: "Roboto",
            color: "#04A349",
          }}
        >
          People on site
        </Text>
      </View>
      <View style={{ paddingTop: "3%" }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "400",
            fontFamily: "Roboto",
            color: "#707070",
          }}
        >
          First and last names of all the field workers on site
        </Text>
      </View>
      <View
        style={{
          paddingTop: "3%",
          flexDirection: "row",
          display: "inline-block",
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            fontFamily: "Roboto",
            color: "#24231F",
          }}
        >
          {staff.join("   ")}
        </Text>
      </View>
    </View>
  );
};

const SecondPageBody = (props) => {
  return (
    <View style={{ flexDirection: "row", paddingBottom: 10 }}>
      <View style={{ width: "80%" }}>
        <Text
          style={{
            fontFamily: "Roboto",
            fontSize: 15,
            fontWeight: 400,
            color: "#707070",
          }}
        >
          Is everyone wearing proper PPE?
        </Text>
      </View>
      <View style={{ alignItems: "flex-end", width: "20%" }}>
        <Text
          style={{
            fontFamily: "Roboto",
            fontSize: 15,
            fontWeight: 600,
            color: _.get(props, "proper_ppe") ? "#04A349" : "#EB4223",
          }}
        >
          {_.get(props, "proper_ppe") == true ? "Yes" : "No"}
        </Text>
      </View>
    </View>
  );
};

const ThirdPageBody = (props) => {
  return (
    <View style={{ flexDirection: "row", paddingVertical: 5 }}>
      <View style={{ width: "80%" }}>
        <Text
          style={{
            fontFamily: "Roboto",
            fontSize: 15,
            fontWeight: 400,
            color: "#707070",
          }}
        >
          Is equipment being properly operated?
        </Text>
      </View>
      <View style={{ alignItems: "flex-end", width: "20%" }}>
        <Text
          style={{
            fontFamily: "Roboto",
            fontSize: 15,
            fontWeight: 600,
            color: _.get(props, "equipment_properly_operated")
              ? "#04A349"
              : "#EB4223",
          }}
        >
          {_.get(props, "equipment_properly_operated") == true ? "Yes" : "No"}
        </Text>
      </View>
    </View>
  );
};

const FourthPageBody = (props) => {
  return (
    <View style={{ flexDirection: "row", paddingVertical: 5 }}>
      <View style={{ width: "80%" }}>
        <Text
          style={{
            fontFamily: "Roboto",
            fontSize: 15,
            fontWeight: 400,
            color: "#707070",
          }}
        >
          No safety risks were observed.
        </Text>
      </View>
      <View style={{ alignItems: "flex-end", width: "20%" }}>
        <Text
          style={{
            fontFamily: "Roboto",
            fontSize: 15,
            fontWeight: 600,
            color: _.get(props, "safety_risks_observed")
              ? "#04A349"
              : "#EB4223",
          }}
        >
          {_.get(props, "safety_risks_observed") == true ? "Yes" : "No"}
        </Text>
      </View>
    </View>
  );
};

const FifthPageBody = (props) => {
  return (
    <View style={{ flexDirection: "row", paddingVertical: 5 }}>
      <View style={{ width: "80%" }}>
        <Text
          style={{
            fontFamily: "Roboto",
            fontSize: 15,
            fontWeight: 400,
            color: "#707070",
          }}
        >
          No environmental risks were observed.
        </Text>
      </View>
      <View style={{ alignItems: "flex-end", width: "20%" }}>
        <Text
          style={{
            fontFamily: "Roboto",
            fontSize: 15,
            fontWeight: 600,
            color: _.get(props, "env_risks_observed") ? "#04A349" : "#EB4223",
          }}
        >
          {_.get(props, "env_risks_observed") == true ? "Yes" : "No"}
        </Text>
      </View>
    </View>
  );
};

const TrafficControll = (props) => {
  return (
    <View style={{ flexDirection: "row", paddingVertical: 5 }}>
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
    </View>
  );
};

const SixthPageBody = (props) => {
  const signature = _.get(props, ["user", "user_files", 0]);
  return (
    <View style={{ padding: "5%", height: "70%" }}>
      <View style={{ paddingTop: "1%" }}>
        <Text
          style={{
            fontFamily: "Roboto",
            fontSize: 18,
            fontWeight: 400,
            color: "#707070",
          }}
        >
          Anything else?
        </Text>
      </View>
      <MakeImage files={_.get(props, "otherFiles", [])} />

      <View
        style={{
          maxHeight: "25%",
          paddingTop: "5%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <View>
          <View>
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
          </View>
          <View>
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
          </View>
        </View>

        <View>
          <View>
            {_.get(signature, "file_url") && (
              <Image2 src={signature.file_url} />
            )}
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
              Inspector Signature
            </Text>
          </View>
        </View>
      </View>

      {/* <View
        style={{
          paddingTop: "5%",
          flexDirection: "row",
          justifyContent: "space-between",
          maxHeight: "25%",
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
      </View> */}
    </View>
  );
};

const SafetyAudit = (props) => {
  let ppeFiles = [];
  let equipmentFiles = [];
  let safetyRiskFiles = [];
  let environmentalRiskFiles = [];
  let otherFiles = [];
  let trafficFiles = [];
  let equipmentFilesNewPage = true;
  let ppeFilesNewPage = true;
  let safetyRiskFilesNewPage = true;
  let environmentalRiskFilesNewPage = true;
  let otherFilesNewPage = true;
  let trafficFilesNewPage = true;

  _.get(props, "safety_audit_files_mappings", []).forEach((mapping) => {
    if (_.get(mapping, "type") === "PPE") ppeFiles.push(mapping);
    if (_.get(mapping, "type") === "EQUIPMENT") equipmentFiles.push(mapping);
    if (_.get(mapping, "type") === "SAFETY") safetyRiskFiles.push(mapping);
    if (_.get(mapping, "type") === "ENVIRONMENTAL")
      environmentalRiskFiles.push(mapping);
    if (_.get(mapping, "type") === "OTHERS") otherFiles.push(mapping);

    if (_.get(mapping, "type") === "TRAFFIC") trafficFiles.push(mapping);
  });

  let filesArray = [];
  let tempImages = [];

  for (let i = 0; i < ppeFiles.length; i++) {
    const image = ppeFiles[i];
    if (tempImages.length < IMG_COUNT) {
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

  ppeFiles = filesArray;

  if (ppeFiles.length == 0) {
    equipmentFilesNewPage = false;
  } else {
    if (ppeFiles[ppeFiles.length - 1].length <= IMG_COUNT / 2) {
      equipmentFilesNewPage = false;
    }
  }

  tempImages = [];
  filesArray = [];

  for (let i = 0; i < equipmentFiles.length; i++) {
    const image = equipmentFiles[i];
    if (tempImages.length < IMG_COUNT) {
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

  equipmentFiles = filesArray;
  tempImages = [];
  filesArray = [];
  if (equipmentFiles.length == 0) {
    safetyRiskFilesNewPage = false;
  } else {
    if (!equipmentFilesNewPage) {
      const lastArrSize = equipmentFiles[equipmentFiles.length - 1].length;
      if (lastArrSize >= IMG_COUNT / 2) {
        safetyRiskFilesNewPage = false;
      }
    } else if (
      equipmentFiles[equipmentFiles.length - 1].length <=
      IMG_COUNT / 2
    ) {
      safetyRiskFilesNewPage = false;
    }
  }

  for (let i = 0; i < safetyRiskFiles.length; i++) {
    const image = safetyRiskFiles[i];
    if (tempImages.length < IMG_COUNT) {
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

  safetyRiskFiles = filesArray;
  tempImages = [];
  filesArray = [];

  if (safetyRiskFiles.length == 0) {
    environmentalRiskFilesNewPage = false;
  } else {
    if (!safetyRiskFilesNewPage) {
      const lastArrSize = safetyRiskFiles[safetyRiskFiles.length - 1].length;
      if (lastArrSize >= IMG_COUNT / 2) {
        environmentalRiskFilesNewPage = false;
      }
    } else if (
      safetyRiskFiles[safetyRiskFiles.length - 1].length <=
      IMG_COUNT / 2
    ) {
      environmentalRiskFilesNewPage = false;
    }
  }

  for (let i = 0; i < environmentalRiskFiles.length; i++) {
    const image = environmentalRiskFiles[i];
    if (tempImages.length < IMG_COUNT) {
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

  environmentalRiskFiles = filesArray;
  tempImages = [];
  filesArray = [];

  if (environmentalRiskFiles.length == 0) {
    trafficFilesNewPage = false;
  } else {
    if (!environmentalRiskFilesNewPage) {
      const lastArrSize =
        environmentalRiskFiles[environmentalRiskFiles.length - 1].length;
      if (lastArrSize >= IMG_COUNT / 2) {
        trafficFilesNewPage = false;
      }
    } else if (
      environmentalRiskFiles[environmentalRiskFiles.length - 1].length <=
      IMG_COUNT / 2
    ) {
      trafficFilesNewPage = false;
    }
  }

  for (let i = 0; i < otherFiles.length; i++) {
    const image = otherFiles[i];
    if (tempImages.length < IMG_COUNT) {
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

  otherFiles = filesArray;
  tempImages = [];
  filesArray = [];

  for (let i = 0; i < trafficFiles.length; i++) {
    const image = trafficFiles[i];
    if (tempImages.length < IMG_COUNT) {
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

  trafficFiles = filesArray;
  tempImages = [];
  filesArray = [];

  return (
    <>
      <PDFDownloadLink
        document={
          <MyDocument
            {...props}
            ppeFiles={ppeFiles}
            equipmentFiles={equipmentFiles}
            safetyRiskFiles={safetyRiskFiles}
            environmentalRiskFiles={environmentalRiskFiles}
            otherFiles={otherFiles}
            trafficFiles={trafficFiles}
            ppeFilesNewPage={ppeFilesNewPage}
            equipmentFilesNewPage={equipmentFilesNewPage}
            safetyRiskFilesNewPage={safetyRiskFilesNewPage}
            environmentalRiskFilesNewPage={environmentalRiskFilesNewPage}
            otherFilesNewPage={otherFilesNewPage}
            trafficFilesNewPage={trafficFilesNewPage}
          />
        }
        fileName={`SafetyReport_${_.get(props, ["job", "job_name"])}_${_.get(
          props,
          ["work_location"]
        )}.pdf`}
      >
        {({ blob, url, loading, error }) => {
          if (error) console.log("error", error);
          else {
            if (!loading && url) {
              fileDownload(
                blob,
                `SafetyReport_${_.get(props, ["job", "job_name"])}_${_.get(
                  props,
                  ["work_location"]
                )}.pdf`
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
  //const filesThirdSet = files.splice(0, 4);

  return (
    <View style={{ flexDirection: "column" }}>
      <View
        style={{
          paddingTop: "2%",
          flexDirection: "row",
          // justifyContent: "space-between",
        }}
      >
        {filesFirstSet.map((file, index) => (
          <View
            key={index}
            style={{
              flexDirection: "column",
              margin: "1%",
              width: 100,
              height: 200,
              borderWidth: 1,
              borderRadius: "5%",
              borderColor: "#E2E2E2",
              marginRight: "5%",
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
          //justifyContent: "space-between",
        }}
      >
        {filesSecondSet &&
          filesSecondSet.map((file, index) => (
            <View
              key={`2${index}`}
              style={{
                flexDirection: "column",
                margin: "1%",
                width: 100,
                height: 200,
                borderWidth: 1,
                borderRadius: "5%",
                borderColor: "#E2E2E2",
                marginRight: "5%",
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

      {/* <View
        style={{
          marginTop: "2%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {filesThirdSet &&
          filesThirdSet.map((file, index) => (
            <View
              key={`2${index}`}
              style={{
                flexDirection: "column",
                margin: "1%",
                width: 100,
                height: 200,
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
      </View> */}
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
  },
  headerListLabel: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: 200,
    color: "#E2E2E2",
  },
  headerSectionWithoutBorder: { width: "25%" },
  headerSectionWithBorder: {
    width: "25%",
    borderLeft: 1,
    borderLeftColor: "#6E6B6B",
  },
});

export default SafetyAudit;
