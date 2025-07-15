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
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="max-w-lg w-full p-6 bg-gray-800 rounded-lg space-y-4">
        <h2 className="text-xl font-medium text-gray-200">Wählen Sie eine Liegenschaft</h2>
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
    </div>
  );
}