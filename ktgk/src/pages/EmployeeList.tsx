import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, InputNumber, message } from "antd";
import { Employee } from "../models/Employee";
import { useEmployeeModel } from "../models/employeeModel";

const { Option } = Select;

const EmployeeList: React.FC = () => {
    const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployeeModel();
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");
    const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        setFilteredEmployees(employees);
    }, [employees]);

    useEffect(() => {
        let filteredData = employees;
        if (searchText) {
            filteredData = filteredData.filter(
                (emp) => emp.id.includes(searchText) || emp.ten.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        if (selectedPosition) {
            filteredData = filteredData.filter((emp) => emp.chuc_vu === selectedPosition);
        }
        if (selectedDepartment) {
            filteredData = filteredData.filter((emp) => emp.phong_ban === selectedDepartment);
        }
        setFilteredEmployees(filteredData);
    }, [searchText, selectedPosition, selectedDepartment, employees]);

    const handleAddEmployee = () => {
        form.validateFields().then((values) => {
            if (editingEmployee) {
                const updatedEmployee = { ...editingEmployee, ...values };
                updateEmployee(updatedEmployee);
                message.success("Cập nhật nhân viên thành công!");
            } else {
                const newEmployee: Employee = { id: Date.now().toString(), ...values };
                addEmployee(newEmployee);
                message.success("Thêm nhân viên thành công!");
            }
            setIsModalOpen(false);
            form.resetFields();
            setEditingEmployee(null);
        }).catch((error) => console.error("Lỗi validate:", error));
    };

    const handleDeleteEmployee = (id: string, trang_thai: string) => {
        if (!deleteEmployee(id, trang_thai)) {
            message.warning("Không thể xóa nhân viên đã ký hợp đồng!");
            return;
        }
        message.success("Đã xóa nhân viên thành công!");
    };

    const handleEditEmployee = (employee: Employee) => {
        setEditingEmployee(employee);
        form.setFieldsValue(employee);
        setIsModalOpen(true);
    };

    const columns = [
        { title: "Mã NV", dataIndex: "id", key: "id" },
        { title: "Họ Tên", dataIndex: "ten", key: "ten" },
        { title: "Chức vụ", dataIndex: "chuc_vu", key: "chuc_vu" },
        { title: "Phòng Ban", dataIndex: "phong_ban", key: "phong_ban" },
        { title: "Lương", dataIndex: "luong", key: "luong", sorter: (a: Employee, b: Employee) => b.luong - a.luong },
        { title: "Trạng thái", dataIndex: "trang_thai", key: "trang_thai" },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: Employee) => (
                <>
                    <Button onClick={() => handleEditEmployee(record)} style={{ marginRight: 8 }}>✏️ Sửa</Button>
                    <Button danger onClick={() => handleDeleteEmployee(record.id, record.trang_thai)}>🗑️ Xóa</Button>
                </>
            ),
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: "flex", gap: 10 }}>
                <Input placeholder="Tìm theo mã NV hoặc tên..." onChange={(e) => setSearchText(e.target.value)} style={{ width: 250 }} />
                <Select placeholder="Lọc theo chức vụ" onChange={(value) => setSelectedPosition(value)} allowClear style={{ width: 180 }}>
                    <Option value="Nhân viên">Nhân viên</Option>
                    <Option value="Quản lý">Quản lý</Option>
                </Select>
                <Select placeholder="Lọc theo phòng ban" onChange={(value) => setSelectedDepartment(value)} allowClear style={{ width: 180 }}>
                    <Option value="Hành chính">Hành chính</Option>
                    <Option value="Kinh doanh">Kinh doanh</Option>
                    <Option value="Công nghệ">Công nghệ</Option>
                    <Option value="Nhân sự">Nhân sự</Option>
                </Select>
            </div>

            <Button type="primary" onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }} style={{ marginBottom: 20 }}>
                Thêm Nhân Viên
            </Button>

            <Table dataSource={filteredEmployees} columns={columns} rowKey="id" />

            <Modal
                title={editingEmployee ? "Chỉnh sửa Nhân Viên" : "Thêm Nhân Viên"}
                open={isModalOpen}
                onOk={handleAddEmployee}
                onCancel={() => { setIsModalOpen(false); form.resetFields(); setEditingEmployee(null); }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="ten" label="Họ tên" rules={[
                        { required: true, message: "Vui lòng nhập họ tên!" },
                        { max: 50, message: "Họ tên không được quá 50 ký tự!" },
                        { pattern: /^[a-zA-ZÀ-ỹ\s]+$/, message: "Họ tên không được chứa ký tự đặc biệt!" }
                    ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="chuc_vu" label="Chức vụ" rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}>
                        <Select>
                            <Option value="Nhân viên">Nhân viên</Option>
                            <Option value="Quản lý">Quản lý</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="phong_ban" label="Phòng Ban" rules={[{ required: true, message: "Vui lòng chọn phòng ban!" }]}>
                        <Select>
                            <Option value="Hành chính">Hành chính</Option>
                            <Option value="Kinh doanh">Kinh doanh</Option>
                            <Option value="Công nghệ">Công nghệ</Option>
                            <Option value="Nhân sự">Nhân sự</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="luong" label="Lương" rules={[{ required: true, message: "Vui lòng nhập lương!" }]}>
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="trang_thai" label="Trạng Thái" rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}>
                        <Select>
                            <Option value="Thử việc">Thử việc</Option>
                            <Option value="Đã ký hợp đồng">Đã ký hợp đồng</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default EmployeeList;
