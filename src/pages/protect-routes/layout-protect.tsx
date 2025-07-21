import { getItem } from "@helpers"
import { type ProtectedRoute } from "@types";
import { Navigate } from "react-router-dom";
const LayoutProtect = ({children}:ProtectedRoute) => {
    const isAuthenticated = getItem("access_token");
    if(!isAuthenticated) {
        return <Navigate to="/" replace />
    }
    return (
        <>
        {children}
        </>
    )
  
}

export default LayoutProtect
