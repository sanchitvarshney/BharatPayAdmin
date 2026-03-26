import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./route.tsx";
import { moduleregistri } from "./config/ModuleRegistry.ts";
import { Provider } from "react-redux";
import { store } from "./features/store";
import { ToasterProvider, ToasterConsumer } from "./utills/toasterContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
moduleregistri();
const googleId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={googleId}>
      <ToasterProvider>
        <RouterProvider router={router} />
        <ToasterConsumer />
      </ToasterProvider>
    </GoogleOAuthProvider>
  </Provider>
);
