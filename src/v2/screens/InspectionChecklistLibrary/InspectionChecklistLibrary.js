import React, { useState } from "react";
import "./style.css";
import { checkList } from "./checkList";
import ArrowDown from "../../../assets/v2/ArrowDown.svg";

const InspectionChecklistLibrary = () => {
  const [activeChecklistBox, setActiveChecklistBox] = useState(1);

  const handleLeftClick = () => {
    setActiveChecklistBox(activeChecklistBox - 1);
  };

  const handleRightClick = () => {
    setActiveChecklistBox(activeChecklistBox + 1);
  };
  return (
    <div className="checklistLibraryContainer">
      <div className="checklistLibraryHeaderContainer">
        <div className="checklistLibraryHeader">
          <p className="checklistLibraryText">Inspection Checklist Library</p>
        </div>
      </div>
      <div className="checklistLibraryBody">
        <div className="checklistLibraryBodyLeftBar">
          {checkList.map((checkList, index) => {
            return (
              <div
                className="checklistDetails"
                onClick={() => {
                  setActiveChecklistBox(index + 1);
                }}
                style={{
                  border:
                    activeChecklistBox === index + 1 ? "2px solid #0CA14A" : "",
                }}
              >
                <div className="checklistDetailsHeader">
                  <div className="checklistDetailsHeaderLeft">
                    <h5 style={{ color: "#0CA14A" }}>
                      {checkList.customerName}
                    </h5>
                    <p className="customerText">Customer Name</p>
                  </div>
                  <div className="checklistDetailsHeaderRight">
                    <h5 style={{ color: "#0CA14A" }}>
                      {checkList.totalChecklist}
                    </h5>
                    <p className="checklistsText">Checklists</p>
                  </div>
                </div>
                {checkList.checklist.map((item) => {
                  return (
                    <div className="checklistDetailsBody">
                      <div className="horizontalLine" />
                      <div className="checklistDetailsBodyRow">
                        <p className="checklistCategory">{item.category}</p>
                        <p className="checklistName">{item.name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="checklistLibraryBodyRightContent">
          <div className="rightContentHeader">
            <h3>{checkList[activeChecklistBox - 1].customerName}</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                className="arrowContainer"
                style={{
                  cursor: "pointer",
                  opacity: activeChecklistBox === 1 ? "0.5" : "1",
                }}
                onClick={activeChecklistBox !== 1 && handleLeftClick}
              >
                <img
                  src={ArrowDown}
                  alt="Down"
                  style={{ height: "4px", rotate: "90deg" }}
                />
              </div>
              <div
                className="arrowContainer"
                style={{
                  cursor: "pointer",
                  opacity:
                    activeChecklistBox === checkList.length ? "0.5" : "1",
                }}
                onClick={
                  activeChecklistBox !== checkList.length && handleRightClick
                }
              >
                <img
                  src={ArrowDown}
                  alt="Down"
                  style={{ height: "4px", rotate: "-90deg" }}
                />
              </div>
            </div>
          </div>
          <div className="rightContentBody">
            {checkList[activeChecklistBox - 1].checklist.map((item, index) => {
              return (
                <div className="checklistInfo">
                  <div className="checklistInfoHeader">
                    <div className="category">
                      <span>{index + 1}.</span>
                      <p> {item.category}</p>
                    </div>
                    <div className="removalScope">
                      <div
                        style={{
                          backgroundColor: item.removalScope
                            ? "#0CA14A"
                            : "#DCF4EE",
                        }}
                      ></div>
                      <p> Removal scope</p>
                    </div>
                  </div>
                  {item.questions.map((question, index) => {
                    return (
                      <div className="checklistInfoBody">
                        <div className="checklistInfoBodyRow">
                          <div className="checklistQuestion">
                            <p>
                              {index + 1}
                              {". "}
                              {question.question}{" "}
                            </p>
                          </div>
                          <div className="itemScore">
                            <p>
                              item Score:{" "}
                              <span
                                style={{ color: "#0CA14A", fontWeight: "bold" }}
                              >
                                {question.score}
                              </span>
                            </p>
                          </div>
                          <div className="image">
                            <div
                              style={{
                                backgroundColor: question.image
                                  ? "#0CA14A"
                                  : "#DCF4EE",
                              }}
                            ></div>
                            <p> Image</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionChecklistLibrary;
