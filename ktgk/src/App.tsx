import React from "react";
import { Layout } from "antd";
import EmployeeList from "./pages/EmployeeList";

const { Header, Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#1890ff", color: "#fff", fontSize: "20px", textAlign: "center" }}>
        Quản lý Nhân Viên
      </Header>
      <Content style={{ padding: "20px" }}>
        <EmployeeList />
      </Content>
    </Layout>
  );
};

export default App;
