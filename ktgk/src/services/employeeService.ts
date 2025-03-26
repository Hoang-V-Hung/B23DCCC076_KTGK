import { Employee } from "../models/Employee";

export const getEmployees = (): Employee[] => {
  const data = localStorage.getItem("employees");
  return data ? JSON.parse(data) : [];
};

export const addEmployee = (employee: Employee) => {
  const employees = getEmployees();
  employees.push(employee);
  localStorage.setItem("employees", JSON.stringify(employees));
};


