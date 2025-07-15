import React, { useEffect, useState } from 'react';

export function TenantPicker({ assetId, onSelect }) {
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    if (!assetId) return;
    fetch(`/api/tenants?assetId=${assetId}`)
      .then(res => res.json())
      .then(setTenants)
      .catch(console.error);
  }, [assetId]);

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="max-w-lg w-full p-6 bg-gray-800 rounded-lg space-y-4">
        <h2 className="text-xl font-medium text-gray-200">Wählen Sie einen Mieter</h2>
        <div className="grid grid-cols-3 gap-3">
          {tenants.map(t => (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className="py-2 px-3 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600 transition"
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}