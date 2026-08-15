import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Landing } from './pages/Landing';
import { HowItWorks } from './pages/HowItWorks';
import { RetrievedItems } from './pages/RetrievedItems';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Search } from './pages/Search';
import { ItemDetail } from './pages/ItemDetail';
import { ReportLost } from './pages/ReportLost';
import { ReportFound } from './pages/ReportFound';
import { UserDashboard } from './pages/UserDashboard';
import { MyReports } from './pages/MyReports';
import { PotentialMatches } from './pages/PotentialMatches';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminReports } from './pages/AdminReports';
import { AdminUsers } from './pages/AdminUsers';
import { AdminMatches } from './pages/AdminMatches';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/items/:id" element={<ItemDetail />} />
              <Route path="/report-lost" element={<ReportLost />} />
              <Route path="/report-found" element={<ReportFound />} />

              {/* User Dashboard & Profile Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
              <Route path="/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
              <Route path="/potential-matches" element={<ProtectedRoute><PotentialMatches /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* Protected Admin Routes */}
              <Route path="/retrieved" element={<ProtectedRoute adminOnly><RetrievedItems /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/search" element={<ProtectedRoute adminOnly><Search /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute adminOnly><AdminReports /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/matches" element={<ProtectedRoute adminOnly><AdminMatches /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
