import Login from "./components/auth/Login"
import PrincipalPage from "./components/home/PrincipalPage";
import { AuthProvider, useAuth } from "./context/AuthContext"
function AppContent() {
  const { user } = useAuth();
  return user ? <PrincipalPage /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  )
}

export default App
