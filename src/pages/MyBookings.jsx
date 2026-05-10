import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './MyBookings.css';

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: '', type: '' });

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: '' }), 3000);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bookings/${user?.id}`);
      setBookings(res.data);
    } catch (err) {
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.id) fetchBookings(); }, []);

  const cancelBooking = async (id) => {
    try {
      setCancellingId(id);
      await api.delete(`/bookings/${id}`);
      showToast('Booking cancelled successfully', 'success');
      fetchBookings();
    } catch {
      showToast('Error cancelling booking', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatus = (booking) => {
    const now = new Date();
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    if (now < start) return { label: 'Upcoming', color: 'status-upcoming' };
    if (now >= start && now <= end) return { label: 'Active', color: 'status-active' };
    return { label: 'Expired', color: 'status-expired' };
  };

  return (
    <div className="mb-page">
      <div className="mb-glow mg1" />
      <div className="mb-glow mg2" />

      {/* Toast */}
      {toast.show && (
        <div className={`mb-toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toast.type === 'success' ? (
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      <div className="mb-shell">
        {/* Header */}
        <div className="mb-topbar">
          <button className="mb-back" onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <div className="mb-topbar-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-topbar-icon">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" />
            </svg>
            My Bookings
          </div>
          <button className="mb-new-btn" onClick={() => navigate('/slots')}>
            + New Booking
          </button>
        </div>

        {/* Page title */}
        <div className="mb-heading-wrap">
          <h1 className="mb-heading">Your Reservations</h1>
          <p className="mb-subtext">
            {bookings.length > 0
              ? `You have ${bookings.length} booking${bookings.length > 1 ? 's' : ''}`
              : 'No reservations yet'}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mb-loading">
            <span className="mb-spinner" />
            Loading your bookings...
          </div>
        )}

        {/* Empty state */}
        {!loading && bookings.length === 0 && (
          <div className="mb-empty">
            <div className="mb-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M12 12h.01M12 16h.01" strokeLinecap="round" />
              </svg>
            </div>
            <h3>No bookings yet</h3>
            <p>You haven't reserved any parking slots. Start by browsing available slots.</p>
            <button className="mb-book-btn" onClick={() => navigate('/slots')}>Browse Slots</button>
          </div>
        )}

        {/* Bookings grid */}
        {!loading && bookings.length > 0 && (
          <div className="mb-grid">
            {bookings.map((b) => {
              const { label, color } = getStatus(b);
              const isCancelling = cancellingId === b._id;

              return (
                <div key={b._id} className="mb-card">
                  <div className="mb-card-top">
                    <div className="mb-slot-badge">
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="8" width="16" height="10" rx="2" strokeLinecap="round" />
                        <path d="M6 8V5a4 4 0 018 0v3" strokeLinecap="round" />
                      </svg>
                      {b.slotNumber || 'N/A'}
                    </div>
                    <span className={`mb-status ${color}`}>{label}</span>
                  </div>

                  <div className="mb-card-body">
                    <div className="mb-time-row">
                      <div className="mb-time-item">
                        <span className="mb-time-label">Check In</span>
                        <span className="mb-time-value">
                          {new Date(b.startTime).toLocaleString('en-IN', {
                            day: 'numeric', month: 'short',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="mb-time-arrow">→</div>
                      <div className="mb-time-item">
                        <span className="mb-time-label">Check Out</span>
                        <span className="mb-time-value">
                          {new Date(b.endTime).toLocaleString('en-IN', {
                            day: 'numeric', month: 'short',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="mb-meta-row">
                      <div className="mb-meta-item">
                        <span className="mb-meta-label">Booked On</span>
                        <span className="mb-meta-value">
                          {new Date(b.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </span>
                      </div>
                      {b.amount && (
                        <div className="mb-meta-item">
                          <span className="mb-meta-label">Amount</span>
                          <span className="mb-meta-value mb-amount">₹{b.amount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {label !== 'Expired' && (
                    <div className="mb-card-footer">
                      <button
                        className="mb-cancel-btn"
                        onClick={() => cancelBooking(b._id)}
                        disabled={isCancelling}
                      >
                        {isCancelling ? (
                          <><span className="mb-mini-spinner" /> Cancelling…</>
                        ) : (
                          <>
                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M6 6l8 8M14 6l-8 8" strokeLinecap="round" />
                            </svg>
                            Cancel Booking
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;