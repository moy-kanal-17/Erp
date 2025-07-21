import {type PaginationConfig } from "@types"
import { useNavigate } from "react-router-dom";
export const useGeneral =()=>{

    // HANDLE PAGINATION
    const navigate = useNavigate();
    const handlePagination = ({pagination, setParams}: PaginationConfig)=>{
        const { current, pageSize } = pagination;
        setParams({
            page: current!,
            limit: pageSize!,
        });
        const searchParams = new URLSearchParams();
        searchParams.set("page", current!.toString());
        searchParams.set("limit", pageSize!.toString());
        navigate({search: `?${searchParams.toString()}`});
    }

    
    // RETURN THE FUNCTION
    return {
        handlePagination
    }

}