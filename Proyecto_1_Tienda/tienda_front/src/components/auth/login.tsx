import { useState } from "react";
import FormLogin from "../forms/FormLogin";

function Login() {

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm shadow-md w-full max-w-md">
        <div className="bg-yellow-500 py-4 px-6 flex justify-center">
          <div className="text-white font-bold text-2xl tracking-tight">mercado libre</div>
        </div>
        
        <div className="px-8 py-6">
          <h1 className="text-2xl font-light text-gray-800 mb-2">Ingresa a tu cuenta</h1>
          <FormLogin></FormLogin>
          
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              ¿No tienes cuenta?{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                Regístrate
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;