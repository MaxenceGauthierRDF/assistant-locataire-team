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
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Sélectionne un locataire</h2>
      <div className="grid grid-cols-3 gap-2">
        {tenants.map(t => (
          <button
            key={t.id}
            className="py-2 px-4 bg-purple-500 rounded-lg text-white hover:bg-purple-600"
            onClick={() => onSelect(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}
