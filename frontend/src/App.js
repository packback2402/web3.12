import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, Typography } from 'antd';
import { FaGraduationCap } from 'react-icons/fa';
import HomePage from './components/HomePage';
import EditStudent from './components/EditStudent';
import 'antd/dist/reset.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          background: '#1890ff',
          padding: '0 50px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Title level={2} style={{ 
            color: 'white', 
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <FaGraduationCap /> Hệ Thống Quản Lý Học Sinh
          </Title>
        </Header>
        <Content style={{ padding: '24px 50px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/edit/:id" element={<EditStudent />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;