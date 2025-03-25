import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import PaidLeaveRequest from './pages/PaidLeaveRequestPage'; 
import ApplicationsOverviewPage from './pages/ApplicationsOverviewPage';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/register-success" element={<RegistrationSuccessPage />} />
          <Route path="/paid-leave-request" element={<PaidLeaveRequest />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/applications-Overview" element={<ApplicationsOverviewPage />} />
        </Routes>
      </div>
      </AuthProvider>
  );
}

export default App;
