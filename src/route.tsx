import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/dashboard/HomePage";
import RootLayout from "./layouts/RootLayout";
import AddNewUser from "./pages/user/AddNewUser";
import ViewUser from "./pages/user/ViewUser";
import UserProfile from "./pages/user/UserProfile";
import UserRols from "./pages/permission/UserRols";
import ViewRoleDetails from "./pages/permission/ViewRoleDetails";
import CreateMenu from "./pages/menu/CreateMenu";
import MenuList from "./pages/menu/MenuList";
import Login from "./pages/authentication/Login";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import PermissionList from "./pages/permissions/PermissionList";

export const router = createBrowserRouter([
  {
    element: (
      <ProtectedRoute authentication>
        <RootLayout>
          <App />
        </RootLayout>
      </ProtectedRoute>
    ),
    path: "/",
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/user/add-user",
        element: <AddNewUser />,
      },
      {
        path: "/user/view-user",
        element: <ViewUser />,
      },
      {
        path: "/user/view-user/:id",
        element: <UserProfile />,
      },
      {
        path: "/role/rols",
        element: <UserRols />,
      },
      {
        path: "/role/rols/:id",
        element: <ViewRoleDetails />,
      },
      {
        path: "/menu/create",
        element: <CreateMenu />,
      },
      {
        path: "/menu/list",
        element: <MenuList />,
      },
      {
        path: "/permission/list",
        element: <PermissionList />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute authentication={false}>
        <Login />
      </ProtectedRoute>
    ),
  },
]);
