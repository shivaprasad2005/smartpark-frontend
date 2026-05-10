import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getParkingSlots } from '../services/parkingService';
import './ParkingSlots.css';

const DURATIONS = [
  { label: '30 mins', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: '4 hours', value: 240 },
  { label: '8 hours', value: 480 },
];

const PRICE_PER_SLOT = 10;

function ParkingSlots() {
  const navigate = useNavigate();
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return null; }
  })();

  const [slots, setSlots] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedTime = date && time ? new Date(`${date}T${time}:00`).toISOString() : '';
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getParkingSlots(user?.id, selectedTime || undefined);

        // Sort A1 → A10 numerically
        const sorted = (response.data || []).sort((a, b) => {
          const numA = parseInt(a.slotNumber.replace(/\D/g, ''));
          const numB = parseInt(b.slotNumber.replace(/\D/g, ''));
          return numA - numB;
        });

        setSlots(sorted);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load parking slots.');
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [selectedTime, user?.id]);

  const toggle = (slot) => {
    if (slot.status !== 'available' && !selectedIds.includes(slot._id)) return;
    setSelectedIds((prev) =>
      prev.includes(slot._id)
        ? prev.filter((id) => id !== slot._id)
        : [...prev, slot._id]
    );
  };

  const selectedSlots = slots.filter((s) => selectedIds.includes(s._id));
  const durationUnits = Math.ceil(duration / 30); // 30min=1, 1hr=2, 2hr=4 etc
  const total = selectedSlots.length * PRICE_PER_SLOT * durationUnits;
  const proceed = () => {
    if (!selectedSlots.length) { setError('Select at least one available slot.'); return; }
    if (!selectedTime) { setError('Choose a date and time before proceeding.'); return; }
    navigate('/confirm-booking', {
      state: {
        slots: selectedSlots,
        startTime: selectedTime,
        duration: duration,
        amount: total,
      },
    });
  };

  const getSlotStatusLabel = (slot) => {
    if (slot.status === 'booked') return 'Booked';
    if (slot.status === 'reserved') return 'Reserved';
    return 'Free';
  };

  return (
    <div className="slots-page">
      <div className="slots-glow sg1" />
      <div className="slots-glow sg2" />

      <div className="slots-shell">

        {/* Top bar */}
        <div className="slots-topbar">
          <button className="slots-back-btn" onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>

          <div className="slots-topbar-title">
            <svg viewBox="0 0 40 40" fill="none" className="slots-topbar-icon">
              <rect x="4" y="16" width="32" height="18" rx="4" fill="currentColor" opacity="0.15" />
              <rect x="8" y="20" width="6" height="10" rx="2" fill="currentColor" opacity="0.8" />
              <rect x="18" y="20" width="6" height="10" rx="2" fill="currentColor" opacity="0.8" />
              <rect x="28" y="20" width="6" height="10" rx="2" fill="currentColor" opacity="0.8" />
              <path d="M4 20 L20 8 L36 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span>SmartPark</span>
          </div>

          <div className="slots-user-badge">
            <div className="slots-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <span>{user?.name}</span>
          </div>
        </div>

        <div className="slots-body">

          {/* ── Left Panel ── */}
          <div className="slots-left">
            <div className="slots-heading-wrap">
              <p className="slots-eyebrow">Area A — Ground Floor</p>
              <h1 className="slots-heading">
                Reserve your<br />
                <span>parking slot</span>
              </h1>
              <p className="slots-subtext">
                Pick a date, time & duration. Select your preferred slots and confirm instantly.
              </p>
            </div>

            {/* Schedule */}
            <div className="slots-filters-card">
              <h3 className="slots-filters-title">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="10" cy="10" r="7.5" />
                  <path d="M10 6v4l2.5 2.5" strokeLinecap="round" />
                </svg>
                Schedule
              </h3>

              <div className="slots-filters">
                <div className="slots-filter-field">
                  <label>Date</label>
                  <input
                    type="date"
                    className="slots-input"
                    value={date}
                    min={todayStr}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="slots-filter-field">
                  <label>Time</label>
                  <input
                    type="time"
                    className="slots-input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>

                <div className="slots-filter-field slots-filter-full">
                  <label>Duration</label>
                  <div className="slots-duration-pills">
                    {DURATIONS.map((d) => (
                      <button
                        key={d.value}
                        className={`slots-duration-pill ${duration === d.value ? 'pill-active' : ''}`}
                        onClick={() => setDuration(d.value)}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="slots-legend">
              <div className="legend-item">
                <span className="legend-dot ld-available" />
                <span>Available</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot ld-selected" />
                <span>Selected</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot ld-booked" />
                <span>Booked</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot ld-reserved" />
                <span>Reserved (future)</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="slots-price-note">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10" cy="10" r="7.5" />
                <path d="M10 6v8M7.5 8.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5S11.38 11 10 11s-2.5 1.12-2.5 2.5S8.62 16 10 16"
                  strokeLinecap="round" />
              </svg>
              <span>₹{PRICE_PER_SLOT} per slot · Per booking</span>
            </div>
          </div>

          {/* ── Right Panel ── */}
          <div className="slots-right">

            {/* Grid card */}
            <div className="slots-grid-card">
              <div className="slots-grid-header">
                <h2>Parking Grid</h2>
                {loading && (
                  <div className="slots-loader">
                    <span className="slots-spinner" />
                    Loading…
                  </div>
                )}
              </div>

              {error && (
                <div className="slots-error">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="slots-grid">
                {slots.length === 0 && !loading ? (
                  <div className="slots-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round" />
                    </svg>
                    <p>No slots found. Ask an admin to create slots.</p>
                  </div>
                ) : (
                  slots.map((slot) => {
                    const isSelected = selectedIds.includes(slot._id);
                    const isBooked = slot.status === 'booked';
                    const isReserved = slot.status === 'reserved';
                    const isMine = slot.isMine;

                    return (
                      <button
                        key={slot._id}
                        className={`slot-btn
                          ${isSelected ? 'slot-selected'
                            : isBooked ? 'slot-booked'
                            : isReserved ? 'slot-reserved'
                            : 'slot-available'}
                          ${isMine ? 'slot-mine' : ''}`}
                        onClick={() => toggle(slot)}
                        disabled={(isBooked || isReserved) && !isSelected}
                        title={
                          slot.startTime
                            ? `From: ${new Date(slot.startTime).toLocaleString()}`
                            : slot.slotNumber
                        }
                      >
                        <span className="slot-number">{slot.slotNumber}</span>
                        <span className="slot-status-label">{getSlotStatusLabel(slot)}</span>
                        {isMine && <span className="slot-mine-badge">Mine</span>}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Booking Summary / Cart */}
            <div className="slots-cart">
              <div className="cart-header">
                <div className="cart-title">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h12"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Booking Summary
                </div>
                {selectedSlots.length > 0 && (
                  <span className="cart-count">
                    {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {selectedSlots.length === 0 ? (
                <p className="cart-empty">No slots selected yet</p>
              ) : (
                <>
                  <div className="cart-slots">
                    {selectedSlots.map((s) => (
                      <span key={s._id} className="cart-tag">
                        {s.slotNumber}
                        <button className="cart-remove" onClick={() => toggle(s)}>×</button>
                      </span>
                    ))}
                  </div>

                  {selectedTime && (
                    <div className="cart-detail">
                      <div className="cart-detail-row">
                        <span>Date & Time</span>
                        <span>
                          {new Date(selectedTime).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                      <div className="cart-detail-row">
                        <span>Duration</span>
                        <span>{DURATIONS.find((d) => d.value === duration)?.label}</span>
                      </div>
                      <div className="cart-detail-row cart-total-row">
                        <span>Total</span>
                        <span className="cart-amount">₹{total}</span>
                      </div>
                    </div>
                  )}

                  <button className="cart-proceed-btn" onClick={proceed}>
                    Proceed to Payment
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ParkingSlots;