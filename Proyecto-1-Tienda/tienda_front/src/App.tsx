import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CategoryProvider } from './context/CategoryContext';
import { CouponProvider } from './context/CouponContext';
import Login from './components/auth/Login';
import PrincipalPage from './components/pages/PrincipalPage';
import SellPage from './components/pages/sell/SellPage';
import ProfilePage from './components/pages/ProfilePage';
import ProductDetailPage from './components/pages/ProductDetail';
import LoadingSpinner from './components/products/LoadingSpinner';
import CategoryPage from './components/pages/CategoryPage';
import ProfileSeller from './components/pages/ProfileSeller';
import OffersPage from './components/pages/OffersPage';
import CouponsPage from './components/pages/CouponsPage';
import SellProductPage from './components/pages/sell/SellProductPage';
import EditFeaturesProduct from './components/pages/sell/EditFeaturesProduct';

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
        <CategoryProvider>
          <ProductProvider>
            <CouponProvider>
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

                  <Route path="/sell/product/:id" element={
                    <ProtectedRoute>
                      <SellProductPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/sell/new-product" element={
                    <ProtectedRoute>
                      <EditFeaturesProduct />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/sell/edit-product" element={
                    <ProtectedRoute>
                      <EditFeaturesProduct />
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

                  <Route path="/category/:categoryName" element={
                    <ProtectedRoute>
                      <CategoryPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile/:sellerId" element={
                    <ProtectedRoute>
                      <ProfileSeller />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/offers" element={
                    <ProtectedRoute>
                      <OffersPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/coupons" element={
                    <ProtectedRoute>
                      <CouponsPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Ruta 404 */}
                  <Route path="*" element={<div>Página no encontrada</div>} />
                </Routes>
              </div>
            </CouponProvider>
          </ProductProvider>
        </CategoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;