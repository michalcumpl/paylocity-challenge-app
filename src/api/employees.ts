import type { Employee } from '../types';
import { mockEmployees } from '../mocks/employees';

const STORAGE_KEY = 'employees';

export const employeeApi = {
  getAll(): Employee[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);

    // seed sample data on first startup
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEmployees));
    return mockEmployees;
  },

  saveAll(employees: Employee[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  },
};
