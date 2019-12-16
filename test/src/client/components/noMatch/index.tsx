import * as React from "react";
import tom from "@assets/images/tom.jpg";
import "./noMatch.less";

const NoMatch = () => (
  <div className="noMatch-container">
    <img src={tom} alt="" />
    <p>找啥呢???</p>
  </div>
);
export default NoMatch;
