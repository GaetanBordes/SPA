const callRoute = () => {
  const { hash } = window.location; // ex. "#pagelist/borderlands"
  const [pageName, pageArg] = hash
    .substring(1) // enlève le "#"
    .split("/"); // ["pagelist","borderlands"] ou ["",""]

  const renderFn = routes[pageName];
  if (renderFn) {
    renderFn(pageArg || "");
  } else {
    Home();
  }
};

window.addEventListener("DOMContentLoaded", callRoute);
window.addEventListener("hashchange", callRoute);
