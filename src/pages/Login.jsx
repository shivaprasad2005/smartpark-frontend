import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(email, password);

      if (response.data?.token) {
        loginUser(response.data.token, response.data.user);
        if (response.data.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
        return;
      }
      setError('Login failed. Please try again.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to log in. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background grid */}
      <div className="login-grid" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="grid-line" />
        ))}
      </div>

      <div className="login-glow glow-1" aria-hidden="true" />
      <div className="login-glow glow-2" aria-hidden="true" />

      <div className="login-container">
        {/* Left panel */}
        <div className="login-left">
          <div className="login-brand">
            <div className="brand-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <rect x="4" y="16" width="32" height="18" rx="4" fill="currentColor" opacity="0.15" />
                <rect x="8" y="20" width="6" height="10" rx="2" fill="currentColor" opacity="0.8" />
                <rect x="18" y="20" width="6" height="10" rx="2" fill="currentColor" opacity="0.8" />
                <rect x="28" y="20" width="6" height="10" rx="2" fill="currentColor" opacity="0.8" />
                <path d="M4 20 L20 8 L36 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="20" cy="14" r="2" fill="currentColor" />
              </svg>
            </div>
            <span className="brand-name">SmartPark</span>
          </div>

          <div className="login-hero">
            <h1>
              Reserve your<br />
              <span className="hero-accent">spot</span> in seconds.
            </h1>
            <p>Real-time parking slot reservation. Book, pay, and park — all from one dashboard.</p>
          </div>

          <div className="login-features">
            <div className="feature-item">
              <span className="feature-dot dot-green" />
              <span>Live slot availability</span>
            </div>
            <div className="feature-item">
              <span className="feature-dot dot-blue" />
              <span>Instant booking confirmation</span>
            </div>
            <div className="feature-item">
              <span className="feature-dot dot-purple" />
              <span>Secure UPI payment</span>
            </div>
          </div>
        </div>

        {/* Right panel - form */}
        <div className="login-right">
          <div className="login-form-wrap">
            <div className="form-header">
              <h2>Welcome back</h2>
              <p>Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="field-group">
                <label className="field-label">Email address</label>
                <div className="field-input-wrap">
                  <span className="field-icon">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2.5 6.5l7.5 5 7.5-5M2.5 5.5h15a1 1 0 011 1v8a1 1 0 01-1 1h-15a1 1 0 01-1-1v-8a1 1 0 011-1z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="field-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="field-input-wrap">
                  <span className="field-icon">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="9" width="14" height="9" rx="2" strokeLinecap="round" />
                      <path d="M6.5 9V6.5a3.5 3.5 0 017 0V9" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="field-input"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="field-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" strokeLinecap="round" />
                        <circle cx="10" cy="10" r="2" />
                        <path d="M3 3l14 14" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" strokeLinecap="round" />
                        <circle cx="10" cy="10" r="2" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="form-error">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner" />
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <p className="form-switch">
              Don't have an account?{' '}
              <Link to="/register" className="form-link">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;