import React from "react";
import ReactDOM from "react-dom/client";

import "@arc-ui/themes/lib/bt-business.css";
import "@arc-ui/components/lib/styles.css";

import { Theme } from "@arc-ui/components/Theme";

import { App } from "./App";
import "./reset.css";
import "./tokens.css";
import "./dashboard.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme theme="bt-business">
      <App />
    </Theme>
  </React.StrictMode>,
);
