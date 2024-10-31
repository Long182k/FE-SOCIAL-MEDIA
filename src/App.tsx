import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CenterContent from "./containers/CenterLayout/CenterContent";
import HomePage from "./routes/Home";
import LoginPage from "./routes/Login";
import Marketplace from "./routes/Marketplace";
import Explore from "./routes/Explore";
import Groups from "./routes/Groups";
import Bookmarks from "./routes/Bookmarks";
import Messages from "./routes/Messages";
import Notifications from "./routes/Notifications";
import Settings from "./routes/Settings";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const queryClient = new QueryClient();

interface ProtectedRouterProps {
  component: React.ReactElement;
}

const ProtectedRouter = ({ component }: ProtectedRouterProps) => {
  const auth = localStorage.getItem("access_token");

  if (auth) {
    return component;
  } else {
    return <Navigate replace to="/login" />;
  }
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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
                    handleThemeChange={handleThemeChange}
                  />
                }
              />
              <Route
                path="explore"
                element={<Explore isDarkMode={isDarkMode} />}
              />
              <Route
                path="marketplace"
                element={<Marketplace isDarkMode={isDarkMode} />}
              />
              <Route
                path="groups"
                element={<Groups isDarkMode={isDarkMode} />}
              />
              <Route
                path="bookmarks"
                element={<Bookmarks isDarkMode={isDarkMode} />}
              />
              <Route
                path="messages"
                element={<Messages isDarkMode={isDarkMode} />}
              />
              <Route
                path="notifications"
                element={<Notifications isDarkMode={isDarkMode} />}
              />
              <Route
                path="settings"
                element={<Settings isDarkMode={isDarkMode} />}
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
