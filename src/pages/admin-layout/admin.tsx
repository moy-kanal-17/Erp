import { Outlet } from "react-router-dom"

const Admin = () => {
  return (
    <div>
      <h1>Admin layout</h1>
      {/* sidebar */}
      <Outlet/>
    </div>
  )
}

export default Admin
