import { renderHook, act } from '@testing-library/react';
import { useEmployees } from '../useEmployees';
import type { Employee } from '../../types';

vi.mock('../../api/employees', () => ({
  employeeApi: {
    getAll: vi.fn(),
    saveAll: vi.fn(),
  },
}));

import { employeeApi } from '../../api/employees';

describe('useEmployees', () => {
  const mockEmployees: Employee[] = [
    { id: '1', name: 'Alice', dependents: [] },
    { id: '2', name: 'Bob', dependents: [] },
  ];

  beforeEach(() => {
    (employeeApi.getAll as ReturnType<typeof vi.fn>).mockReturnValue(mockEmployees);
    (employeeApi.saveAll as ReturnType<typeof vi.fn>).mockClear();
  });

  it('initializes from employeeApi.getAll()', () => {
    const { result } = renderHook(() => useEmployees());
    expect(result.current.employees).toEqual(mockEmployees);
    expect(employeeApi.getAll).toHaveBeenCalledTimes(1);
  });

  it('adds a new employee', () => {
    const { result } = renderHook(() => useEmployees());
    const newEmp: Employee = { id: '3', name: 'Charlie', dependents: [] };

    act(() => {
      result.current.addEmployee(newEmp);
    });

    expect(result.current.employees).toContainEqual(newEmp);
    expect(employeeApi.saveAll).toHaveBeenCalledWith([...mockEmployees, newEmp]);
  });

  it('updates an existing employee', () => {
    const { result } = renderHook(() => useEmployees());
    const updated: Employee = { ...mockEmployees[0], name: 'Alicia' };

    act(() => {
      result.current.updateEmployee(updated);
    });

    expect(result.current.employees[0].name).toBe('Alicia');
    expect(employeeApi.saveAll).toHaveBeenCalled();
  });

  it('removes an employee by id', () => {
    const { result } = renderHook(() => useEmployees());

    act(() => {
      result.current.removeEmployee('1');
    });

    expect(result.current.employees).toHaveLength(1);
    expect(result.current.employees[0].id).toBe('2');
  });
});
