import {BrowserRouter, Routes, Route} from "react-router-dom";
import {lazy, Suspense} from "react";
import Loading from "./components/shared/Loading";

const Overview = lazy(() => import("./pages/dashboardPages/adminPages/Overview"));
const CreateUser = lazy(() => import("./pages/dashboardPages/adminPages/CreateUser"));
const AllUsers = lazy(() => import("./pages/dashboardPages/adminPages/AllUsers"));
const UpdateUser = lazy(() => import("./pages/dashboardPages/adminPages/UpdateUser"));
function App() {
  

  return (
    <>
      <BrowserRouter>
      <Suspense fallback={<Loading />}>
          <Routes>
          <Route path="/dashboard/overview" element={<Overview />} />
          <Route path="/dashboard/create-user" element={<CreateUser />} />
          <Route path="/dashboard/all-users" element={<AllUsers />} />
          <Route path="/dashboard/update-user" element={<UpdateUser />} />
        </Routes>
      </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
