import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BoardPage from './pages/BoardPage';
import DashboardPage from './pages/DashboardPage';

// ── AUTH DISABLED ────────────────────────────────────────────────────────────
// ProtectedRoute and PublicRoute are bypassed. All routes are open.
// To re-enable, restore the original guard logic using useAuth().
function ProtectedRoute({ children }) {
  return children; // was: user ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  return children; // was: user ? <Navigate to="/board" /> : children
}

// function ProtectedRoute({ children }) {
//   const { user, loading } = useAuth();
//   if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-text-secondary text-sm">Loading...</div></div>;
//   return user ? children : <Navigate to="/login" replace />;
// }

// function PublicRoute({ children }) {
//   const { user, loading } = useAuth();
//   if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-text-secondary text-sm">Loading...</div></div>;
//   return user ? <Navigate to="/board" replace /> : children;
// }
// ─────────────────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/board" replace />} />
        <Route path="board" element={<BoardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
