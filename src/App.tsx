import { lazy, Suspense } from 'react';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AuthProvider } from './lib/AuthContext';

const Login = lazy(() => import('./pages/admin/Login').then(module => ({ default: module.Login })));

const Dashboard = lazy(() => import('./pages/admin/Dashboard').then(module => ({ default: module.Dashboard })));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<p role="status">Loading…</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<main className="p-12"><h1>Page not found</h1><Link to="/">Return to portfolio</Link></main>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
