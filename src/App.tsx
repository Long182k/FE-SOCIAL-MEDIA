import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CenterContent from "./containers/CenterLayout/CenterContent";
import Bookmarks from "./routes/Bookmarks";
import Explore from "./routes/Explore";
import Groups from "./routes/Groups";
import HomePage from "./routes/Home";
import LoginPage from "./routes/Login";
import Messages from "./routes/Messages";
import Notifications from "./routes/Notifications";
import Settings from "./routes/Settings";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useAppStore } from "./store";
import Profile from "./routes/Profile";

const queryClient = new QueryClient();

interface ProtectedRouterProps {
  component: React.ReactElement;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { userInfo } = useAppStore();

  const accessToken =
    localStorage?.getItem("access_token") || userInfo?.accessToken;

  const ProtectedRouter = ({ component }: ProtectedRouterProps) => {
    if (accessToken) {
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
                    // isDarkMode={isDarkMode}
                    // token={accessToken}
                    currentUserId={userInfo?.userId ?? ""}
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
