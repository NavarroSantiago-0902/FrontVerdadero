import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import Trainings from './pages/Trainings';
import Results from './pages/Results';

function PrivateLayout() {
  const { isAuth } = useAuth();
  if (!isAuth) return <Navigate to="/login" replace />;
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/players" element={<Players />} />
          <Route path="/trainings" element={<Trainings />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function PublicRoute({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
          <Route path="/*" element={<PrivateLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
