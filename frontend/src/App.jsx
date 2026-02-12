import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AgentsPage from './pages/AgentsPage';
import UploadPage from './pages/UploadPage';
import Navbar from './components/Navbar';

import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { userInfo } = useAuth();
    if (!userInfo) return <Navigate to="/login" replace />;
    if (adminOnly && userInfo.role !== 'admin') return <Navigate to="/dashboard" replace />;
    return children;
};

function App() {
    const { userInfo } = useAuth();

    return (
        <Router>
            <div className="app-container">
                {userInfo && <Navbar />}
                <main style={{ padding: userInfo ? '2rem' : '0' }}>
                    <ErrorBoundary>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/agents"
                                element={
                                    <ProtectedRoute adminOnly>
                                        <AgentsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/upload"
                                element={
                                    <ProtectedRoute>
                                        <UploadPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                        </Routes>
                    </ErrorBoundary>
                </main>
            </div>
        </Router>
    );
}

export default App;
