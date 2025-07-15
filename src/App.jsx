import React from 'react';
import { UserPicker } from './components/UserPicker';
import { AssetPicker } from './components/AssetPicker';
import { TenantPicker } from './components/TenantPicker';
import Chat from './pages/Chat';

function App() {
  const [user, setUser] = React.useState(null);
  const [asset, setAsset] = React.useState(null);
  const [tenant, setTenant] = React.useState(null);

  // Handler de déconnexion : réinitialise l'état pour revenir au début
  const handleLogout = () => {
    setTenant(null);
    setAsset(null);
    setUser(null);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      {!user && <UserPicker onSelect={setUser} />}
      {user && !asset && <AssetPicker userId={user} onSelect={setAsset} />}
      {asset && !tenant && <TenantPicker assetId={asset} onSelect={setTenant} />}
      {tenant && <Chat tenantId={tenant} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
