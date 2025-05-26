import "./scss/main.scss";

import "./config.js";

import { routes } from "./routes.js";

const callRoute = () => {
  const { hash } = window.location;
  const [pageName, pageArg] = hash.substring(1).split("/");

  const renderFn = routes[pageName];
  if (renderFn) {
    renderFn(pageArg || "");
  } else {
    routes[""]();
  }
};

window.addEventListener("DOMContentLoaded", callRoute);
window.addEventListener("hashchange", callRoute);
