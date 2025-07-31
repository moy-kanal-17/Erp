
export function getItem(key: string) {
  return localStorage.getItem(key);
}

export function setItem(key: string, value: string){
    localStorage.setItem(key, value)
}

export function removeItem(key:string){
    localStorage.removeItem(key)
}

export function clearStorage(){
  localStorage.clear();
}

// helpers/auth.ts
import {jwtDecode} from "jwt-decode";


export const getUserIdFromToken = (): number | null => {
  try {
    const token = getItem("access_token");
    if (!token) return null;
    const decoded: { id: number,role:string } = jwtDecode(token);
    console.log("Decoded token:", decoded.id,decoded.role);
    console.log("decoded", decoded);
    
    
    return decoded.id;
  } catch (err) {
    console.error("Token decode error", err);
    return null;
  }  
};


  export const getUserRoleFromToken = (): string | null => {
  try {
    const token = getItem("access_token");
    if (!token) return null;
    const decoded: { id: number,role:string } = jwtDecode(token);
    console.log("Decoded token:", decoded.id,decoded.role);
    console.log("decoded", decoded);
    
    
    return decoded.role;
  } catch (err) {
    console.error("Token decode error", err);
    return null;
  }
  }