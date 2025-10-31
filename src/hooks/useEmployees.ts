import { useEffect, useState } from 'react';
import type { Employee } from '../types';
import { employeeApi } from '../api/employees';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>(() => employeeApi.getAll());

  useEffect(() => {
    employeeApi.saveAll(employees);
  }, [employees]);

  const addEmployee = (emp: Employee) => setEmployees(prev => [...prev, emp]);
  const updateEmployee = (emp: Employee) =>
    setEmployees(prev => prev.map(e => (e.id === emp.id ? emp : e)));
  const removeEmployee = (id: string) => setEmployees(prev => prev.filter(e => e.id !== id));

  return { employees, addEmployee, updateEmployee, removeEmployee };
}
