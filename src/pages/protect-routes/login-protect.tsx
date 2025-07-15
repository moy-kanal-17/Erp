import { getItem } from "@helpers"
import { type ProtectedRoute } from "@types";
import { Navigate } from "react-router-dom";
const LoginProtect = ({children}:ProtectedRoute) => {
  const isAuthenticated = getItem("access_token");
  const role = getItem("role");
  if(isAuthenticated){
    return <Navigate to={`/${role}`} replace />
  }
  return (
    <>
      {children}
    </>
  )
}

export default LoginProtect
