import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./route.tsx";
import { moduleregistri } from "./config/ModuleRegistry.ts";
import { Provider } from "react-redux";
import { store } from "./features/store";
import { ToasterProvider, ToasterConsumer } from "./utills/toasterContext.tsx";
moduleregistri();
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ToasterProvider>
      <RouterProvider router={router} />
      <ToasterConsumer />
    </ToasterProvider>
  </Provider>
);
