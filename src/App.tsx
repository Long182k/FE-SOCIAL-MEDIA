import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import HomePage2 from "./pages/Home/HomePage-copy";

const queryClient = new QueryClient();

interface ProtectedRouterProps {
  component: ReactElement;
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
  axios.defaults.withCredentials = true;

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<ProtectedRouter component={<HomePage />} />}
            />
            <Route path="/z" element={<HomePage2 />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}

export default App;
