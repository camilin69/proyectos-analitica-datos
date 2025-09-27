import { useState } from "react";
import FormLogin from "../forms/FormLogin";
import FormRegister from "../forms/FormRegister";
import { useAuth } from '../../context/AuthContext'; // 🔥 Importar el hook

function Login() {
  const [loginActive, setLoginActive] = useState(true);
  const { clearError } = useAuth(); // 🔥 Obtener la función clearError del contexto

  const handleToggle = () => {
    clearError(); // 🔥 Limpiar errores al cambiar de formulario
    setLoginActive(!loginActive);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm shadow-md w-full max-w-md">
        <div className="bg-yellow-500 py-4 px-6 flex justify-center">
          <div className="text-white font-bold text-2xl tracking-tight">mercado libre</div>
        </div>
        
        <div className="px-8 py-6">
          <h1 className="text-2xl font-light text-gray-800 mb-2">
            {loginActive ? "Ingresa a tu cuenta" : "Crea tu cuenta"}
          </h1>
          {loginActive ? (
            <FormLogin />
          ) : (
            <FormRegister />
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              {loginActive ? (
                <p className="text-sm text-gray-600 mb-2">¿No tienes cuenta?</p>
              ) : (
                <p className="text-sm text-gray-600 mb-2">¿Ya tienes cuenta?</p>
              )}
              <button
                onClick={handleToggle} // 🔥 Usar la nueva función
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                {loginActive ? "Regístrate" : "Inicia sesión"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;