import React, { Component } from "react";

import ReactStickyNotes from "@react-latest-ui/react-sticky-notes";

const Scratchpad = () => {
  return (
    <div className="w-full h-full">
      <div className="text-2xl flex gap-1 pb-2">
        <p className="font-semibold">Scratchpad</p>
      </div>
      <ReactStickyNotes
        navbar={false}
        useCSS={true}
        colorCodes={["#a0b992", "#84a573", "#6b8c5a", "#536d46", "#3b4e32", "#242f1e"]}
      />
    </div>
  );
};

export default Scratchpad;
