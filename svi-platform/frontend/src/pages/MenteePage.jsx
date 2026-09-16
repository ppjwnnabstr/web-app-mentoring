import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MenteePage.css";
import sviLogo from "../assets/svi-logo.jpg";
import { useAuth } from "../context/AuthContext";
import { fetchMyMatches } from "../api/matches";
import { sendMentorRequest } from "../api/requests";

export default function MenteePage() {
  const { user, logout } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    fetchMyMatches(4)
      .then(setMatches)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (match) => {
    setActionError("");
    setPendingId(match.id);
    try {
      await sendMentorRequest(match.mentor.user.id);
      setSelectedId(match.id);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="svi-mentee">
      <header className="svi-mentee__header">
        <img src={sviLogo} alt="SVI" className="svi-mentee__logo" />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/workspace" className="svi-link" style={{ fontSize: "0.85rem" }}>
            Go to workspace &rarr;
          </Link>
          <button type="button" onClick={logout} className="svi-link" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem" }}>
            Log out
          </button>
          <span className="svi-mentee__avatar">{(user?.full_name || "?").slice(0, 1).toUpperCase()}</span>
        </div>
      </header>

      <main className="svi-mentee__main">
        <div className="svi-mentee__intro">
          <span className="svi-eyebrow">Mentor matching</span>
          <h1>Your top matches{user ? `, ${user.full_name.split(" ")[0]}` : ""}</h1>
          <p>Ranked by fit across goals, expertise, and availability. Select a mentor to send a connection request.</p>
        </div>

        {loading && <p>Loading your matches…</p>}
        {loadError && <p className="svi-form__error">{loadError}</p>}
        {actionError && <p className="svi-form__error">{actionError}</p>}

        {!loading && !loadError && (
          <div className="svi-mentor-grid">
            {matches.map((match) => {
              const mentor = match.mentor;
              const isSelected = selectedId === match.id;
              const isPending = pendingId === match.id;
              const initials = `${mentor.user.first_name?.[0] || ""}${mentor.user.last_name?.[0] || ""}`.toUpperCase();
              const tags = [mentor.exp_1st, mentor.exp_2nd, mentor.exp_3rd].filter(Boolean);

              return (
                <article className="svi-mentor-card" key={match.id}>
                  <div className="svi-mentor-card__top">
                    <div className="svi-mentor-card__person">
                      <span className="svi-mentor-card__initials">{initials}</span>
                      <div>
                        <h2>{mentor.user.full_name}</h2>
                        <p className="svi-mentor-card__title">{mentor.strength_1st}</p>
                        <p className="svi-mentor-card__location">{mentor.user.department || mentor.availability}</p>
                      </div>
                    </div>
                    <MatchRing value={Math.round(match.overall_score)} />
                  </div>

                  <ul className="svi-mentor-card__tags">
                    {tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={"svi-mentor-card__select" + (isSelected ? " is-selected" : "")}
                    onClick={() => handleSelect(match)}
                    disabled={isPending || isSelected}
                  >
                    {isSelected ? "Mentor selected" : isPending ? "Sending request…" : "Select mentor"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function MatchRing({ value }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="svi-match-ring" role="img" aria-label={`${value} percent match`}>
      <svg viewBox="0 0 64 64" width="64" height="64">
        <circle cx="32" cy="32" r={radius} className="svi-match-ring__track" strokeWidth="5" fill="none" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          className="svi-match-ring__value"
          strokeWidth="5"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
        />
      </svg>
      <span className="svi-match-ring__label">
        <strong>{value}</strong>%
      </span>
    </div>
  );
}
