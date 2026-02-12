import React from "react";
import "./style.css";

const Footer = () => {
  return (
    <div className="footerContainer">
      <div className="horizontalLine"></div>
      <div className="footerContent">
        <p>© 2024 BuildSphere. All rights reserved.</p>
        <p>Terms</p>
        <span className="footerDot"></span>
        <p>Privacy</p>
        <span className="footerDot"></span>
        <p>Website</p>
      </div>
    </div>
  );
};

export default Footer;
