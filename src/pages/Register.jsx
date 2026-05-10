import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './Register.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(name, email, password);
      const loginRes = await login(email, password);

      if (loginRes.data?.token) {
        loginUser(loginRes.data.token, loginRes.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-page">
      <div className="reg-glow g1" />
      <div className="reg-glow g2" />
      <div className="reg-glow g3" />

      <div className="reg-container">
        {/* Left brand strip */}
        <div className="reg-left">
          <div className="reg-brand">
            <div className="reg-brand-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <rect x="4" y="16" width="32" height="18" rx="4" fill="currentColor" opacity="0.15" />
                <rect x="8" y="20" width="6" height="10" rx="2" fill="currentColor" opacity="0.8" />
                <rect x="18" y="20" width="6" height="10" rx="2" fill="currentColor" opacity="0.8" />
                <rect x="28" y="20" width="6" height="10" rx="2" fill="currentColor" opacity="0.8" />
                <path d="M4 20 L20 8 L36 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span>SmartPark</span>
          </div>

          <div className="reg-tagline">
            <h1>
              Join the<br />
              <em>smarter</em><br />
              way to park.
            </h1>
            <p>Create your free account and start reserving parking spots in real-time.</p>
          </div>

          <div className="reg-perks">
            <div className="perk">
              <span className="perk-num">01</span>
              <span className="perk-text">Book slots in advance</span>
            </div>
            <div className="perk">
              <span className="perk-num">02</span>
              <span className="perk-text">Track bookings live</span>
            </div>
            <div className="perk">
              <span className="perk-num">03</span>
              <span className="perk-text">Secure UPI payments</span>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="reg-right">
          <div className="reg-form-wrap">
            <div className="reg-form-header">
              <h2>Create account</h2>
              <p>Fill in your details to get started</p>
            </div>

            <form className="reg-form" onSubmit={handleSubmit}>
              <div className="reg-field">
                <label>Full Name</label>
                <div className="reg-input-wrap">
                  <span className="reg-icon">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="10" cy="7" r="3.5" strokeLinecap="round" />
                      <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="reg-input"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="reg-field">
                <label>Email Address</label>
                <div className="reg-input-wrap">
                  <span className="reg-icon">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2.5 6.5l7.5 5 7.5-5M2.5 5.5h15a1 1 0 011 1v8a1 1 0 01-1 1h-15a1 1 0 01-1-1v-8a1 1 0 011-1z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="reg-input"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="reg-field">
                <label>Password</label>
                <div className="reg-input-wrap">
                  <span className="reg-icon">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="9" width="14" height="9" rx="2" strokeLinecap="round" />
                      <path d="M6.5 9V6.5a3.5 3.5 0 017 0V9" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="reg-input"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button type="button" className="reg-eye" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
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
                <div className="reg-error">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" className="reg-btn" disabled={loading}>
                {loading ? (
                  <span className="reg-loading">
                    <span className="reg-spinner" />
                    Creating account...
                  </span>
                ) : (
                  'Create Account →'
                )}
              </button>
            </form>

            <p className="reg-signin">
              Already have an account?{' '}
              <Link to="/login" className="reg-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}