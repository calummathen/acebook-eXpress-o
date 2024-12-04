import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import { UserProfilePage, loader as UserProfilePageLoader } from "./pages/UserProfilePage/UserProfilePage";
import { ConfirmProvider } from "material-ui-confirm";

// docs: https://reactrouter.com/en/main/start/overview
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/posts",
    element: <FeedPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/profile/:username",
    element: <UserProfilePage />,
    loader: UserProfilePageLoader
  }
]);

function App() {
  return (
    <>
      <ConfirmProvider>
        <RouterProvider router={router} />
      </ConfirmProvider>
    </>
  );
}

export default App;
