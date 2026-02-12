import React from "react";

import {
    Document,
    Font,
    Image,
    Page,
    PDFDownloadLink,
    StyleSheet,
    Text,
    View,
} from "@react-pdf/renderer";
import _ from "lodash";
import moment from "moment";
import RobotoFontBold from "../../assets/fonts/Roboto/Roboto-Bold.ttf";
import RobotoFontLight from "../../assets/fonts/Roboto/Roboto-Light.ttf";
import RobotoFontMedium from "../../assets/fonts/Roboto/Roboto-Medium.ttf";
import RobotoFontRegular from "../../assets/fonts/Roboto/Roboto-Regular.ttf";
import RobotoFontThin from "../../assets/fonts/Roboto/Roboto-Thin.ttf";
import Logo from "../../assets/v2/LogoWithName.png";
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

const MyDocument = (props) => {
  return (
    <Document>
      <Page size="A4">
        <Body {...props} />
      </Page>
    </Document>
  );
};

const Body = (props) => {
  return (
    <View style={{ padding: "5%" }}>
      <View style={{ flexDirection: "row", display: "flex" }}>
        <View style={{ width: "60%", justifyContent: "center" }}>
          <Image src={Logo} style={{ height: 50, width: 350 }} />
        </View>
        <View
          style={{
            width: "40%",
            alignItems: "flex-end",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text
            style={{ fontSize: "20", fontWeight: "bold", fontFamily: "Roboto" }}
          >
            Invoice
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "5%",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: "10",
                fontFamily: "Roboto",
                fontWeight: "bold",
              }}
            >
              Start Date -
            </Text>
            <Text style={{ fontSize: "12", fontFamily: "Roboto" }}>
              {moment(_.get(props, "start_date")).format("DD-MMM-YYYY")}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "5%",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: "10",
                fontFamily: "Roboto",
                fontWeight: "bold",
              }}
            >
              End Date -
            </Text>
            <Text style={{ fontSize: "12", fontFamily: "Roboto" }}>
              {moment(_.get(props, "end_date")).format("DD-MMM-YYYY")}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "5%",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: "10",
                fontFamily: "Roboto",
                fontWeight: "bold",
              }}
            >
              Invoice -
            </Text>
            <Text style={{ fontSize: "12", fontFamily: "Roboto" }}>
              {_.get(props, ["payment", "invoice_id"])}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "5%",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: "10",
                fontFamily: "Roboto",
                fontWeight: "bold",
              }}
            >
              Bill To:-{" "}
            </Text>
            <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>
              {_.get(props, ["group", "account_info", "name"])}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ marginTop: "10%", backgroundColor: "grey" }}>
        <Text
          style={{
            fontSize: "18",
            fontWeight: "bold",
            fontFamily: "Roboto",
            padding: "2%",
            color: "white",
          }}
        >
          Billing Summary
        </Text>
      </View>
      <View>
        <View style={{ flexDirection: "row", display: "flex", padding: "2%" }}>
          <View style={{ width: "50%" }}>
            <Text
              style={{
                fontSize: "18",
                fontFamily: "Roboto",
              }}
            >
              Charges:-
            </Text>
          </View>
          <View style={{ width: "50%", alignItems: "flex-end" }}>
            <Text
              style={{
                fontSize: "18",
                fontFamily: "Roboto",
              }}
            >
              $ {_.get(props, ["payment", "amount"])}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", display: "flex", padding: "2%" }}>
          <View style={{ width: "50%" }}>
            <Text
              style={{
                fontSize: "18",
                fontFamily: "Roboto",
              }}
            >
              Taxes:-
            </Text>
          </View>
          <View style={{ width: "50%", alignItems: "flex-end" }}>
            <Text
              style={{
                fontSize: "18",
                fontFamily: "Roboto",
              }}
            >
              $ 0
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", display: "flex", padding: "2%" }}>
          <View style={{ width: "50%" }}>
            <Text
              style={{
                fontSize: "18",
                fontWeight: "bold",
                fontFamily: "Roboto",
              }}
            >
              Total:-
            </Text>
          </View>
          <View style={{ width: "50%", alignItems: "flex-end" }}>
            <Text
              style={{
                fontSize: "18",
                fontWeight: "bold",
                fontFamily: "Roboto",
              }}
            >
              $ {_.get(props, ["payment", "amount"])}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const InvoicesTemplate = (props) => {
  return (
    <>
      <PDFDownloadLink
        document={<MyDocument {...props} />}
        fileName="BuildSphere_Invoice.pdf"
      >
        {({ blob, url, loading, error }) => {
          if (error) console.log("error", error);
          else {
            if (!loading && url) {
              fileDownload(blob, "BuildSphere_Invoice.pdf");
              props.onClose && props.onClose();
            }
          }
        }}
      </PDFDownloadLink>
    </>
  );
};

const styles = StyleSheet.create({});

export default InvoicesTemplate;
