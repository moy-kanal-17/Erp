import { Button, Space, Table, type TablePaginationConfig } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useGroup, useGeneral } from "@hooks";
import { PopConfirm, GroupColumns } from "@components";
import { type Group } from "@types";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GroupModal from "./modal";

const Branchs = () => {
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState<Group>();
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
  const { data, useGroupDelete } = useGroup(params);
  const { handlePagination } = useGeneral();
  const { mutate: deleteFn, isPending: isDeleting } = useGroupDelete();
  const deleteItem = (id: number) => {
    deleteFn(id);
  };
  // batching
  const editItem = (record: Group) => {
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
    ...(GroupColumns ?? []),
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Group) => (
        <Space size="middle">
          <Button type="primary" onClick={() => editItem(record)}>
            <EditOutlined />
          </Button>
          <PopConfirm
            handleDelete={() => deleteItem(record.id!)}
            loading={isDeleting}
          />
          <Link to={`/admin/group/${record.id}`}>view</Link>
        </Space>
      ),
    },
  ];

  return (
    <>
      {open && <GroupModal open={open} toggle={toggle} 
      update={update}
      />
      }
      <h1>Branchs</h1>
      <Button type="primary" onClick={() => setOpen(true)}>
        add group
      </Button>
      <Table<Group>
        columns={columns}
        dataSource={data?.data.data}
        rowKey={(row) => row.id!}
        pagination={{
          current: params.page,
          pageSize: params.limit,
          total: data?.data?.total,
          showSizeChanger: true,
          pageSizeOptions: ["4", "5", "6", "7", "10"],
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default Branchs;
