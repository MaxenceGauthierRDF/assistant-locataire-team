import React, { useEffect, useState } from 'react';

export function AssetPicker({ userId, onSelect }) {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/assets?userId=${userId}`)
      .then(res => res.json())
      .then(setAssets)
      .catch(console.error);
  }, [userId]);

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Sélectionne un actif</h2>
      <div className="grid grid-cols-4 gap-2">
        {assets.map(a => (
          <button
            key={a.id}
            className="py-2 px-4 bg-green-500 rounded-lg text-white hover:bg-green-600"
            onClick={() => onSelect(a.id)}
          >
            {a.code}
          </button>
        ))}
      </div>
    </div>
  );
}
