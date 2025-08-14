import { useState } from 'react';
import PlantList from '../components/PlantList';
import PlantForm from '../components/PlantForm';

export default function PlantsPage() {
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // force refresh list after submit

  const handleDone = () => {
    setEditing(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-[1fr_1fr] gap-6">
      <PlantForm editing={editing} onDone={handleDone} />
      {/* Key will re-mount list to refetch inside component */}
      <div key={refreshKey}>
        <PlantList onEdit={setEditing} />
      </div>
    </div>
  );
};
