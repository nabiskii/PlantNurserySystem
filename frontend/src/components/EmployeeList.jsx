import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import { useMessage } from '../context/MessageContext';

const EmployeeList = forwardRef(({ onEdit }, ref) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showMessage } = useMessage();

  const fetchEmployees = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/api/employees");
      setEmployees(data);
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useImperativeHandle(ref, () => ({
    fetchEmployees,
  }));

  const removeEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axiosInstance.delete(`/api/employees/${id}`);
      showMessage("success", "Employee deleted successfully!");
      await fetchEmployees();
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to delete employee");
    }
  };

  if (loading) return <div className="text-center">Loading employees...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {employees.map((e) => (
        <div key={e._id} className="border rounded p-4 flex flex-col gap-2">
          <div className="font-bold">{e.name}</div>
          <div className="text-sm">
            {e.role} • {e.department} • {e.phone}
          </div>
          <div className="text-sm opacity-80">{e.email}</div>
          <div className="text-sm opacity-70">
            Joined: {new Date(e.dateJoined).toLocaleDateString()}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              className="px-3 py-1 rounded bg-blue-600 text-white"
              onClick={() => onEdit(e)}
            >
              Edit
            </button>
            <button
              className="px-3 py-1 rounded bg-red-600 text-white"
              onClick={() => removeEmployee(e._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
});

export default EmployeeList;
