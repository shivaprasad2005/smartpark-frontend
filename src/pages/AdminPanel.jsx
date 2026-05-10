import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./AdminPanel.css";

function AdminPanel() {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [stats, setStats] = useState({
    totalSlots: 0,
    activeBookings: 0,
    availableSlots: 0,
    totalBookings: 0,
  });
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get("/parking/stats");
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllBookings = async () => {
    try {
      const res = await api.get("/bookings/all");
      setAllBookings(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchStats(), fetchAllBookings()]);
      setLoading(false);
    };
    load();
  }, []);

  const createSlots = async () => {
    try {
      const res = await api.post("/parking/create");
      alert(res.data.message);
      fetchStats();
      fetchAllBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating slots");
    }
  };

  const resetSlots = async () => {
    if (!window.confirm("Reset all slots? This will cancel all bookings.")) return;
    try {
      const res = await api.post("/parking/reset");
      alert(res.data.message);
      fetchStats();
      fetchAllBookings();
    } catch (error) {
      alert("Error resetting slots");
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      fetchStats();
      fetchAllBookings();
    } catch (error) {
      alert("Error cancelling booking");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <div className="ap-page">
      <div className="ap-glow g1" />
      <div className="ap-glow g2" />

      <div className="ap-shell">

        {/* Header */}
        <header className="ap-header">
          <div className="ap-brand">
            <div className="ap-brand-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <rect x="4" y="16" width="32" height="18" rx="4" fill="currentColor" opacity="0.15" />
                <rect x="8" y="20" width="6" height="10" rx="2" fill="currentColor" opacity="0.8" />
                <rect x="18" y="20" width="6" height="10" rx="2" fill="currentColor" opacity="0.8" />
                <rect x="28" y="20" width="6" height="10" rx="2" fill="currentColor" opacity="0.8" />
                <path d="M4 20 L20 8 L36 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="ap-brand-name">SmartPark</span>
          </div>

          <div className="ap-header-right">
            <button className="ap-back-btn" onClick={() => navigate("/dashboard")}>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 4L4 10l6 6M4 10h12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Dashboard
            </button>
            <div className="ap-user-pill">
              <div className="ap-avatar">{user?.name?.[0]?.toUpperCase() || "A"}</div>
              <div className="ap-user-info">
                <span className="ap-user-name">{user?.name}</span>
                <span className="ap-user-role">Administrator</span>
              </div>
            </div>
            <button className="ap-logout-btn" onClick={handleLogout}>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 3h4a1 1 0 011 1v12a1 1 0 01-1 1h-4M9 14l4-4-4-4M13 10H3"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* Page title */}
        <div className="ap-hero">
          <span className="ap-eyebrow">Operations Center</span>
          <h1 className="ap-title">Admin Panel</h1>
          <p className="ap-subtitle">
            Track system usage, create new slots, and manage active bookings from a single dashboard.
          </p>
        </div>

        {/* Stats */}
        <div className="ap-stats">
          <div className="ap-stat-card stat-total">
            <div className="ap-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" />
                <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" />
                <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round" />
                <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round" />
              </svg>
            </div>
            <div className="ap-stat-info">
              <span className="ap-stat-label">Total Slots</span>
              <span className="ap-stat-value">{stats.totalSlots}</span>
            </div>
          </div>

          <div className="ap-stat-card stat-booked">
            <div className="ap-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" />
                <circle cx="12" cy="9" r="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="ap-stat-info">
              <span className="ap-stat-label">Booked</span>
              <span className="ap-stat-value">{stats.activeBookings}</span>
            </div>
          </div>

          <div className="ap-stat-card stat-available">
            <div className="ap-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="9" strokeLinecap="round" />
              </svg>
            </div>
            <div className="ap-stat-info">
              <span className="ap-stat-label">Available</span>
              <span className="ap-stat-value">{stats.availableSlots}</span>
            </div>
          </div>

          <div className="ap-stat-card stat-all">
            <div className="ap-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" />
                <rect x="9" y="3" width="6" height="4" rx="1" strokeLinecap="round" />
                <path d="M9 12h6M9 16h4" strokeLinecap="round" />
              </svg>
            </div>
            <div className="ap-stat-info">
              <span className="ap-stat-label">Total Bookings</span>
              <span className="ap-stat-value">{stats.totalBookings}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="ap-actions">
          <button className="ap-btn btn-create" onClick={createSlots}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 4v12M4 10h12" strokeLinecap="round" />
            </svg>
            Create Slots
          </button>
          <button className="ap-btn btn-reset" onClick={resetSlots}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4v5h5M16 16v-5h-5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.93 9A8 8 0 1115.07 15" strokeLinecap="round" />
            </svg>
            Reset All Slots
          </button>
        </div>

        {/* Bookings */}
        <div className="ap-bookings-section">
          <div className="ap-bookings-header">
            <h2 className="ap-bookings-title">All Bookings</h2>
            <span className="ap-bookings-count">{allBookings.length} total</span>
          </div>

          {loading ? (
            <div className="ap-empty">Loading bookings...</div>
          ) : allBookings.length === 0 ? (
            <div className="ap-empty">No bookings yet.</div>
          ) : (
            <div className="ap-booking-grid">
              {allBookings.map((b) => (
                <div key={b._id} className="ap-booking-card">
                  <div className="ap-booking-top">
                    <div className="ap-slot-badge">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="1" y="5" width="14" height="9" rx="2" />
                        <path d="M4 5V4a4 4 0 018 0v1" strokeLinecap="round" />
                      </svg>
                      {b.slotNumber}
                    </div>
                    <span className="ap-booking-status">Active</span>
                  </div>

                  <div className="ap-booking-details">
                    <div className="ap-booking-row">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="8" cy="5" r="3" />
                        <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" strokeLinecap="round" />
                      </svg>
                      <span>{b.userId?.name}</span>
                    </div>
                    <div className="ap-booking-row">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="1" y="3" width="14" height="11" rx="2" />
                        <path d="M1 7h14M5 1v4M11 1v4" strokeLinecap="round" />
                      </svg>
                      <span>{new Date(b.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="ap-booking-row">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="1" y="3" width="14" height="11" rx="2" />
                        <path d="M1 7h14" strokeLinecap="round" />
                        <path d="M5 11h2M9 11h2" strokeLinecap="round" />
                      </svg>
                      <span>{b.userId?.email}</span>
                    </div>
                  </div>

                  <button
                    className="ap-cancel-btn"
                    onClick={() => cancelBooking(b._id)}
                  >
                    Cancel Booking
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminPanel;