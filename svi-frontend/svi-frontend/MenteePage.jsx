import React, { useState } from "react";
import "./MenteePage.css";
import sviLogo from "./svi-logo.jpg";

/**
 * SVI Mentee Page
 * Shows the mentee's top mentor matches as four cards, each with a
 * match-score ring (echoing the SVI globe mark) and a select action.
 */

const MENTORS = [
  {
    id: "m1",
    name: "Anong Suwannarat",
    title: "Director, Supply Chain Strategy",
    location: "Bangkok, TH",
    match: 94,
    tags: ["Supply Chain", "Ops Strategy", "Vendor Mgmt"],
    initials: "AS",
  },
  {
    id: "m2",
    name: "Rajiv Menon",
    title: "Head of Trade Compliance",
    location: "Singapore",
    match: 88,
    tags: ["Trade Compliance", "Customs", "Risk"],
    initials: "RM",
  },
  {
    id: "m3",
    name: "Elena Kovacs",
    title: "VP, International Finance",
    location: "Rotterdam, NL",
    match: 81,
    tags: ["Finance", "FX Risk", "Forecasting"],
    initials: "EK",
  },
  {
    id: "m4",
    name: "David Okafor",
    title: "Senior Manager, Logistics Ops",
    location: "Lagos, NG",
    match: 76,
    tags: ["Logistics", "Freight", "Process"],
    initials: "DO",
  },
];

export default function MenteePage({ menteeName = "Nara", onSelectMentor }) {
  const [selectedId, setSelectedId] = useState(null);
  const [pendingId, setPendingId] = useState(null);

  const handleSelect = async (mentor) => {
    setPendingId(mentor.id);
    try {
      if (onSelectMentor) {
        await onSelectMentor(mentor);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
      setSelectedId(mentor.id);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="svi-mentee">
      <header className="svi-mentee__header">
        <div className="svi-mentee__brand">
          <img src={sviLogo} alt="SVI" className="svi-mentee__logo" />
        </div>
        <div className="svi-mentee__account" aria-hidden="true">
          <span className="svi-mentee__avatar">
            {menteeName.slice(0, 1).toUpperCase()}
          </span>
        </div>
      </header>

      <main className="svi-mentee__main">
        <div className="svi-mentee__intro">
          <span className="svi-eyebrow">Mentor matching</span>
          <h1>
            Your top matches, {menteeName}
          </h1>
          <p>
            Ranked by fit across goals, expertise, and availability. Select a
            mentor to send a connection request.
          </p>
        </div>

        <div className="svi-mentor-grid">
          {MENTORS.map((mentor) => {
            const isSelected = selectedId === mentor.id;
            const isPending = pendingId === mentor.id;

            return (
              <article className="svi-mentor-card" key={mentor.id}>
                <div className="svi-mentor-card__top">
                  <div className="svi-mentor-card__person">
                    <span className="svi-mentor-card__initials">
                      {mentor.initials}
                    </span>
                    <div>
                      <h2>{mentor.name}</h2>
                      <p className="svi-mentor-card__title">{mentor.title}</p>
                      <p className="svi-mentor-card__location">
                        {mentor.location}
                      </p>
                    </div>
                  </div>

                  <MatchRing value={mentor.match} />
                </div>

                <ul className="svi-mentor-card__tags">
                  {mentor.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={
                    "svi-mentor-card__select" +
                    (isSelected ? " is-selected" : "")
                  }
                  onClick={() => handleSelect(mentor)}
                  disabled={isPending || isSelected}
                >
                  {isSelected
                    ? "Mentor selected"
                    : isPending
                    ? "Sending request…"
                    : "Select mentor"}
                </button>
              </article>
            );
          })}
        </div>
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
        <circle
          cx="32"
          cy="32"
          r={radius}
          className="svi-match-ring__track"
          strokeWidth="5"
          fill="none"
        />
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
