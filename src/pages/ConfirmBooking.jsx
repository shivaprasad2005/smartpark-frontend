import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useState } from 'react';
import './ConfirmBooking.css';

function ConfirmBooking() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!state) {
    return (
      <div className="cb-error-page">
        <h2>No booking data found ❌</h2>
        <button onClick={() => navigate('/slots')}>Go to Slots</button>
      </div>
    );
  }

  const { slots, startTime, duration, amount } = state;
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const endTime = new Date(new Date(startTime).getTime() + duration * 60000);

  const confirmBooking = async () => {
    try {
      if (!slots?.length) { alert('No slots selected ❌'); return; }
      setLoading(true);

      await Promise.all(
        slots.map((slot) =>
          api.post(`/bookings/${slot._id}`, {
            userId: user?.id,
            startTime,
            duration,
            amount: amount ,
          })
        )
      );

      navigate('/receipt', { state, replace: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cb-page">
      <div className="cb-glow cg1" />
      <div className="cb-glow cg2" />

      <div className="cb-shell">
        {/* Back button */}
        <button className="cb-back" onClick={() => navigate('/slots')}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Slots
        </button>

        <div className="cb-card">
          <div className="cb-card-header">
            <div className="cb-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1>Confirm Booking</h1>
              <p>Review your reservation details before confirming</p>
            </div>
          </div>

          {/* Booking details */}
          <div className="cb-details">
            <div className="cb-detail-section">
              <h3>Selected Slots</h3>
              <div className="cb-slots-list">
                {slots.map((s) => (
                  <div key={s._id} className="cb-slot-chip">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="8" width="16" height="10" rx="2" strokeLinecap="round" />
                      <path d="M2 11h16M6 8V5a4 4 0 018 0v3" strokeLinecap="round" />
                    </svg>
                    {s.slotNumber}
                  </div>
                ))}
              </div>
            </div>

            <div className="cb-detail-grid">
              <div className="cb-detail-item">
                <span className="cb-detail-label">Start Time</span>
                <span className="cb-detail-value">
                  {new Date(startTime).toLocaleString('en-IN', {
                    weekday: 'short', day: 'numeric', month: 'short',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="cb-detail-item">
                <span className="cb-detail-label">End Time</span>
                <span className="cb-detail-value">
                  {endTime.toLocaleString('en-IN', {
                    weekday: 'short', day: 'numeric', month: 'short',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="cb-detail-item">
                <span className="cb-detail-label">Duration</span>
                <span className="cb-detail-value">{duration} minutes</span>
              </div>
              <div className="cb-detail-item">
                <span className="cb-detail-label">Slots Count</span>
                <span className="cb-detail-value">{slots.length}</span>
              </div>
            </div>

            <div className="cb-amount-row">
              <span>Total Amount</span>
              <span className="cb-amount">₹{amount}</span>
            </div>
          </div>

          {/* User info */}
          <div className="cb-user-row">
            <div className="cb-user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <p className="cb-user-name">{user?.name}</p>
              <p className="cb-user-email">{user?.email}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="cb-actions">
            <button className="cb-cancel-btn" onClick={() => navigate('/slots')} disabled={loading}>
              Cancel
            </button>
            <button className="cb-confirm-btn" onClick={confirmBooking} disabled={loading}>
              {loading ? (
                <span className="cb-loading">
                  <span className="cb-spinner" />
                  Processing...
                </span>
              ) : (
                <>
                  Confirm & Pay ₹{amount}
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmBooking;