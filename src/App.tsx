import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/auth/LoginPage'
import SignUpPage from '@/pages/auth/SignUpPage'
import CheckEmailPage from '@/pages/auth/CheckEmailPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import CreateGiveawayPage from '@/pages/giveaway/CreateGiveawayPage'
import SingleGiveawayPage from '@/pages/giveaway/SingleGiveawayPage'
import UserProfilePage from '@/pages/user/UserProfilePage'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/giveaway/:id" element={<SingleGiveawayPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-giveaway" element={<CreateGiveawayPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App