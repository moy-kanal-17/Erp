import { Link, useParams } from "react-router-dom";
import { useGroup } from "@hooks";
import { Button, Table } from "antd";

const SingleGroup = () => {
  const { id } = useParams<{ id: string }>();
  const data = useGroup({ page: 4, limit: 2 }, Number(id)).useGroupByid(
    { page: 1, limit: 10 },
    Number(id)
  );

  const students = data?.data?.group?.students || [];

  const columns = [
    {
      title: "Ism",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Familiya",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  return (
    <div>
      <h1>Single group</h1>
      <h2>ID: {id}</h2>
      <h2>Nomi: {data?.data?.group?.name}</h2>

      <Table
        dataSource={students}
        columns={columns}
        rowKey="id"
        pagination={false}
      />

      <Link to="/admin/groups">
        <Button type="primary" style={{ marginTop: "16px" }}>
          Orqaga
        </Button>
      </Link>
    </div>
  );
};

export default SingleGroup;
