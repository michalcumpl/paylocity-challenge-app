import { useEffect, useState } from 'react';
import type { Employee } from '../types';
import { employeeApi } from '../api/employees';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const data = employeeApi.getAll();
    setEmployees(data);
    setLoading(false);
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    if (!loading) employeeApi.saveAll(employees);
  }, [employees, loading]);

  const addEmployee = (emp: Employee) => setEmployees(prev => [...prev, emp]);
  const updateEmployee = (emp: Employee) =>
    setEmployees(prev => prev.map(e => (e.id === emp.id ? emp : e)));
  const removeEmployee = (id: string) => setEmployees(prev => prev.filter(e => e.id !== id));

  return { employees, addEmployee, updateEmployee, removeEmployee, loading };
}
