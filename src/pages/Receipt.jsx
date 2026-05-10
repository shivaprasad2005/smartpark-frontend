import { useLocation, useNavigate } from 'react-router-dom';
import './Receipt.css';

function Receipt() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!state) {
    return (
      <div className="receipt-error">
        <h2>No receipt data ❌</h2>
        <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      </div>
    );
  }

  const { slots, startTime, duration, amount } = state;
  const endTime = new Date(new Date(startTime).getTime() + duration * 60000);
  const txnId = 'TXN' + Date.now().toString(36).toUpperCase();
  const paidAt = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium', timeStyle: 'short',
  });

  return (
    <div className="receipt-page">
      <div className="receipt-glow rg1" />
      <div className="receipt-glow rg2" />

      <div className="receipt-shell">
        {/* Back button */}
        <button className="receipt-back" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Dashboard
        </button>

        {/* Success badge */}
        <div className="receipt-success-badge">
          <div className="receipt-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2>Payment Successful!</h2>
            <p>Your parking slot has been reserved</p>
          </div>
        </div>

        {/* Receipt card */}
        <div className="receipt-card">
          {/* Decorative top */}
          <div className="receipt-card-top">
            <span>PARKING RECEIPT</span>
            <span>SmartPark</span>
          </div>

          {/* Perforated divider */}
          <div className="receipt-divider">
            <div className="receipt-circle left" />
            <div className="receipt-dots" />
            <div className="receipt-circle right" />
          </div>

          {/* User section */}
          <div className="receipt-section">
            <div className="receipt-user">
              <div className="receipt-avatar">{user?.name?.[0]?.toUpperCase()}</div>
              <div>
                <p className="receipt-user-name">{user?.name}</p>
                <p className="receipt-user-email">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="receipt-divider-thin" />

          {/* Slot details */}
          <div className="receipt-section">
            <h4 className="receipt-section-title">Booked Slots</h4>
            <div className="receipt-slots">
              {slots.map((s) => (
                <div key={s._id} className="receipt-slot-chip">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="8" width="16" height="10" rx="2" />
                    <path d="M6 8V5a4 4 0 018 0v3" strokeLinecap="round" />
                  </svg>
                  {s.slotNumber}
                </div>
              ))}
            </div>
          </div>

          <div className="receipt-divider-thin" />

          {/* Time details */}
          <div className="receipt-section receipt-grid">
            <div className="receipt-row">
              <span className="receipt-label">Check In</span>
              <span className="receipt-value">
                {new Date(startTime).toLocaleString('en-IN', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Check Out</span>
              <span className="receipt-value">
                {endTime.toLocaleString('en-IN', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Duration</span>
              <span className="receipt-value">{duration} mins</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Paid On</span>
              <span className="receipt-value">{paidAt}</span>
            </div>
          </div>

          <div className="receipt-divider-thin" />

          {/* Payment */}
          <div className="receipt-section">
            <div className="receipt-row receipt-total-row">
              <span>Total Paid</span>
              <span className="receipt-total-amount">₹{amount}</span>
            </div>
            <div className="receipt-row" style={{ marginTop: '8px' }}>
              <span className="receipt-label">Transaction ID</span>
              <span className="receipt-txn">{txnId}</span>
            </div>
            <div className="receipt-payment-status">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              PAYMENT SUCCESS
            </div>
          </div>

          {/* Perforated divider */}
          <div className="receipt-divider">
            <div className="receipt-circle left" />
            <div className="receipt-dots" />
            <div className="receipt-circle right" />
          </div>

          <div className="receipt-card-bottom">
            Thank you for using SmartPark! 🚗
          </div>
        </div>

        {/* Action buttons */}
        <div className="receipt-actions">
          <button className="receipt-print-btn" onClick={() => window.print()}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 4v3H3a2 2 0 00-2 2v5a2 2 0 002 2h2v2a1 1 0 001 1h8a1 1 0 001-1v-2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2V4a1 1 0 00-1-1H6a1 1 0 00-1 1z" strokeLinecap="round" />
            </svg>
            Print Receipt
          </button>
          <button className="receipt-home-btn" onClick={() => navigate('/dashboard', { replace: true })}>
            Go to Dashboard
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Receipt;