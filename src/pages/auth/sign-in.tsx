import { useState } from "react";
import { useAuth } from "@hooks";
import { useNavigate } from "react-router-dom";
import { setItem } from "@helpers";
import { Button, Input, Select, Typography, Card, Space } from "antd";

const { Option } = Select;
const { Title } = Typography;

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // default value
  const navigate = useNavigate();
  const { mutate, isPending } = useAuth();

  const submit = () => {
    const payload = { email, password };
    mutate(
      { data: payload, role },
      {
        onSuccess: (res: any) => {
          if (res.status === 201) {
            setItem('access_token', res.data.access_token);
            setItem('role', role);
            navigate(`/${role}`);
          }
        },
      }
    );
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #3b82f6 0%, #0f172a 100%)",
      padding: "16px"
    }}>
      <Card
        style={{ width: 400, borderRadius: 12 }}
        bodyStyle={{ padding: 24, background: "#fff", borderRadius: 12 }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Title level={3} style={{ textAlign: "center" }}>Tizimga kirish</Title>

          <Input
            size="large"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email manzilingiz"
          />

          <Input.Password
            size="large"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parolingiz"
          />

          <Select
            size="large"
            defaultValue="admin"
            value={role}
            onChange={(value) => setRole(value)}
            style={{ width: "100%" }}
          >
            <Option value="teacher">O‘qituvchi</Option>
            <Option value="student">Talaba</Option>
            <Option value="admin">Admin</Option>
            <Option value="lid">Lid</Option>
          </Select>

          <Button
            type="primary"
            size="large"
            block
            onClick={submit}
            loading={isPending}
          >
            Kirish
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default SignIn;
