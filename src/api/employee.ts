import type { Employee } from "../types";

const STORAGE_KEY = "employees";

export const employeeApi = {
  getAll: (): Employee[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveAll: (employees: Employee[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  },
};
