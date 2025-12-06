import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Form, Space, Card, message, Modal } from 'antd';
import { FaUserPlus, FaEdit, FaTrash, FaSearch, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/students';

function HomePage() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [form] = Form.useForm();
  
  const navigate = useNavigate();

  // Fetch danh sách học sinh khi component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get(API_URL)
      .then(response => setStudents(response.data))
      .catch(error => console.error("Lỗi khi fetch danh sách:", error));
  };

  // Xử lý thêm học sinh mới
  const handleAddStudent = (values) => {
    const studentData = {
      name: values.name,
      age: Number(values.age),
      class: values.class
    };
    
    axios.post(API_URL, studentData)
      .then(res => {
        console.log("Đã thêm:", res.data);
        setStudents(prev => [...prev, res.data]);
        form.resetFields();
        message.success("Thêm học sinh thành công!");
      })
      .catch(err => {
        console.error("Lỗi khi thêm:", err);
        message.error("Lỗi khi thêm học sinh!");
      });
  };

  // Xử lý xóa học sinh
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa học sinh này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk() {
        axios.delete(`${API_URL}/${id}`)
          .then(res => {
            console.log(res.data.message);
            setStudents(prevList => prevList.filter(s => s._id !== id));
            message.success("Đã xóa học sinh thành công!");
          })
          .catch(err => {
            console.error("Lỗi khi xóa:", err);
            message.error("Lỗi khi xóa học sinh!");
          });
      }
    });
  };

  // Lọc danh sách theo từ khóa tìm kiếm
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sắp xếp danh sách
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return sortAsc ? -1 : 1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return sortAsc ? 1 : -1;
    return 0;
  });

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Tuổi',
      dataIndex: 'age',
      key: 'age',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Lớp',
      dataIndex: 'class',
      key: 'class',
      width: 120,
      align: 'center',
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary"
            icon={<FaEdit />}
            onClick={() => navigate(`/edit/${record._id}`)}
          >
            Sửa
          </Button>
          <Button 
            danger
            icon={<FaTrash />}
            onClick={() => handleDelete(record._id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title={
          <span>
            <FaUserPlus style={{ marginRight: 8 }} />
            Thêm Học Sinh Mới
          </span>
        }
        style={{ marginBottom: 24 }}
      >
        <Form
          form={form}
          layout="inline"
          onFinish={handleAddStudent}
          style={{ gap: 16 }}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Họ và tên" />
          </Form.Item>
          <Form.Item
            name="age"
            rules={[
              { required: true, message: 'Vui lòng nhập tuổi!' },
              { 
                validator: (_, value) => {
                  const age = Number(value);
                  if (!value) return Promise.reject();
                  if (age < 1 || age > 100) return Promise.reject('Tuổi từ 1-100!');
                  return Promise.resolve();
                }
              }
            ]}
            style={{ width: 120 }}
          >
            <Input type="number" placeholder="Tuổi" min={1} max={100} />
          </Form.Item>
          <Form.Item
            name="class"
            rules={[{ required: true, message: 'Vui lòng nhập lớp!' }]}
            style={{ width: 150 }}
          >
            <Input placeholder="Lớp (VD: 10A1)" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<FaUserPlus />}>
              Thêm Học Sinh
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Input
              placeholder="Tìm kiếm theo tên..."
              prefix={<FaSearch />}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <Button 
              icon={sortAsc ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
              onClick={() => setSortAsc(prev => !prev)}
            >
              Sắp xếp: {sortAsc ? 'A → Z' : 'Z → A'}
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={sortedStudents}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} học sinh`
            }}
            locale={{
              emptyText: searchTerm ? "Không tìm thấy học sinh nào!" : "Chưa có học sinh nào. Hãy thêm học sinh mới!"
            }}
          />
        </Space>
      </Card>
    </div>
  );
}

export default HomePage;