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
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Sélectionne ton nom</h2>
      <div className="grid grid-cols-2 gap-2">
        {users.map(u => (
          <button
            key={u.id}
            className="py-2 px-4 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
            onClick={() => onSelect(u.id)}
          >
            {u.name}
          </button>
        ))}
      </div>
    </div>
  );
}
