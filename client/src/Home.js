import React, { useEffect, useState } from "react";
import "./css/App.css";
import * as mui from "@mui/icons-material";
import SidebarData from "./SidebarData";
import Mainnav from "./reactcomponents/Mainnav";
{
  //elements of the ui update automatically whenver state variables are changed
}

function Home() {
  useEffect(() => {
    let getData = SidebarData;
  }, {});
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  return (
    <div className="root">
      <div
        id="sidebar-main"
        className={sidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"}
      >
        <ul className="checklist">
          <SidebarData />
        </ul>
        <button
          type="button"
          onClick={() => {
            setSidebarExpanded(!sidebarExpanded);
          }}
        >
          Dismiss
        </button>

        <mui.CheckCircle />
      </div>

      {
        //side menu is collapsed by defaults
      }
      <div
        id="main-content"
        className={sidebarExpanded ? "main-collapsed" : "main-expanded"}
      ></div>
    </div>
  );
}

export default Home;
