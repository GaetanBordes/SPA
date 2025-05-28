// src/routes.js
import { Home } from "./js/Home.js";
import { PageList } from "./js/PageList.js";
import { PageDetail } from "./js/PageDetail.js";

export const routes = {
  "": Home,
  pagelist: PageList,
  game: PageDetail,
};
