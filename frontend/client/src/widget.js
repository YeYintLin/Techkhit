import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import "./index.css";

const roots = new Map();

export function mountIntercom({
  selector = "body",
  buttonStyle,
  panelStyle
} = {}) {
  const container =
    typeof selector === "string" ? document.querySelector(selector) : selector;

  if (!container) {
    throw new Error("TechKhit Intercom: container not found");
  }

  const host = document.createElement("div");
  container.appendChild(host);

  const root = ReactDOM.createRoot(host);
  root.render(<App widgetConfig={{ buttonStyle, panelStyle }} />);

  roots.set(host, root);
  return host;
}

export function unmountIntercom(host) {
  const root = roots.get(host);
  if (root) {
    root.unmount();
    roots.delete(host);
  }

  if (host && host.parentNode) {
    host.parentNode.removeChild(host);
  }
}

if (typeof window !== "undefined") {
  window.TechKhitIntercom = {
    mount: mountIntercom,
    unmount: unmountIntercom
  };
}
