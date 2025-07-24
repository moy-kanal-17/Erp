import { useEffect, useState } from "react";
import { lessonService } from "@service";
import GroupLessons from "../lessons/lessons";
import { Card, Typography, Spin, Anchor, Space } from "antd";
import { ScheduleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
// const { Link: AnchorLink } = Anchor;

const GroupPage = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = { page: 1, limit: 100 };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await lessonService.lessons(params);
        setLessons(response || []);
      } catch (error) {
        console.error("Failed to fetch lessons", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Yuklanmoqda..." />
      </div>
    );
  }

  return (
    <div className="p-6 relative">
      <Anchor
        offsetTop={80}
        className="absolute left-0 top-10"
        items={[
          { key: "group-lessons", href: "#group-lessons", title: "📚 Darslar" },
          { key: "back", href: "#back", title: "⬅️ Orqaga" },
        ]}
      />

      <Card className="mb-6" bordered={false}>
        <Space direction="vertical">
          <Title level={2} className="flex items-center gap-2">
            <ScheduleOutlined /> Group Lessons
          </Title>
          <Text type="secondary">Ushbu sahifada barcha guruhga tegishli darslar ko’rsatiladi.</Text>
        </Space>
      </Card>

      <div id="group-lessons">
        <Card title="📖 Darslar ro'yxati" bordered>
          <GroupLessons lessons={lessons} />
        </Card>
      </div>

      <div id="back" className="mt-6">
        <Link to="/admin/groups">
          <Space>
            <ArrowLeftOutlined />
            <Text strong>Orqaga qaytish</Text>
          </Space>
        </Link>
      </div>
    </div>
  );
};

export default GroupPage;
