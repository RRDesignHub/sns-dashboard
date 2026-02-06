import { FaUsersGear } from "react-icons/fa6"
import { IoMdPersonAdd } from "react-icons/io"
import { MdDashboard } from "react-icons/md"
import { TiUserAdd } from "react-icons/ti"
import { NavLink } from "react-router-dom"

const SidebarNav = () => {
  return (
    
    <>
    <div>
        <img src="/logo.png" alt="SNS_logo" />
        <h2>Dashboard</h2>
    </div>
    <ul>
      <li>
        <NavLink
        to="/dashboard/overview"
        
      >
        <MdDashboard />
        ডেসবোর্ড
      </NavLink>
      </li>
       <li>
         <NavLink
        to="/dashboard/create-user"
       
      >
        <IoMdPersonAdd className="w-5 h-5" />
        Create User
      </NavLink>
      </li>
       <li>
       <NavLink
        to="/dashboard/all-user"
        
      >
        <FaUsersGear className="w-5 h-5" />
        All User
      </NavLink>

      </li>
       <li>
       <NavLink
        to="/dashboard/add-teacher"
       
      >
        <TiUserAdd className="w-5 h-5" />
        শিক্ষক/শিক্ষিকা যোগ
      </NavLink>
      </li>
    </ul>
    </>
    
  )
}

export default SidebarNav
