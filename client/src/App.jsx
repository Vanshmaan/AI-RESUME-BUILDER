import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import api from "./configs/api";
import { login, setLoading } from "./app/features/authSlice";
import Loader from "./components/Loader";

const Home = lazy(() => import("./pages/Home"));
const Layout = lazy(() => import("./pages/Layout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder"));
const Preview = lazy(() => import("./pages/Preview"));

const App = () => {
  const dispatch = useDispatch();

  const getUserData = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        const { data } = await api.get("/api/users/data", {
          headers: { Authorization: token },
        });

        if (data.user) {
          dispatch(
            login({
              token,
              refreshToken: localStorage.getItem("refreshToken"),
              user: data.user,
            })
          );
        }
      }
    } catch {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await api.post("/api/users/refresh", { refreshToken });
          if (data.token) {
            localStorage.setItem("token", data.token);
            const userRes = await api.get("/api/users/data", {
              headers: { Authorization: data.token },
            });
            dispatch(login({ ...data, user: userRes.data.user }));
          }
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "text-sm font-medium",
          style: {
            background: "rgba(15, 23, 42, 0.95)",
            color: "#f8fafc",
            borderRadius: "12px",
            backdropFilter: "blur(8px)",
          },
        }}
      />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="builder/:resumeId" element={<ResumeBuilder />} />
          </Route>
          <Route path="/view/:resumeId" element={<Preview />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
