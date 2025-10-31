import { useState } from "react";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import Header from "./components/Header";
import SummaryPanel from "./components/SummaryPanel";
import { useEmployees } from "./hooks/useEmployees";
import Modal from "./components/Modal";
import type { Employee } from "./types";

export default function App() {
  const { employees, addEmployee, updateEmployee, removeEmployee } = useEmployees();
  const [editing, setEditing] = useState<Employee | null>(null);

  const handleSave = (emp: Employee) => {
    editing?.id ? updateEmployee(emp) : addEmployee(emp);
    setEditing(null);
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <Header />
        </div>
      </header>

      {/* Sticky Summary */}
      <div className="sticky top-[64px] z-10 bg-gray-50 shadow-inner">
        <div className="mx-auto max-w-7xl px-6 py-2">
          <SummaryPanel employees={employees} />
          <button
            className="blue-button mt-3"
            onClick={() => setEditing({ id: "", name: "", dependents: [] })}
          >
            ➕ Add Employee
          </button>
        </div>
      </div>

      {/* Scrollable Employee List */}
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-16">
          <EmployeeList employees={employees} onEdit={setEditing} onDelete={removeEmployee} />
        </div>
      </main>

      {/* Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <EmployeeForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}
