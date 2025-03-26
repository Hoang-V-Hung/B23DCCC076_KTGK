import { useState } from "react";
import { Modal, Form, Input, Select, InputNumber, Button } from "antd";
import { Employee } from "../models/Employee";

const { Option } = Select;

interface EmployeeFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  initialData?: Employee;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ visible, onClose, onSave, initialData }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave({ ...values, id: initialData?.id || Date.now().toString() });
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title={initialData ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} initialValues={initialData || { status: "Thử việc" }} layout="vertical">
        <Form.Item name="ten" label="Họ tên" rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}>
          <Input maxLength={50} />
        </Form.Item>
        <Form.Item name="chuc_vu" label="Chức vụ" rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}>
          <Select>
            <Option value="Manager">Manager</Option>
            <Option value="Staff">Staff</Option>
          </Select>
        </Form.Item>
        <Form.Item name="phong_ban" label="Phòng ban" rules={[{ required: true, message: "Vui lòng chọn phòng ban!" }]}>
          <Select>
            <Option value="HR">HR</Option>
            <Option value="IT">IT</Option>
          </Select>
        </Form.Item>
        <Form.Item name="luong" label="Lương" rules={[{ required: true, message: "Vui lòng nhập lương!" }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="trang_thai" label="Trạng thái">
          <Select>
            <Option value="Đã ký hợp đồng">Đã ký hợp đồng</Option>
            <Option value="Thử việc">Thử việc</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeForm;
