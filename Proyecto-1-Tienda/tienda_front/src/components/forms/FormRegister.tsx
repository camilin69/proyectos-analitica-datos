import { useState } from "react";
import { useAuth } from '../../context/AuthContext';

type EmailInputProps = {
    email: string;
    setEmail: (value: string) => void;
    error?: string;
};

const EmailInput = ({ email, setEmail, error }: EmailInputProps) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

type NameInputProps = {
    name: string;
    setName: (value: string) => void;
    error?: string;
};

const NameInput = ({ name, setName, error }: NameInputProps) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre completo"
                className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

type CedulaInputProps = {
    cedula: string;
    setCedula: (value: string) => void;
    error?: string;
};

const CedulaInput = ({ cedula, setCedula, error }: CedulaInputProps) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
            <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Número de cédula"
                className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

type PhoneInputProps = {
    phone: string;
    setPhone: (value: string) => void;
    error?: string;
};

const PhoneInput = ({ phone, setPhone, error }: PhoneInputProps) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Número de teléfono"
                className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

type PasswordInputProps = {
    password: string;
    setPassword: (value: string) => void;
    error?: string;
    confirm?: boolean;
};

const PasswordInput = ({ password, setPassword, error, confirm = false }: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {confirm ? "Confirmar contraseña" : "Contraseña"}
            </label>
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={confirm ? "Confirmar contraseña" : "Contraseña"}
                    className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                    )}
                </button>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

function FormRegister() {
    const { register, isLoading, error, clearError } = useAuth();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [cedula, setCedula] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const errors: Record<string, string> = {};
        
        if (!email) errors.email = "El email es obligatorio";
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "El formato del email no es válido";
        
        if (!name) errors.name = "El nombre es obligatorio";
        
        if (!cedula) errors.cedula = "La cédula es obligatoria";
        else if (!/^\d+$/.test(cedula)) errors.cedula = "La cédula debe contener solo números";
        
        if (!phone) errors.phone = "El teléfono es obligatorio";
        else if (!/^\d+$/.test(phone)) errors.phone = "El teléfono debe contener solo números";
        
        if (!password) errors.password = "La contraseña es obligatoria";
        else if (password.length < 6) errors.password = "La contraseña debe tener al menos 6 caracteres";
        
        if (!confirmPassword) errors.confirmPassword = "Debes confirmar tu contraseña";
        else if (password !== confirmPassword) errors.confirmPassword = "Las contraseñas no coinciden";
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setFieldErrors({}); // 🔥 Cambiado de setLocalErrors a setFieldErrors
        
        // Validación básica frontend
        const newErrors: { [key: string]: string } = {};
        
        if (!name) newErrors.name = 'El nombre es requerido';
        if (!email) newErrors.email = 'El email es requerido';
        if (!cedula) newErrors.cedula = 'La cédula es requerida';
        if (!phone) newErrors.phone = 'El teléfono es requerido';
        if (!password) newErrors.password = 'La contraseña es requerida';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
        
        if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors); // 🔥 Cambiado de setLocalErrors a setFieldErrors
            return;
        }
        
        await register({ name, email, cedula, phone, password });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-light text-gray-800 mb-6 text-center">Regístrate</h2>
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            <NameInput name={name} setName={setName} error={fieldErrors.name} />
            <CedulaInput cedula={cedula} setCedula={setCedula} error={fieldErrors.cedula} />
            <PhoneInput phone={phone} setPhone={setPhone} error={fieldErrors.phone} />
            <EmailInput email={email} setEmail={setEmail} error={fieldErrors.email} />
            <PasswordInput password={password} setPassword={setPassword} error={fieldErrors.password} />
            <PasswordInput 
                password={confirmPassword} 
                setPassword={setConfirmPassword} 
                error={fieldErrors.confirmPassword} 
                confirm={true} 
            />
            
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mt-2"
            >
                {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
        </form>
    );
}

export default FormRegister;
