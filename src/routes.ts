import { createBrowserRouter } from "react-router";
import Root, { RootErrorBoundary } from "./app/Root";
import Home from "./pages/Home";
import ParafrasePage from "./pages/ParafrasePage";
import ClaroPage from "./pages/ClaroPage";
import SimulasiPage from "./pages/SimulasiPage";
import GrammarPage from "./pages/GrammarPage";
import PPTPage from "./pages/PPTPage";
import PlagiasPage from "./pages/PlagiasPage";
import NotFound from "./pages/NotFound";
import UpgradePage from "./pages/UpgradePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    ErrorBoundary: RootErrorBoundary,
    children: [
      { index: true, Component: ClaroPage },
      { path: "parafrase", Component: ParafrasePage },
      { path: "claro", Component: ClaroPage },
      { path: "simulasi", Component: SimulasiPage },
      { path: "grammar", Component: GrammarPage },
      { path: "ppt", Component: PPTPage },
      { path: "plagiasi", Component: PlagiasPage },
      { path: "upgrade", Component: UpgradePage },
      { path: "langganan", Component: UpgradePage },
      { path: "*", Component: NotFound },
    ],
  },
]);
