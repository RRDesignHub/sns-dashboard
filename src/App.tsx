import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { lazy, Suspense, useEffect } from "react";
import { AuthProvider } from "./AuthProvider/AuthProvider";
import { PrivateRoute } from "./routes/PrivateRoute";
import Loading from "./components/shared/Loading";
import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
const queryClient = new QueryClient();
const Home = lazy(() => import("./pages/Home"));

const DashboardLayout = lazy(() => import("./layouts/Dashboard"));

const Overview = lazy(
  () => import("./pages/dashboardPages/adminPages/Overview"),
);
const CreateUser = lazy(
  () => import("./pages/dashboardPages/adminPages/CreateUser"),
);
const AllUsers = lazy(
  () => import("./pages/dashboardPages/adminPages/AllUsers"),
);
const UpdateUser = lazy(
  () => import("./pages/dashboardPages/adminPages/UpdateUser"),
);

const AddTeacher = lazy(
  () => import("./pages/dashboardPages/adminPages/AddTeacher"),
);
const AllTeachers = lazy(
  () => import("./pages/dashboardPages/adminPages/AllTeachers"),
);
function App() {
  useEffect(() => {
    // Remove preload class after mount
    document.body.classList.remove("preload");

    setTimeout(() => {
      document.body.classList.add("loaded");
    }, 100);
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Home />} />

                {/* login page */}
                <Route path="/login" element={<Login />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <DashboardLayout />
                    </PrivateRoute>
                  }
                >
                  {/* Admin Routes */}
                  <Route path="overview" element={<Overview />} />

                  {/* User Management */}
                  <Route path="create-user" element={<CreateUser />} />
                  <Route path="all-users" element={<AllUsers />} />
                  <Route path="update-user/:id" element={<UpdateUser />} />
                  {/* teachers management */}
                  <Route path="add-teacher" element={<AddTeacher />} />
                  <Route path="all-teachers" element={<AllTeachers />} />
                  {/* School and exam Management */}
                </Route>
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
