import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import sviLogo from "../assets/svi-logo.jpg";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setStatus("error");
      setErrorMsg("Enter your email and password to continue.");
      return;
    }

    setStatus("loading");
    try {
      const user = await login(email, password);
      navigate(user.role === "mentor" ? "/mentor" : "/mentee", { replace: true });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Couldn't sign you in. Check your details and try again.");
    }
  };

  return (
    <div className="svi-shell">
      <aside className="svi-brand" aria-hidden="true">
        <div className="svi-brand__grid" />
        <div className="svi-brand__glow" />

        <div className="svi-brand__content">
          <div className="svi-brand__mark">
            <GlobeMark />
            <span className="svi-brand__wordmark">SVI</span>
          </div>

          <div className="svi-brand__copy">
            <h1>
              Global reach.
              <br />
              Local precision.
            </h1>
            <p>One network, every coordinate. Sign in to track, manage, and move with SVI.</p>
          </div>

          <dl className="svi-brand__coords">
            <div>
              <dt>Origin</dt>
              <dd>13.7563&deg; N, 100.5018&deg; E</dd>
            </div>
            <div>
              <dt>Network status</dt>
              <dd>
                <span className="svi-dot" /> Online
              </dd>
            </div>
          </dl>
        </div>
      </aside>

      <main className="svi-form-panel">
        <div className="svi-form-card">
          <img className="svi-form-card__logo" src={sviLogo} alt="SVI" />

          <div className="svi-form-card__heading">
            <h2>Sign in</h2>
            <p>Welcome back. Enter your details to access your account.</p>
          </div>

          <form className="svi-form" onSubmit={handleSubmit} noValidate>
            <label className="svi-field">
              <span className="svi-field__label">Email address</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="svi-field__input"
              />
            </label>

            <label className="svi-field">
              <span className="svi-field__label">Password</span>
              <div className="svi-field__input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="svi-field__input"
                />
                <button
                  type="button"
                  className="svi-field__toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </label>

            {status === "error" && errorMsg && (
              <p className="svi-form__error" role="alert">
                {errorMsg}
              </p>
            )}

            <div className="svi-form__row">
              <label className="svi-checkbox">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <a href="#forgot-password" className="svi-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="svi-submit" disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <span className="svi-spinner" aria-hidden="true" />
                  Signing in&hellip;
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="svi-form-card__footer">
            Need an account? <a href="#request-access" className="svi-link">Request access</a>
          </p>

          <p className="svi-form-card__footer" style={{ opacity: 0.7 }}>
            Demo login: any seeded employee number
            <br />
            e.g. <code>55169@svi.demo</code> / <code>password123</code>
          </p>
        </div>
      </main>
    </div>
  );
}

function GlobeMark() {
  return (
    <svg className="svi-globe-mark" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="17.5" stroke="currentColor" strokeWidth="1.6" />
      <ellipse cx="20" cy="20" rx="8" ry="17.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="2.5" y1="20" x2="37.5" y2="20" stroke="currentColor" strokeWidth="1.6" />
      <line x1="4.3" y1="12.5" x2="35.7" y2="12.5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="4.3" y1="27.5" x2="35.7" y2="27.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M10.6 5.2A9.9 9.9 0 0 1 12 5c6.4 0 10 7 10 7a16.7 16.7 0 0 1-3.5 4.3M6.6 6.6C4 8.3 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 4.4-1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1 14.1a3 3 0 1 1-4.2-4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
