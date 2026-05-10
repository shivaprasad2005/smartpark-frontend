import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ParkingSlots from './pages/ParkingSlots';
import ConfirmBooking from './pages/ConfirmBooking';
import Receipt from './pages/Receipt';
import AdminPanel from './pages/AdminPanel';
import MyBookings from './pages/MyBookings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/slots" element={
          <ProtectedRoute><ParkingSlots /></ProtectedRoute>
        } />
        <Route path="/confirm-booking" element={
          <ProtectedRoute><ConfirmBooking /></ProtectedRoute>
        } />
        <Route path="/receipt" element={
          <ProtectedRoute><Receipt /></ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute><MyBookings /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;