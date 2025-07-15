import React, { useEffect, useState } from 'react';

export function UserPicker({ onSelect }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="max-w-lg w-full p-6 bg-gray-800 rounded-lg space-y-4">
        <h2 className="text-xl font-medium text-gray-200">Wählen Sie einen Nutzer</h2>
        <div className="grid grid-cols-2 gap-3">
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => onSelect(u.id)}
              className="py-2 px-3 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600 transition"
            >
              {u.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}