import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import QRScannerPage from './pages/QRScannerPage';
import BodyAnalysisPage from './pages/BodyAnalysisPage';
import DietPlanPage from './pages/DietPlanPage';
import MembershipManagePage from './pages/MembershipManagePage';
import WorkoutProgramPage from './pages/WorkoutProgramPage';
import ProgressTrackingPage from './pages/ProgressTrackingPage';
import ProfileAndGoalsPage from './pages/ProfileAndGoalsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hakkimizda" element={<AboutPage />} />
            <Route path="/uyelik-paketleri" element={<PricingPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/giris" element={<LoginPage />} />
            <Route path="/kayit" element={<RegisterPage />} />
            <Route path="/qr-tarayici" element={<QRScannerPage />} />
            <Route path="/sifremi-unuttum" element={<ForgotPasswordPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profil-ve-hedefler" 
              element={
                <ProtectedRoute>
                  <ProfileAndGoalsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/vucut-analizi" 
              element={
                <ProtectedRoute>
                  <BodyAnalysisPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/diyet-plani" 
              element={
                <ProtectedRoute>
                  <DietPlanPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/uyelik-yonetimi" 
              element={
                <ProtectedRoute>
                  <MembershipManagePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/antrenman-programi" 
              element={
                <ProtectedRoute>
                  <WorkoutProgramPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ilerleme-takibi" 
              element={
                <ProtectedRoute>
                  <ProgressTrackingPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;