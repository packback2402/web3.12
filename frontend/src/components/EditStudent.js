import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Space, Spin, message } from 'antd';
import { FaSave, FaArrowLeft, FaEdit } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/students';

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(true);

  // Lấy thông tin học sinh hiện tại
  useEffect(() => {
    axios.get(`${API_URL}/${id}`)
      .then(res => {
        form.setFieldsValue({
          name: res.data.name,
          age: res.data.age,
          class: res.data.class
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        message.error("Không tìm thấy học sinh!");
        navigate("/");
      });
  }, [id, navigate, form]);

  // Xử lý cập nhật
  const handleUpdate = (values) => {
    const studentData = {
      name: values.name,
      age: Number(values.age),
      class: values.class
    };
    
    axios.put(`${API_URL}/${id}`, studentData)
      .then(res => {
        console.log("Đã cập nhật:", res.data);
        message.success("Cập nhật thông tin học sinh thành công!");
        navigate("/");
      })
      .catch(err => {
        console.error("Lỗi khi cập nhật:", err);
        message.error("Lỗi khi cập nhật học sinh!");
      });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: 600, margin: '0 auto' }}>
      <Card 
        title={
          <span>
            <FaEdit style={{ marginRight: 8 }} />
            Chỉnh Sửa Thông Tin Học Sinh
          </span>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input placeholder="Họ và tên" size="large" />
          </Form.Item>

          <Form.Item
            label="Tuổi"
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
          >
            <Input type="number" placeholder="Tuổi" size="large" min={1} max={100} />
          </Form.Item>

          <Form.Item
            label="Lớp"
            name="class"
            rules={[{ required: true, message: 'Vui lòng nhập lớp!' }]}
          >
            <Input placeholder="Lớp (VD: 10A1)" size="large" />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                icon={<FaArrowLeft />}
                onClick={() => navigate("/")}
              >
                Quay Lại
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                icon={<FaSave />}
              >
                Lưu Thay Đổi
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default EditStudent;