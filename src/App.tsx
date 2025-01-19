import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CenterContent from "./containers/CenterLayout/CenterContent";
import Bookmarks from "./routes/User/Bookmarks";
import Explore from "./routes/User/Explore";
import Groups from "./routes/User/Groups";
import HomePage from "./routes/User/Home";
import LoginPage from "./routes/User/Login";
import Messages from "./routes/User/Messages";
import Notifications from "./routes/User/Notifications";
import Settings from "./routes/User/Settings";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Dashboard from "./routes/Admin/Dashboard";
import UserManagement from "./routes/Admin/User Management";
import Profile from "./routes/User/Profile";
import { useAppStore } from "./store";
import GroupManagement from "./routes/Admin/Group Management";
import EventManagement from "./routes/Admin/Event Management";

const queryClient = new QueryClient();

interface ProtectedRouterProps {
  component: React.ReactElement;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { userInfo } = useAppStore();
  console.log("🚀  userInfo:", userInfo);

  const accessToken =
    localStorage?.getItem("access_token") || userInfo?.accessToken;

  const ProtectedRouter = ({ component }: ProtectedRouterProps) => {
    if (accessToken) {
      return component;
    } else {
      return <Navigate replace to="/login" />;
    }
  };

  const ProtectedAdminRoute = ({ component }: ProtectedRouterProps) => {
    if (accessToken && userInfo?.role === "ADMIN") {
      return component;
    } else {
      return <Navigate replace to="/login" />;
    }
  };

  const handleThemeChange = (
    checked: boolean | ((prevState: boolean) => boolean)
  ) => {
    setIsDarkMode(checked);
    document.body.style.backgroundColor = checked ? "#141414" : "#ffffff";
    document.body.style.color = checked ? "#ffffff" : "#000000";
  };
  axios.defaults.withCredentials = true;

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Wrap protected routes inside Layout */}
            <Route
              path="/"
              element={
                <ProtectedRouter
                  component={<HomePage isDarkMode={isDarkMode} />}
                />
              }
            >
              <Route
                index
                element={
                  <CenterContent
                    isDarkMode={isDarkMode}
                    currentUserId={userInfo?.userId ?? userInfo?.id}
                    userAvatar={userInfo?.avatarUrl ?? ""}
                  />
                }
              />
              <Route
                path="explore/*"
                element={<Explore isDarkMode={isDarkMode} />}
              />
              <Route
                path="groups/*"
                element={<Groups isDarkMode={isDarkMode} />}
              />
              <Route
                path="bookmarks"
                element={<Bookmarks isDarkMode={isDarkMode} />}
              />
              <Route
                path="messages"
                element={
                  <Messages
                    isDarkMode={isDarkMode}
                    // token={accessToken}
                    currentUserId={userInfo?.userId ?? userInfo?.id}
                  />
                }
              />
              <Route
                path="notifications"
                element={<Notifications isDarkMode={isDarkMode} />}
              />
              <Route
                path="profile"
                element={<Profile isDarkMode={isDarkMode} />}
              />
              <Route
                path="settings"
                element={
                  <Settings
                    isDarkMode={isDarkMode}
                    handleThemeChange={handleThemeChange}
                  />
                }
              />

              {/* Admin routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedAdminRoute
                    component={<Dashboard isDarkMode={isDarkMode} />}
                  />
                }
              />
              <Route
                path="/user-management"
                element={
                  <ProtectedAdminRoute
                    component={<UserManagement isDarkMode={isDarkMode} />}
                  />
                }
              />
              <Route
                path="/event-management"
                element={
                  <ProtectedAdminRoute
                    component={<EventManagement isDarkMode={isDarkMode} />}
                  />
                }
              />
              <Route
                path="/group-management"
                element={
                  <ProtectedAdminRoute
                    component={<GroupManagement isDarkMode={isDarkMode} />}
                  />
                }
              />
            </Route>

            {/* Other routes outside layout */}
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}

export default App;
