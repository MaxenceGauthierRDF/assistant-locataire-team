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
    <div className="max-w-lg mx-auto p-4 bg-blue-900 rounded-lg">
      <h2 className="text-xl font-medium text-gray-200 mb-4">Sélectionnez un actif</h2>
      <div className="grid grid-cols-4 gap-2">
        {assets.map(a => (
          <button
            key={a.id}
            onClick={() => onSelect(a.id)}
            className="py-2 px-3 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600 transition"
          >
            {a.code}
          </button>
        ))}
      </div>
    </div>
  );
}
