import { Button, Space, Table, type TablePaginationConfig } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { 
  // useGroup,
   useGeneral } from "@hooks";
import { PopConfirm, 
  // GroupColumns
 } from "@components";
import { type Branch } from "@types";

import { useEffect, useState } from "react";
import {  useLocation } from "react-router-dom";
import BranchModal from "./branchModalS";
import { useBranch } from "../../hooks/useBranch";

const Branchs = () => {
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState<Branch>();
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
  });
  const location = useLocation();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    if(page && limit){
      setParams(()=>({
        page: Number(page),
        limit: Number(limit)
      }))
    }
   
  }, [location.search]);
  const { data, useBranchDelete } = useBranch(params);
  console.log("data", data);
  
  const { handlePagination } = useGeneral();
  const { mutate: deleteFn, isPending: isDeleting } = useBranchDelete();
  const deleteItem = (id: number) => {
    deleteFn(id);
  };
  // batching
  const editItem = (record: Branch) => {
    setUpdate(record);
    setOpen(true);
  };
  const toggle = () => {
    setOpen(!open);
    if (update) {
      setUpdate(undefined);
    }
  };
  const handleTableChange = (pagination: TablePaginationConfig) => {
    handlePagination({pagination, setParams});
  };
  const columns = [


     {
      name: "id",
      dataIndex: "id",
      key: "id",
    },

         {
      name: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      name: "Call Number",
      dataIndex: "call_number",
      key: "call_number",
    },
    {
      name: "Address",
      dataIndex: "address",
      key: "address",
    }
    
    ,
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Branch) => (
        <Space size="middle">
          <Button type="primary" onClick={() => editItem(record)}>
            <EditOutlined />
          </Button>
          <PopConfirm
            handleDelete={() => deleteItem(record.id!)}
            loading={isDeleting}
          />
          {/* <Link to={`/admin/group/${record.id}`}>view</Link> */}
        </Space>
      ),
    },
  ];

  return (
    <>
      {open && <BranchModal open={open} toggle={toggle} 
      update={update}
      />
      }
      <h1>Branchs</h1>
      <Button type="primary" onClick={() => setOpen(true)}>
        add group
      </Button>
      <Table
        columns={columns as any}
        dataSource={data?.branch}
        rowKey={(row) => row.id!}
        pagination={{
          current: params.page,
          pageSize: params.limit,
          // total: data?.data?.total,
          showSizeChanger: true,
          pageSizeOptions: ["4", "5", "6", "7", "10"],
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default Branchs;
