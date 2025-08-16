import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axiosInstance from '../axiosConfig';
import { useMessage } from '../context/MessageContext';

const PlantList = forwardRef(({ onEdit }, ref) => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showMessage } = useMessage();

  const fetchPlants = async () => {
    try {
      const { data } = await axiosInstance.get("/api/plants");
      setPlants(data);
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to fetch plants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  useImperativeHandle(ref, () => ({
    fetchPlants,
  }));

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plant?")) return;
    try {
      await axiosInstance.delete(`/api/plants/${id}`);
      setPlants(plants.filter(p => p._id !== id));
      showMessage("success", "Plant deleted successfully!");
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to delete plant");
    }
  };

  if (loading) return <div className="text-center">Loading plants...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {plants.map((p) => (
        <div key={p._id} className="border rounded p-4 flex flex-col gap-2">
          <div className="font-bold">{p.name}</div>
          <div className="text-sm">
            {p.category} • ${p.price} • Stock: {p.stockQuantity}
          </div>
          <div className="text-sm opacity-80">{p.description}</div>
          <div className="flex gap-2 mt-2">
            <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={() => onEdit(p)}>Edit</button>
            <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => remove(p._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
});

export default PlantList;