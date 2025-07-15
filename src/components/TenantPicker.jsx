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
    <div className="max-w-lg mx-auto p-4 bg-blue-900 rounded-lg">
      <h2 className="text-xl font-medium text-gray-200 mb-4">Choisissez un locataire</h2>
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
  );
}
