import { useState, useEffect } from "react";
import { Employee } from "./Employee";

export const useEmployeeModel = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        const storedEmployees = localStorage.getItem("employees");
        if (storedEmployees) {
            setEmployees(JSON.parse(storedEmployees));
        }
    }, []);

    const updateLocalStorage = (data: Employee[]) => {
        localStorage.setItem("employees", JSON.stringify(data));
    };

    const addEmployee = (newEmployee: Employee) => {
        const updatedList = [...employees, newEmployee];
        setEmployees(updatedList);
        updateLocalStorage(updatedList);
    };

    const updateEmployee = (updatedEmployee: Employee) => {
        const updatedList = employees.map((emp) => 
            emp.id === updatedEmployee.id ? updatedEmployee : emp
        );
        setEmployees(updatedList);
        updateLocalStorage(updatedList);
    };

    const deleteEmployee = (id: string, trang_thai: string) => {
        if (trang_thai === "Đã ký hợp đồng") {
            return false; 
        }
        const updatedList = employees.filter((emp) => emp.id !== id);
        setEmployees(updatedList);
        updateLocalStorage(updatedList);
        return true;
    };

    return { employees, addEmployee, updateEmployee, deleteEmployee };
};
