import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate('/login', { replace: true });
  };

  const cards = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="10" width="20" height="11" rx="3" strokeLinecap="round" />
          <path d="M2 13h20M6 13V7a6 6 0 0112 0v6" strokeLinecap="round" />
          <circle cx="9" cy="16.5" r="1" fill="currentColor" />
          <circle cx="15" cy="16.5" r="1" fill="currentColor" />
        </svg>
      ),
      label: 'Browse Slots',
      desc: 'Find & reserve a parking spot',
      color: 'card-blue',
      iconColor: 'icon-blue',
      action: () => navigate('/slots'),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" />
          <rect x="9" y="3" width="6" height="4" rx="1" strokeLinecap="round" />
          <path d="M9 12h6M9 16h4" strokeLinecap="round" />
        </svg>
      ),
      label: 'My Bookings',
      desc: 'View & manage reservations',
      color: 'card-green',
      iconColor: 'icon-green',
      action: () => navigate('/my-bookings'),
    },
  ];

  return (
    <div className="dash-page">
      <div className="dash-glow g1" />
      <div className="dash-glow g2" />

      <div className="dash-shell">

        {/* Header */}
        <header className="dash-header">
          <div className="dash-brand">
            <div className="dash-brand-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <rect x="4" y="16" width="32" height="18" rx="4" fill="currentColor" opacity="0.15" />
                <rect x="8" y="20" width="6" height="10" rx="2" fill="currentColor" opacity="0.8" />
                <rect x="18" y="20" width="6" height="10" rx="2" fill="currentColor" opacity="0.8" />
                <rect x="28" y="20" width="6" height="10" rx="2" fill="currentColor" opacity="0.8" />
                <path d="M4 20 L20 8 L36 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="dash-brand-name">SmartPark</span>
          </div>

          <div className="dash-header-right">
            <div className="dash-user-pill">
              <div className="dash-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
              <div className="dash-user-info">
                <span className="dash-user-name">{user?.name}</span>
                <span className="dash-user-role">
                  {user?.role === 'admin' ? 'Administrator' : 'User'}
                </span>
              </div>
            </div>
            <button className="dash-logout-btn" onClick={handleLogout}>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 3h4a1 1 0 011 1v12a1 1 0 01-1 1h-4M9 14l4-4-4-4M13 10H3"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* Welcome */}
        <div className="dash-welcome">
          <div className="dash-welcome-left">
            <p className="dash-greeting">Good day 👋</p>
            <h1 className="dash-title">
              Welcome back,{' '}
              <span className="dash-name-accent">
                {user?.name?.split(' ')[0]}
              </span>
            </h1>
            <p className="dash-subtitle">
              Manage your parking reservations from one place.
            </p>
          </div>
          <div className="dash-status-badge">
            <span className="dash-status-dot" />
            System Online
          </div>
        </div>

        {/* Action Cards */}
        <div className="dash-cards">
          {cards.map((card) => (
            <button
              key={card.label}
              className={`dash-card ${card.color}`}
              onClick={card.action}
            >
              <div className={`dash-card-icon ${card.iconColor}`}>
                {card.icon}
              </div>
              <div className="dash-card-content">
                <h3>{card.label}</h3>
                <p>{card.desc}</p>
              </div>
              <div className="dash-card-arrow">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 10h12M11 5l5 5-5 5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
          ))}

          {user?.role === 'admin' && (
            <button className="dash-card card-admin" onClick={() => navigate('/admin')}>
              <div className="dash-card-icon icon-purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    strokeLinecap="round" />
                  <circle cx="12" cy="12" r="3" strokeLinecap="round" />
                </svg>
              </div>
              <div className="dash-card-content">
                <h3>Admin Panel</h3>
                <p>Manage slots, bookings & stats</p>
              </div>
              <div className="dash-card-arrow">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 10h12M11 5l5 5-5 5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="dash-footer">
          <div className="dash-info-pill">
            <span className="dash-info-dot dot-green" />
            <span>All systems operational</span>
          </div>
          <div className="dash-info-pill">
            <span className="dash-info-dot dot-blue" />
            <span>Slots update in real-time</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;