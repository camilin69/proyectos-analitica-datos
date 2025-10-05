// pages/SellPage.tsx
import { useAuth } from '../../../context/AuthContext';
import TopBar from '../../home/TopBar';

function SellPage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <TopBar user={user} onLogout={handleLogout} />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Vender Producto</h1>
          
          {/* Aquí va tu formulario de venta */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del producto
                </label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea 
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={4}
                />
              </div>
              
              {/* Más campos del formulario */}
              
              <button 
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Publicar Producto
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellPage;