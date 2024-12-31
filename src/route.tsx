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
import LocationList from "@/pages/location/LocationList";
import Profile from "@/pages/profile/Profile";
import UserLayout from "./layouts/UserLayout";
import RoleLayout from "./layouts/RoleLayout";
import Menulayout from "./layouts/Menulayout";
import LocationLayout from "./layouts/LocationLayout";
import PermissionLayout from "./layouts/PermissionLayout";
import AllotLocationPage from "./pages/location/AllotLocationPage";
import Notification from "./pages/Notification/Notification";
import NotificationsLayout from "@/layouts/NotificationsLayout";
import PasswordRecoveryPage from "@/pages/authentication/PasswordRecoveryPage";

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
        element: (
          <UserLayout>
            <AddNewUser />
          </UserLayout>
        ),
      },
      {
        path: "/user/view-user",
        element: (
          <UserLayout>
            <ViewUser />
          </UserLayout>
        ),
      },
      {
        path: "/user/view-user/:id",
        element: <UserProfile />,
      },
      {
        path: "/role/list",
        element: (
          <RoleLayout>
            <UserRols />
          </RoleLayout>
        ),
      },
      {
        path: "/role/view-role/:id",
        element: <ViewRoleDetails />,
      },
      {
        path: "/menu/create",
        element: (
          <Menulayout>
            <CreateMenu />
          </Menulayout>
        ),
      },
      {
        path: "/menu/list",
        element: (
          <Menulayout>
            <MenuList />
          </Menulayout>
        ),
      },
      {
        path: "/location/list",
        element: (
          <LocationLayout>
            <LocationList />
          </LocationLayout>
        ),
      },
      {
        path: "/location/alloted-location",
        element: (
          <LocationLayout>
            <AllotLocationPage />
          </LocationLayout>
        ),
      },
      {
        path: "/permission/list",
        element: (
          <PermissionLayout>
            <PermissionList />
          </PermissionLayout>
        ),
      },
      {
        path: "/notification",
        element: (
          <NotificationsLayout>
            <Notification />
          </NotificationsLayout>
        ),
      },
      {
        path: "/profile",
        element: <Profile />,
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
  {
    path: "/forgot-password",
    element: (
      <ProtectedRoute authentication={false}>
        <PasswordRecoveryPage />
      </ProtectedRoute>
    ),
  },
]);
