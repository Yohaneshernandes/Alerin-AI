import { createBrowserRouter } from "react-router";
import Root from "./app/Root";
import Home from "./pages/Home";
import ParafrasePage from "./pages/ParafrasePage";
import ClaroPage from "./pages/ClaroPage";
import SimulasiPage from "./pages/SimulasiPage";
import GrammarPage from "./pages/GrammarPage";
import PPTPage from "./pages/PPTPage";
import PlagiasPage from "./pages/PlagiasPage";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: ClaroPage },
      { path: "parafrase", Component: ParafrasePage },
      { path: "claro", Component: ClaroPage },
      { path: "simulasi", Component: SimulasiPage },
      { path: "grammar", Component: GrammarPage },
      { path: "ppt", Component: PPTPage },
      { path: "plagiasi", Component: PlagiasPage },
      { path: "*", Component: NotFound },
    ],
  },
]);
