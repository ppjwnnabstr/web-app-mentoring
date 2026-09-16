import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MentorPage.css";
import sviLogo from "../assets/svi-logo.jpg";
import { useAuth } from "../context/AuthContext";
import { fetchMyMentorRequests, acceptRequest, rejectRequest } from "../api/requests";

export default function MentorPage() {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [statusById, setStatusById] = useState({});
  const [pendingId, setPendingId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    fetchMyMentorRequests("p")
      .then(setRequests)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const respond = async (req, decision) => {
    setActionError("");
    setPendingId(req.id);
    try {
      if (decision === "accepted") await acceptRequest(req.id);
      else await rejectRequest(req.id);
      setStatusById((prev) => ({ ...prev, [req.id]: decision }));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setPendingId(null);
    }
  };

  const pendingCount = requests.filter((r) => !statusById[r.id]).length;

  return (
    <div className="svi-mentor-page">
      <header className="svi-mentor-page__header">
        <img src={sviLogo} alt="SVI" className="svi-mentor-page__logo" />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/workspace" className="svi-link" style={{ fontSize: "0.85rem" }}>
            Go to workspace &rarr;
          </Link>
          <button type="button" onClick={logout} className="svi-link" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem" }}>
            Log out
          </button>
          <span className="svi-mentor-page__avatar">{(user?.full_name || "?").slice(0, 1).toUpperCase()}</span>
        </div>
      </header>

      <main className="svi-mentor-page__main">
        <div className="svi-mentor-page__intro">
          <span className="svi-eyebrow">Mentee requests</span>
          <h1>Requests waiting on you{user ? `, ${user.full_name.split(" ")[0]}` : ""}</h1>
          <p>
            {loading
              ? "Loading…"
              : pendingCount > 0
              ? `${pendingCount} request${pendingCount === 1 ? "" : "s"} need${pendingCount === 1 ? "s" : ""} a response.`
              : "You're all caught up."}
          </p>
        </div>

        {loadError && <p className="svi-form__error">{loadError}</p>}
        {actionError && <p className="svi-form__error">{actionError}</p>}

        <div className="svi-request-list">
          {requests.map((req) => {
            const status = statusById[req.id];
            const isPending = pendingId === req.id;
            const mentee = req.mentee;
            const initials = `${mentee.user.first_name?.[0] || ""}${mentee.user.last_name?.[0] || ""}`.toUpperCase();
            const tags = [mentee.interest_1st, mentee.interest_2nd, mentee.interest_3rd].filter(Boolean);
            const overall = req.overall_score != null ? Math.round(req.overall_score) : null;

            return (
              <article className={"svi-request-card" + (status ? ` is-${status === "accepted" ? "accepted" : "declined"}` : "")} key={req.id}>
                <div className="svi-request-card__body">
                  <div className="svi-request-card__person">
                    <span className="svi-request-card__initials">{initials}</span>
                    <div className="svi-request-card__person-info">
                      <h2>{mentee.user.full_name}</h2>
                      <p className="svi-request-card__role">{mentee.goal_1st}</p>
                      <p className="svi-request-card__location">{mentee.user.department || mentee.frequency}</p>
                    </div>
                  </div>

                  {mentee.additional_comment && (
                    <p className="svi-request-card__description">{mentee.additional_comment}</p>
                  )}

                  <ul className="svi-request-card__tags">
                    {tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>

                  {overall != null && (
                    <div className="svi-match-detail">
                      <div className="svi-match-detail__header">
                        <span>Match detail</span>
                        <strong>{overall}% overall</strong>
                      </div>
                      <MatchBar label="Interest match" value={Math.round(req.interest_score)} />
                      <MatchBar label="Goal match" value={Math.round(req.goal_score)} />
                    </div>
                  )}
                </div>

                <aside className="svi-request-card__actions">
                  {overall != null && (
                    <div className="svi-request-card__score">
                      <span className="svi-request-card__score-value">{overall}%</span>
                      <span className="svi-request-card__score-label">match</span>
                    </div>
                  )}

                  {status ? (
                    <div className={`svi-status-pill is-${status === "accepted" ? "accepted" : "declined"}`}>
                      {status === "accepted" ? "Accepted" : "Declined"}
                    </div>
                  ) : (
                    <div className="svi-request-card__buttons">
                      <button
                        type="button"
                        className="svi-btn svi-btn--accept"
                        disabled={isPending}
                        onClick={() => respond(req, "accepted")}
                      >
                        {isPending ? "Sending…" : "Accept"}
                      </button>
                      <button
                        type="button"
                        className="svi-btn svi-btn--reject"
                        disabled={isPending}
                        onClick={() => respond(req, "declined")}
                      >
                        {isPending ? "Sending…" : "Reject"}
                      </button>
                    </div>
                  )}
                </aside>
              </article>
            );
          })}

          {!loading && requests.length === 0 && !loadError && <p>No pending requests right now.</p>}
        </div>
      </main>
    </div>
  );
}

function MatchBar({ label, value }) {
  return (
    <div className="svi-match-bar">
      <div className="svi-match-bar__label">
        <span>{label}</span>
        <span className="svi-match-bar__value">{value}%</span>
      </div>
      <div className="svi-match-bar__track">
        <div className="svi-match-bar__fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
