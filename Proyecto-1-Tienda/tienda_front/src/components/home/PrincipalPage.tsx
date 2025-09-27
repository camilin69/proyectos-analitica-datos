import { useAuth } from '../../context/AuthContext';
import TopBar from './TopBar';

function PrincipalPage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Opcional: redirigir al login después de logout
    // window.location.href = '/login';
  };

  return (
    <div>
      <TopBar />
      <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Página Principal</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Hola, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700">
            ¡Bienvenido a tu cuenta de Mercado Libre!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Información del Usuario</h2>
            <p><strong>Nombre:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Cédula:</strong> {user?.cedula}</p>
            <p><strong>Teléfono:</strong> {user?.phone}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Acciones</h2>
            <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
              Mi Perfil
            </button>
            <button className="bg-green-500 text-white px-3 py-1 rounded">
              Mis Compras
            </button>
          </div>
        </div>
      </div>
    </div>

    </div>
    
  );
}

export default PrincipalPage;