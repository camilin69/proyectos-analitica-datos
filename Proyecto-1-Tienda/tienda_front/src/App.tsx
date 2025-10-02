// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import Login from './components/auth/Login';
import PrincipalPage from './components/pages/PrincipalPage';
import SellPage from './components/pages/SellPage';
import ProfilePage from './components/pages/ProfilePage';
import ProductDetailPage from './components/pages/ProductDetail';
import LoadingSpinner from './components/products/LoadingSpinner';

// Componente para proteger rutas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
}

// Componente para rutas públicas (cuando ya está autenticado)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return !user ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <div className="App">
            <Routes>
              {/* Ruta pública - Login */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              
              {/* Rutas protegidas */}
              <Route path="/" element={
                <ProtectedRoute>
                  <PrincipalPage />
                </ProtectedRoute>
              } />
              
              <Route path="/sell" element={
                <ProtectedRoute>
                  <SellPage />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="/product/:id" element={
                <ProtectedRoute>
                  <ProductDetailPage />
                </ProtectedRoute>
              } />

              <Route path="/category/:id" element={
                <ProtectedRoute>
                  <ProductDetailPage />
                </ProtectedRoute>
              } />
              
              {/* Ruta 404 */}
              <Route path="*" element={<div>Página no encontrada</div>} />
            </Routes>
          </div>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;