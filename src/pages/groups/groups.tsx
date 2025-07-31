import {
  Button,
  Space,
  Table,
  type TablePaginationConfig,
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Empty,
  Tooltip,
  Tag,
  Input,
  Divider,
  Badge,
  message,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  TeamOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  UsergroupAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useGroup, useGeneral } from "@hooks";
import { GroupColumns } from "@components";
import { type Group } from "@types";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GroupModal from "./modal";

const { Title, Text } = Typography;
const { Search } = Input;

const Groups = () => {
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState<Group | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");

    if (page && limit) {
      setParams(() => ({
        page: Number(page),
        limit: Number(limit),
        search: search || "",
      }));
    }
  }, [location.search]);

  const { data, useGroupDelete } = useGroup(params);
  const { handlePagination } = useGeneral();
  const { mutate: deleteFn, isPending: isDeleting } = useGroupDelete();

  const deleteItem = (id: number) => {
    deleteFn(id, {
      onSuccess: () => {
        message.success({
          content: "Group deleted successfully!",
          duration: 3,
        });
      },
      onError: () => {
        message.error("Failed to delete group. Please try again.");
      },
    });
  };

  const editItem = (record: Group) => {
    setUpdate(record);
    setOpen(true);
  };

  const toggle = () => {
    setOpen(!open);
    if (update) {
      setUpdate(null);
    }
  };

  const setParamsWrapper = (params: any) => {
    setParams((prev) => ({
      ...prev,
      ...params,
      search: params.search ?? prev.search,
    }));
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    handlePagination({ pagination, setParams: setParamsWrapper });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setParams((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const handleRefresh = () => {
    setLoading(true);
    // refetch();
    setTimeout(() => {
      setLoading(false);
      message.success("Data refreshed successfully!");
    }, 500);
  };

  const getGroupTypeTag = (type: string) => {
    const typeColors: { [key: string]: string } = {
      admin: "red",
      teacher: "blue",
      student: "green",
      staff: "orange",
      parent: "purple",
    };
    return (
      <Tag color={typeColors[type?.toLowerCase()] || "default"}>
        {type?.toUpperCase() || "UNKNOWN"}
      </Tag>
    );
  };

  const enhancedColumns = [
    {
      title: "Group ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id: number) => (
        <Badge
          count={id}
          style={{ backgroundColor: "#f0f0f0", color: "#595959" }}
        />
      ),
    },
    ...(GroupColumns?.map((col) => ({
      ...col,
      render:
        col.render ||
        ((text: any) => {
          // Type guard to ensure col is ColumnType<Group>
          if ("dataIndex" in col) {
            if (col.dataIndex === "name") {
              return (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <TeamOutlined style={{ color: "#1890ff" }} />
                  <Text strong>{text}</Text>
                </div>
              );
            }
            if (col.dataIndex === "type") {
              return getGroupTypeTag(text);
            }
            if (
              col.dataIndex === "members_count" ||
              col.dataIndex === "memberCount"
            ) {
              return (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <UsergroupAddOutlined style={{ color: "#52c41a" }} />
                  <Text>{text || 0} members</Text>
                </div>
              );
            }
          }
          return text;
        }),
    })) ?? []),
    {
      title: "Actions",
      key: "action",
      width: 200,
      render: (_: any, record: Group) => (
        <Space size="small">
          <Tooltip title="Edit Group"></Tooltip>

          <Tooltip title="View Details">
            <Link to={`/admin/group/${record.id}`}>
              <Button
                type="text"
                icon={<EyeOutlined />}
                size="middle"
                style={{ color: '#1890ff' }}
              ></Button>
            </Link>
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => editItem(record)}
              style={{ color: "#52c41a" }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => deleteItem(record.id!)}
              loading={isDeleting}
              style={{ color: "#f5222d" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const totalGroups = data?.data?.total || 0;
  const totalMembers =
    data?.data?.data?.reduce(
      (sum: number, group: Group) => sum + (group.courseId || group.id || 0),
      0
    ) || 0;
  const activeGroups =
    data?.data?.data?.filter((group: Group) => group.status === "active")
      ?.length || 0;

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "none",
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <Title level={2} style={{ margin: 0, color: "#262626" }}>
                <TeamOutlined
                  style={{ marginRight: "8px", color: "#1890ff" }}
                />
                Group Management
              </Title>
              <Text type="secondary">
                Organize and manage user groups efficiently
              </Text>
            </div>

            <Space wrap>
              <Tooltip title="Refresh Data">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={loading}
                  style={{ borderRadius: "8px" }}
                />
              </Tooltip>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setOpen(true)}
                size="large"
                style={{
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(24, 144, 255, 0.3)",
                }}
              >
                Add Group
              </Button>
            </Space>
          </div>

          {/* Statistics Row */}
          <Row gutter={16} style={{ marginBottom: "20px" }}>
            <Col xs={24} sm={8}>
              <Card
                size="small"
                style={{ textAlign: "center", borderRadius: "8px" }}
              >
                <Statistic
                  title="Total Groups"
                  value={totalGroups}
                  prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                size="small"
                style={{ textAlign: "center", borderRadius: "8px" }}
              >
                <Statistic
                  title="Total Members"
                  value={totalMembers}
                  prefix={<UsergroupAddOutlined style={{ color: "#52c41a" }} />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                size="small"
                style={{ textAlign: "center", borderRadius: "8px" }}
              >
                <Statistic
                  title="Active Groups"
                  value={activeGroups}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Search Bar */}
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Search groups by name..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                onChange={(e) => {
                  if (!e.target.value) {
                    handleSearch("");
                  }
                }}
                style={{ borderRadius: "8px" }}
              />
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Table Section */}
        {(!data?.data?.data || data.data.data.length === 0) && !loading ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text type="secondary">
                  {searchText
                    ? "No groups found matching your search"
                    : "No groups found"}
                </Text>
                <br />
                {!searchText && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setOpen(true)}
                    style={{ marginTop: "12px", borderRadius: "6px" }}
                  >
                    Create Your First Group
                  </Button>
                )}
              </div>
            }
            style={{ margin: "40px 0" }}
          />
        ) : (
          <Table<Group>
            columns={enhancedColumns}
            dataSource={data?.data?.data}
            rowKey={(row) => row.id!}
            loading={loading}
            pagination={{
              current: params.page,
              pageSize: params.limit,
              total: data?.data?.total,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} groups`,
              style: { marginTop: "16px" },
            }}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
            rowClassName={(index: any) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
          />
        )}

        {/* Group Modal */}
        {open && (
          <GroupModal open={open} toggle={toggle} update={update as any} />
        )}
      </Card>

      <style>{`
        .table-row-light {
          background-color: #fafafa;
        }
        .table-row-dark {
          background-color: #ffffff;
        }
        .ant-table-thead > tr > th {
          background: #f8f9fa !important;
          font-weight: 600 !important;
          border-bottom: 2px solid #e8e8e8 !important;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f0f0f0 !important;
        }
        .ant-table-tbody > tr:hover > td {
          background: #e6f7ff !important;
        }
        .ant-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default Groups;
