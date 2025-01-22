import React from "react";
import { Navbar } from "./Navbar";

export const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <div
        style={{
          marginRight: "4em",
          marginLeft: "4em",
        }}
      >
        <Navbar />
        {children}
      </div>
    </React.Fragment>
  );
};
