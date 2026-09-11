import React, { useState } from "react";
import "./MentorPage.css";
import sviLogo from "./svi-logo.jpg";

/**
 * SVI Mentor Page
 * Lists incoming mentee requests. Each row shows the mentee's
 * description and a match-detail breakdown, with Accept / Reject
 * actions in a side panel.
 */

const REQUESTS = [
  {
    id: "r1",
    name: "Nara Thanapat",
    role: "Associate, Trade Operations",
    location: "Bangkok, TH",
    initials: "NT",
    match: 94,
    description:
      "Two years into trade operations and looking to move toward supply chain strategy. Wants guidance on cross-functional planning and building a case for a strategy rotation.",
    details: [
      { label: "Goals alignment", value: 96 },
      { label: "Skills overlap", value: 90 },
      { label: "Availability fit", value: 95 },
    ],
    tags: ["Supply Chain", "Ops Strategy", "Career growth"],
  },
  {
    id: "r2",
    name: "Priya Chandran",
    role: "Compliance Analyst",
    location: "Singapore",
    initials: "PC",
    match: 88,
    description:
      "Handles customs documentation for the SEA region and wants a mentor who can speak to trade compliance leadership paths and regional regulatory nuance.",
    details: [
      { label: "Goals alignment", value: 85 },
      { label: "Skills overlap", value: 92 },
      { label: "Availability fit", value: 86 },
    ],
    tags: ["Trade Compliance", "Customs", "Regulatory"],
  },
  {
    id: "r3",
    name: "Marco Villanueva",
    role: "Finance Associate",
    location: "Manila, PH",
    initials: "MV",
    match: 81,
    description:
      "Currently on the treasury team, exploring a move into FX risk management. Looking for perspective on how to build technical depth while staying close to the business.",
    details: [
      { label: "Goals alignment", value: 78 },
      { label: "Skills overlap", value: 80 },
      { label: "Availability fit", value: 84 },
    ],
    tags: ["Finance", "FX Risk", "Treasury"],
  },
  {
    id: "r4",
    name: "Grace Adeyemi",
    role: "Logistics Coordinator",
    location: "Lagos, NG",
    initials: "GA",
    match: 76,
    description:
      "Manages freight scheduling for the West Africa corridor and wants to understand what it takes to move into a logistics operations management role.",
    details: [
      { label: "Goals alignment", value: 74 },
      { label: "Skills overlap", value: 77 },
      { label: "Availability fit", value: 77 },
    ],
    tags: ["Logistics", "Freight", "Ops Management"],
  },
];

export default function MentorPage({ mentorName = "Anong", onRespond }) {
  const [statusById, setStatusById] = useState({});
  const [pendingId, setPendingId] = useState(null);

  const respond = async (request, decision) => {
    setPendingId(request.id);
    try {
      if (onRespond) {
        await onRespond({ request, decision });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      setStatusById((prev) => ({ ...prev, [request.id]: decision }));
    } finally {
      setPendingId(null);
    }
  };

  const pendingCount = REQUESTS.filter((r) => !statusById[r.id]).length;

  return (
    <div className="svi-mentor-page">
      <header className="svi-mentor-page__header">
        <img src={sviLogo} alt="SVI" className="svi-mentor-page__logo" />
        <span className="svi-mentor-page__avatar">
          {mentorName.slice(0, 1).toUpperCase()}
        </span>
      </header>

      <main className="svi-mentor-page__main">
        <div className="svi-mentor-page__intro">
          <span className="svi-eyebrow">Mentee requests</span>
          <h1>Requests waiting on you, {mentorName}</h1>
          <p>
            {pendingCount > 0
              ? `${pendingCount} request${pendingCount === 1 ? "" : "s"} need${
                  pendingCount === 1 ? "s" : ""
                } a response.`
              : "You're all caught up."}
          </p>
        </div>

        <div className="svi-request-list">
          {REQUESTS.map((request) => {
            const status = statusById[request.id];
            const isPending = pendingId === request.id;

            return (
              <article
                className={
                  "svi-request-card" +
                  (status ? ` is-${status}` : "")
                }
                key={request.id}
              >
                <div className="svi-request-card__body">
                  <div className="svi-request-card__person">
                    <span className="svi-request-card__initials">
                      {request.initials}
                    </span>
                    <div className="svi-request-card__person-info">
                      <h2>{request.name}</h2>
                      <p className="svi-request-card__role">
                        {request.role}
                      </p>
                      <p className="svi-request-card__location">
                        {request.location}
                      </p>
                    </div>
                  </div>

                  <p className="svi-request-card__description">
                    {request.description}
                  </p>

                  <ul className="svi-request-card__tags">
                    {request.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>

                  <div className="svi-match-detail">
                    <div className="svi-match-detail__header">
                      <span>Match detail</span>
                      <strong>{request.match}% overall</strong>
                    </div>
                    {request.details.map((d) => (
                      <div className="svi-match-bar" key={d.label}>
                        <div className="svi-match-bar__label">
                          <span>{d.label}</span>
                          <span className="svi-match-bar__value">
                            {d.value}%
                          </span>
                        </div>
                        <div className="svi-match-bar__track">
                          <div
                            className="svi-match-bar__fill"
                            style={{ width: `${d.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <aside className="svi-request-card__actions">
                  <div className="svi-request-card__score">
                    <span className="svi-request-card__score-value">
                      {request.match}%
                    </span>
                    <span className="svi-request-card__score-label">
                      match
                    </span>
                  </div>

                  {status ? (
                    <div className={`svi-status-pill is-${status}`}>
                      {status === "accepted" ? "Accepted" : "Declined"}
                    </div>
                  ) : (
                    <div className="svi-request-card__buttons">
                      <button
                        type="button"
                        className="svi-btn svi-btn--accept"
                        disabled={isPending}
                        onClick={() => respond(request, "accepted")}
                      >
                        {isPending ? "Sending…" : "Accept"}
                      </button>
                      <button
                        type="button"
                        className="svi-btn svi-btn--reject"
                        disabled={isPending}
                        onClick={() => respond(request, "declined")}
                      >
                        {isPending ? "Sending…" : "Reject"}
                      </button>
                    </div>
                  )}
                </aside>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
