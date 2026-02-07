import {BrowserRouter, Routes, Route} from "react-router-dom";
import {lazy, Suspense, useEffect} from "react";
import Loading from "./components/shared/Loading";

const Overview = lazy(() => import("./pages/dashboardPages/adminPages/Overview"));
const CreateUser = lazy(() => import("./pages/dashboardPages/adminPages/CreateUser"));
const AllUsers = lazy(() => import("./pages/dashboardPages/adminPages/AllUsers"));
const UpdateUser = lazy(() => import("./pages/dashboardPages/adminPages/UpdateUser"));
function App() {
 

// In your component
useEffect(() => {
  // Remove preload class after mount
  document.body.classList.remove('preload');
  
  // Or add loaded class
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
}, []);

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
