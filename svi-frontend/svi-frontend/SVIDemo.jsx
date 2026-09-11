import React, { useState } from "react";

/* =========================================================================
   SVI Mentorship — combined preview (Login / Mentee / Mentor)
   Single-file version for live preview. Inline SVG logo replaces the
   uploaded .jpg so it can render with no external file dependencies.
   ========================================================================= */

function SviLogo({ height = 30 }) {
  return (
    <svg height={height} viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(52,2)">
        <circle cx="12" cy="12" r="10.5" stroke="#e31e24" strokeWidth="1.6" fill="none" />
        <ellipse cx="12" cy="12" rx="4.8" ry="10.5" stroke="#e31e24" strokeWidth="1.6" fill="none" />
        <line x1="1.7" y1="12" x2="22.3" y2="12" stroke="#e31e24" strokeWidth="1.6" />
        <line x1="2.8" y1="7.2" x2="21.2" y2="7.2" stroke="#e31e24" strokeWidth="1.1" />
        <line x1="2.8" y1="16.8" x2="21.2" y2="16.8" stroke="#e31e24" strokeWidth="1.1" />
      </g>
      <text x="0" y="34" fontFamily="'Space Grotesk',sans-serif" fontWeight="700" fontSize="30" fill="#0b4c8c">
        SVI
      </text>
    </svg>
  );
}

/* ---------------------------------------------------------------- LOGIN */

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState("idle");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    setTimeout(() => setStatus("idle"), 900);
  };

  return (
    <div className="svi-shell">
      <aside className="svi-brand" aria-hidden="true">
        <div className="svi-brand__grid" />
        <div className="svi-brand__glow" />
        <div className="svi-brand__content">
          <div className="svi-brand__mark">
            <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="17.5" stroke="#e31e24" strokeWidth="1.6" />
              <ellipse cx="20" cy="20" rx="8" ry="17.5" stroke="#e31e24" strokeWidth="1.6" />
              <line x1="2.5" y1="20" x2="37.5" y2="20" stroke="#e31e24" strokeWidth="1.6" />
              <line x1="4.3" y1="12.5" x2="35.7" y2="12.5" stroke="#e31e24" strokeWidth="1.2" />
              <line x1="4.3" y1="27.5" x2="35.7" y2="27.5" stroke="#e31e24" strokeWidth="1.2" />
            </svg>
            <span className="svi-brand__wordmark">SVI</span>
          </div>
          <div className="svi-brand__copy">
            <h1>Global reach.<br />Local precision.</h1>
            <p>One network, every coordinate. Sign in to track, manage, and move with SVI.</p>
          </div>
          <dl className="svi-brand__coords">
            <div>
              <dt>Origin</dt>
              <dd>13.7563&deg; N, 100.5018&deg; E</dd>
            </div>
            <div>
              <dt>Network status</dt>
              <dd><span className="svi-dot" /> Online</dd>
            </div>
          </dl>
        </div>
      </aside>

      <main className="svi-form-panel">
        <div className="svi-form-card">
          <SviLogo height={40} />
          <div className="svi-form-card__heading">
            <h2>Sign in</h2>
            <p>Welcome back. Enter your details to access your account.</p>
          </div>

          <form className="svi-form" onSubmit={handleSubmit}>
            <label className="svi-field">
              <span className="svi-field__label">Email address</span>
              <input
                type="email"
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="svi-field__input"
                />
                <button
                  type="button"
                  className="svi-field__toggle"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {status === "error" && (
              <p className="svi-form__error" role="alert">
                Enter your email and password to continue.
              </p>
            )}

            <div className="svi-form__row">
              <label className="svi-checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="svi-link">Forgot password?</a>
            </div>

            <button type="submit" className="svi-submit" disabled={status === "loading"}>
              {status === "loading" ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="svi-form-card__footer">
            Need an account? <a href="#request" className="svi-link">Request access</a>
          </p>
        </div>
      </main>
    </div>
  );
}

/* --------------------------------------------------------------- MENTEE */

const MENTORS = [
  { id: "m1", name: "Anong Suwannarat", title: "Director, Supply Chain Strategy", location: "Bangkok, TH", match: 94, tags: ["Supply Chain", "Ops Strategy", "Vendor Mgmt"], initials: "AS" },
  { id: "m2", name: "Rajiv Menon", title: "Head of Trade Compliance", location: "Singapore", match: 88, tags: ["Trade Compliance", "Customs", "Risk"], initials: "RM" },
  { id: "m3", name: "Elena Kovacs", title: "VP, International Finance", location: "Rotterdam, NL", match: 81, tags: ["Finance", "FX Risk", "Forecasting"], initials: "EK" },
  { id: "m4", name: "David Okafor", title: "Senior Manager, Logistics Ops", location: "Lagos, NG", match: 76, tags: ["Logistics", "Freight", "Process"], initials: "DO" },
];

function MatchRing({ value }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="svi-match-ring" role="img" aria-label={`${value} percent match`}>
      <svg viewBox="0 0 64 64" width="64" height="64">
        <circle cx="32" cy="32" r={radius} className="svi-match-ring__track" strokeWidth="5" fill="none" />
        <circle
          cx="32" cy="32" r={radius} className="svi-match-ring__value" strokeWidth="5" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 32 32)"
        />
      </svg>
      <span className="svi-match-ring__label"><strong>{value}</strong>%</span>
    </div>
  );
}

function MenteePage() {
  const [selectedId, setSelectedId] = useState(null);
  const [pendingId, setPendingId] = useState(null);

  const handleSelect = (mentor) => {
    setPendingId(mentor.id);
    setTimeout(() => {
      setSelectedId(mentor.id);
      setPendingId(null);
    }, 700);
  };

  return (
    <div className="svi-mentee">
      <header className="svi-mentee__header">
        <SviLogo height={28} />
        <span className="svi-mentee__avatar">N</span>
      </header>
      <main className="svi-mentee__main">
        <div className="svi-mentee__intro">
          <span className="svi-eyebrow">Mentor matching</span>
          <h1>Your top matches, Nara</h1>
          <p>Ranked by fit across goals, expertise, and availability. Select a mentor to send a connection request.</p>
        </div>
        <div className="svi-mentor-grid">
          {MENTORS.map((mentor) => {
            const isSelected = selectedId === mentor.id;
            const isPending = pendingId === mentor.id;
            return (
              <article className="svi-mentor-card" key={mentor.id}>
                <div className="svi-mentor-card__top">
                  <div className="svi-mentor-card__person">
                    <span className="svi-mentor-card__initials">{mentor.initials}</span>
                    <div>
                      <h2>{mentor.name}</h2>
                      <p className="svi-mentor-card__title">{mentor.title}</p>
                      <p className="svi-mentor-card__location">{mentor.location}</p>
                    </div>
                  </div>
                  <MatchRing value={mentor.match} />
                </div>
                <ul className="svi-mentor-card__tags">
                  {mentor.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <button
                  type="button"
                  className={"svi-mentor-card__select" + (isSelected ? " is-selected" : "")}
                  onClick={() => handleSelect(mentor)}
                  disabled={isPending || isSelected}
                >
                  {isSelected ? "Mentor selected" : isPending ? "Sending request…" : "Select mentor"}
                </button>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}

/* --------------------------------------------------------------- MENTOR */

const REQUESTS = [
  {
    id: "r1", name: "Nara Thanapat", role: "Associate, Trade Operations", location: "Bangkok, TH", initials: "NT", match: 94,
    description: "Two years into trade operations and looking to move toward supply chain strategy. Wants guidance on cross-functional planning and building a case for a strategy rotation.",
    details: [{ label: "Goals alignment", value: 96 }, { label: "Skills overlap", value: 90 }, { label: "Availability fit", value: 95 }],
    tags: ["Supply Chain", "Ops Strategy", "Career growth"],
  },
  {
    id: "r2", name: "Priya Chandran", role: "Compliance Analyst", location: "Singapore", initials: "PC", match: 88,
    description: "Handles customs documentation for the SEA region and wants a mentor who can speak to trade compliance leadership paths and regional regulatory nuance.",
    details: [{ label: "Goals alignment", value: 85 }, { label: "Skills overlap", value: 92 }, { label: "Availability fit", value: 86 }],
    tags: ["Trade Compliance", "Customs", "Regulatory"],
  },
  {
    id: "r3", name: "Marco Villanueva", role: "Finance Associate", location: "Manila, PH", initials: "MV", match: 81,
    description: "Currently on the treasury team, exploring a move into FX risk management. Looking for perspective on how to build technical depth while staying close to the business.",
    details: [{ label: "Goals alignment", value: 78 }, { label: "Skills overlap", value: 80 }, { label: "Availability fit", value: 84 }],
    tags: ["Finance", "FX Risk", "Treasury"],
  },
  {
    id: "r4", name: "Grace Adeyemi", role: "Logistics Coordinator", location: "Lagos, NG", initials: "GA", match: 76,
    description: "Manages freight scheduling for the West Africa corridor and wants to understand what it takes to move into a logistics operations management role.",
    details: [{ label: "Goals alignment", value: 74 }, { label: "Skills overlap", value: 77 }, { label: "Availability fit", value: 77 }],
    tags: ["Logistics", "Freight", "Ops Management"],
  },
];

function MentorPage() {
  const [statusById, setStatusById] = useState({});
  const [pendingId, setPendingId] = useState(null);

  const respond = (request, decision) => {
    setPendingId(request.id);
    setTimeout(() => {
      setStatusById((prev) => ({ ...prev, [request.id]: decision }));
      setPendingId(null);
    }, 600);
  };

  const pendingCount = REQUESTS.filter((r) => !statusById[r.id]).length;

  return (
    <div className="svi-mentor-page">
      <header className="svi-mentor-page__header">
        <SviLogo height={28} />
        <span className="svi-mentor-page__avatar">A</span>
      </header>
      <main className="svi-mentor-page__main">
        <div className="svi-mentor-page__intro">
          <span className="svi-eyebrow">Mentee requests</span>
          <h1>Requests waiting on you, Anong</h1>
          <p>
            {pendingCount > 0
              ? `${pendingCount} request${pendingCount === 1 ? "" : "s"} need${pendingCount === 1 ? "s" : ""} a response.`
              : "You're all caught up."}
          </p>
        </div>
        <div className="svi-request-list">
          {REQUESTS.map((request) => {
            const status = statusById[request.id];
            const isPending = pendingId === request.id;
            return (
              <article className={"svi-request-card" + (status ? ` is-${status}` : "")} key={request.id}>
                <div className="svi-request-card__body">
                  <div className="svi-request-card__person">
                    <span className="svi-request-card__initials">{request.initials}</span>
                    <div className="svi-request-card__person-info">
                      <h2>{request.name}</h2>
                      <p className="svi-request-card__role">{request.role}</p>
                      <p className="svi-request-card__location">{request.location}</p>
                    </div>
                  </div>
                  <p className="svi-request-card__description">{request.description}</p>
                  <ul className="svi-request-card__tags">
                    {request.tags.map((tag) => <li key={tag}>{tag}</li>)}
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
                          <span className="svi-match-bar__value">{d.value}%</span>
                        </div>
                        <div className="svi-match-bar__track">
                          <div className="svi-match-bar__fill" style={{ width: `${d.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <aside className="svi-request-card__actions">
                  <div className="svi-request-card__score">
                    <span className="svi-request-card__score-value">{request.match}%</span>
                    <span className="svi-request-card__score-label">match</span>
                  </div>
                  {status ? (
                    <div className={`svi-status-pill is-${status}`}>
                      {status === "accepted" ? "Accepted" : "Declined"}
                    </div>
                  ) : (
                    <div className="svi-request-card__buttons">
                      <button type="button" className="svi-btn svi-btn--accept" disabled={isPending} onClick={() => respond(request, "accepted")}>
                        {isPending ? "Sending…" : "Accept"}
                      </button>
                      <button type="button" className="svi-btn svi-btn--reject" disabled={isPending} onClick={() => respond(request, "declined")}>
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

/* ------------------------------------------------------------------- TASK
   WORKSPACE  (page 4 — mentor assigns tasks, mentee updates progress)
   ------------------------------------------------------------------------ */

const PAIR = {
  mentee: { name: "Nara Thanapat", role: "Associate, Trade Operations", initials: "NT" },
  mentor: { name: "Anong Suwannarat", role: "Director, Supply Chain Strategy", initials: "AS" },
  matchScore: 94,
  startedLabel: "Started 12 Aug 2026",
};

const STATUS_COLUMNS = [
  { id: "not_started", label: "Not started" },
  { id: "in_progress", label: "In progress" },
  { id: "completed", label: "Completed" },
];

const SEED_TASKS = [
  {
    id: "t1",
    title: "Stakeholder mapping exercise",
    description:
      "List the 5 cross-functional contacts you'd need for a supply chain strategy rotation, and how you'd approach each one.",
    status: "in_progress",
    dueDate: "2026-09-12",
    updates: [
      { id: "u1", author: "Anong Suwannarat", role: "mentor", note: "Start with your top 5 cross-functional contacts — ops, finance, and demand planning first.", time: "3 days ago" },
      { id: "u2", author: "Nara Thanapat", role: "mentee", note: "Draft is in progress, sharing by Thursday for your review.", time: "1 day ago" },
    ],
  },
  {
    id: "t2",
    title: "Read: SVI Global Supply Chain Playbook",
    description: "Skim chapters 1–3 and note two ideas you'd want to bring back to your team.",
    status: "completed",
    dueDate: "2026-08-28",
    updates: [
      { id: "u3", author: "Nara Thanapat", role: "mentee", note: "Finished — the section on regional buffer stock was especially useful.", time: "6 days ago" },
    ],
  },
  {
    id: "t3",
    title: "Set 90-day rotation goals",
    description: "Draft 2–3 measurable goals for the strategy rotation and bring them to our next session.",
    status: "not_started",
    dueDate: "2026-09-20",
    updates: [],
  },
  {
    id: "t4",
    title: "Shadow a trade compliance review",
    description: "Sit in on one compliance review session with Rajiv's team to see the cross-functional handoff.",
    status: "not_started",
    dueDate: "2026-09-25",
    updates: [],
  },
];

function formatDue(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function TaskWorkspace() {
  const [role, setRole] = useState("mentor"); // "mentor" | "mentee"
  const [tasks, setTasks] = useState(SEED_TASKS);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });

  const activeTask = tasks.find((t) => t.id === activeTaskId) || null;
  const counts = STATUS_COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id).length;
    return acc;
  }, {});

  const changeStatus = (taskId, status) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
  };

  const addNote = () => {
    if (!noteDraft.trim() || !activeTaskId) return;
    const author = role === "mentor" ? PAIR.mentor.name : PAIR.mentee.name;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === activeTaskId
          ? {
              ...t,
              updates: [
                ...t.updates,
                { id: `u${Date.now()}`, author, role, note: noteDraft.trim(), time: "Just now" },
              ],
            }
          : t
      )
    );
    setNoteDraft("");
  };

  const submitNewTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: `t${Date.now()}`,
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        status: "not_started",
        dueDate: newTask.dueDate || null,
        updates: [],
      },
    ]);
    setNewTask({ title: "", description: "", dueDate: "" });
    setShowNewTask(false);
  };

  return (
    <div className="svi-task">
      <header className="svi-task__header">
        <SviLogo height={26} />
        <div className="svi-task__pair">
          <div className="svi-task__pair-people">
            <span className="svi-task__pair-avatar">{PAIR.mentee.initials}</span>
            <span className="svi-task__pair-link" aria-hidden="true">&harr;</span>
            <span className="svi-task__pair-avatar svi-task__pair-avatar--mentor">{PAIR.mentor.initials}</span>
          </div>
          <div className="svi-task__pair-text">
            <strong>{PAIR.mentee.name} &amp; {PAIR.mentor.name}</strong>
            <span>{PAIR.matchScore}% match · {PAIR.startedLabel}</span>
          </div>
        </div>
      </header>

      <main className="svi-task__main">
        <div className="svi-task__toolbar">
          <div className="svi-task__intro">
            <span className="svi-eyebrow">Mentorship workspace</span>
            <h1>Assign and track tasks together</h1>
          </div>

          <div className="svi-task__toolbar-right">
            <div className="svi-role-toggle" role="group" aria-label="Viewing as">
              <button
                type="button"
                className={role === "mentor" ? "is-active" : ""}
                onClick={() => setRole("mentor")}
              >
                Viewing as Mentor
              </button>
              <button
                type="button"
                className={role === "mentee" ? "is-active" : ""}
                onClick={() => setRole("mentee")}
              >
                Viewing as Mentee
              </button>
            </div>

            {role === "mentor" && (
              <button type="button" className="svi-btn svi-btn--accept svi-task__assign-btn" onClick={() => setShowNewTask(true)}>
                + Assign task
              </button>
            )}
          </div>
        </div>

        <div className="svi-task__board">
          {STATUS_COLUMNS.map((col) => (
            <div className="svi-task__column" key={col.id}>
              <div className="svi-task__column-header">
                <span>{col.label}</span>
                <span className="svi-task__column-count">{counts[col.id]}</span>
              </div>

              <div className="svi-task__column-list">
                {tasks
                  .filter((t) => t.status === col.id)
                  .map((task) => (
                    <button
                      type="button"
                      key={task.id}
                      className="svi-task-card"
                      onClick={() => setActiveTaskId(task.id)}
                    >
                      <h3>{task.title}</h3>
                      {task.dueDate && (
                        <span className="svi-task-card__due">Due {formatDue(task.dueDate)}</span>
                      )}
                      {task.updates.length > 0 && (
                        <span className="svi-task-card__updates">
                          {task.updates.length} update{task.updates.length === 1 ? "" : "s"}
                        </span>
                      )}
                    </button>
                  ))}

                {tasks.filter((t) => t.status === col.id).length === 0 && (
                  <p className="svi-task__column-empty">No tasks here</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {activeTask && (
        <div className="svi-modal-overlay" onClick={() => setActiveTaskId(null)}>
          <div className="svi-modal" onClick={(e) => e.stopPropagation()}>
            <div className="svi-modal__header">
              <h2>{activeTask.title}</h2>
              <button type="button" className="svi-modal__close" onClick={() => setActiveTaskId(null)} aria-label="Close">
                &times;
              </button>
            </div>

            {activeTask.description && <p className="svi-modal__description">{activeTask.description}</p>}
            {activeTask.dueDate && (
              <p className="svi-modal__due">Due {formatDue(activeTask.dueDate)}</p>
            )}

            <div className="svi-modal__status-row">
              <span>Status</span>
              <div className="svi-status-switch">
                {STATUS_COLUMNS.map((col) => (
                  <button
                    type="button"
                    key={col.id}
                    className={activeTask.status === col.id ? "is-active" : ""}
                    onClick={() => changeStatus(activeTask.id, col.id)}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="svi-modal__updates">
              <h3>Updates</h3>
              {activeTask.updates.length === 0 && (
                <p className="svi-modal__no-updates">No updates yet.</p>
              )}
              <ul>
                {activeTask.updates.map((u) => (
                  <li key={u.id} className={`svi-update svi-update--${u.role}`}>
                    <div className="svi-update__meta">
                      <strong>{u.author}</strong>
                      <span>{u.time}</span>
                    </div>
                    <p>{u.note}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="svi-modal__note-form">
              <textarea
                placeholder={role === "mentor" ? "Leave feedback or guidance…" : "Post a progress update…"}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                rows={2}
              />
              <button type="button" className="svi-btn svi-btn--accept" onClick={addNote} disabled={!noteDraft.trim()}>
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewTask && (
        <div className="svi-modal-overlay" onClick={() => setShowNewTask(false)}>
          <div className="svi-modal" onClick={(e) => e.stopPropagation()}>
            <div className="svi-modal__header">
              <h2>Assign a new task</h2>
              <button type="button" className="svi-modal__close" onClick={() => setShowNewTask(false)} aria-label="Close">
                &times;
              </button>
            </div>

            <form className="svi-form" onSubmit={submitNewTask}>
              <label className="svi-field">
                <span className="svi-field__label">Title</span>
                <input
                  type="text"
                  className="svi-field__input"
                  placeholder="e.g. Draft your 90-day goals"
                  value={newTask.title}
                  onChange={(e) => setNewTask((v) => ({ ...v, title: e.target.value }))}
                />
              </label>

              <label className="svi-field">
                <span className="svi-field__label">Description</span>
                <textarea
                  className="svi-field__input"
                  rows={3}
                  placeholder="What should they do, and why it matters"
                  value={newTask.description}
                  onChange={(e) => setNewTask((v) => ({ ...v, description: e.target.value }))}
                />
              </label>

              <label className="svi-field">
                <span className="svi-field__label">Due date</span>
                <input
                  type="date"
                  className="svi-field__input"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask((v) => ({ ...v, dueDate: e.target.value }))}
                />
              </label>

              <button type="submit" className="svi-submit">Assign task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ APP */

export default function SVIDemo() {
  const [tab, setTab] = useState("login");

  return (
    <div className="svi-demo-root">
      <style>{CSS}</style>

      <nav className="svi-demo-nav">
        {[
          { id: "login", label: "1 · Login" },
          { id: "mentee", label: "2 · Mentee" },
          { id: "mentor", label: "3 · Mentor" },
          { id: "tasks", label: "4 · Workspace" },
        ].map((t) => (
          <button
            key={t.id}
            className={"svi-demo-nav__btn" + (tab === t.id ? " is-active" : "")}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="svi-demo-frame">
        {tab === "login" && <LoginPage />}
        {tab === "mentee" && <MenteePage />}
        {tab === "mentor" && <MentorPage />}
        {tab === "tasks" && <TaskWorkspace />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ CSS */

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap");

.svi-demo-root {
  --svi-navy-deep: #071b30;
  --svi-navy: #0b4c8c;
  --svi-navy-strong: #0a3a6b;
  --svi-red: #e31e24;
  --svi-red-strong: #c11319;
  --svi-paper: #f6f7f9;
  --svi-ink: #0b2033;
  --svi-ink-soft: #5b6b7c;
  --svi-line: #e3e7ec;
  --svi-white: #ffffff;
  --svi-green: #1f9d55;
  --svi-green-bg: rgba(31, 157, 85, 0.08);
  --svi-red-bg: rgba(227, 30, 36, 0.07);
  --font-display: "Space Grotesk", "Inter", system-ui, sans-serif;
  --font-body: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  font-family: var(--font-body);
  color: var(--svi-ink);
}

.svi-demo-nav {
  display: flex;
  gap: 0.4rem;
  padding: 0.6rem;
  background: var(--svi-navy-deep);
}
.svi-demo-nav__btn {
  flex: 1;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.6);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  padding: 0.55rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
}
.svi-demo-nav__btn:hover { color: #fff; background: rgba(255,255,255,0.08); }
.svi-demo-nav__btn.is-active { color: #fff; background: var(--svi-navy); }

.svi-demo-frame { min-height: 640px; }

/* ---------- Login ---------- */
.svi-shell { min-height: 640px; display: grid; grid-template-columns: minmax(0,1.05fr) minmax(0,1fr); background: var(--svi-paper); }
.svi-brand { position: relative; overflow: hidden; background: radial-gradient(120% 140% at 15% 10%, var(--svi-navy-strong) 0%, var(--svi-navy-deep) 55%, #050f1c 100%); color: #fff; display: flex; align-items: center; padding: 3rem; }
.svi-brand__grid { position: absolute; inset: -10%; background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 64px), repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 64px); -webkit-mask-image: radial-gradient(75% 75% at 30% 35%, black 0%, transparent 75%); mask-image: radial-gradient(75% 75% at 30% 35%, black 0%, transparent 75%); }
.svi-brand__glow { position: absolute; width: 500px; height: 500px; right: -180px; bottom: -220px; border-radius: 50%; background: radial-gradient(circle, rgba(227,30,36,0.28) 0%, rgba(227,30,36,0) 70%); }
.svi-brand__content { position: relative; z-index: 1; max-width: 420px; display: flex; flex-direction: column; gap: 2.2rem; }
.svi-brand__mark { display: flex; align-items: center; gap: 0.6rem; }
.svi-brand__wordmark { font-family: var(--font-display); font-weight: 700; font-size: 1.3rem; letter-spacing: 0.06em; color: #fff; }
.svi-brand__copy h1 { font-family: var(--font-display); font-weight: 600; font-size: 1.9rem; line-height: 1.15; margin: 0 0 0.8rem; }
.svi-brand__copy p { margin: 0; font-size: 0.92rem; line-height: 1.6; color: rgba(255,255,255,0.72); max-width: 32ch; }
.svi-brand__coords { display: flex; gap: 2rem; margin: 0; padding-top: 1.4rem; border-top: 1px solid rgba(255,255,255,0.14); }
.svi-brand__coords dt { font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.5); margin-bottom: 0.35rem; }
.svi-brand__coords dd { margin: 0; font-family: var(--font-mono); font-size: 0.8rem; color: rgba(255,255,255,0.92); display: flex; align-items: center; gap: 0.4rem; }
.svi-dot { width: 7px; height: 7px; border-radius: 50%; background: #33d17a; box-shadow: 0 0 0 3px rgba(51,209,122,0.22); display: inline-block; }
.svi-form-panel { display: flex; align-items: center; justify-content: center; padding: 3rem 1.5rem; }
.svi-form-card { width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 1.5rem; }
.svi-form-card__heading h2 { font-family: var(--font-display); font-weight: 600; font-size: 1.5rem; margin: 0 0 0.35rem; }
.svi-form-card__heading p { margin: 0; font-size: 0.88rem; color: var(--svi-ink-soft); }
.svi-form { display: flex; flex-direction: column; gap: 1.05rem; }
.svi-field { display: flex; flex-direction: column; gap: 0.4rem; }
.svi-field__label { font-size: 0.78rem; font-weight: 600; }
.svi-field__input { width: 100%; border: 1px solid var(--svi-line); background: #fff; border-radius: 8px; padding: 0.68rem 0.8rem; font-size: 0.9rem; color: var(--svi-ink); outline: none; }
.svi-field__input:focus { border-color: var(--svi-navy); box-shadow: 0 0 0 3px rgba(11,76,140,0.14); }
.svi-field__input-group { position: relative; display: flex; align-items: center; }
.svi-field__input-group .svi-field__input { padding-right: 3.2rem; }
.svi-field__toggle { position: absolute; right: 0.5rem; background: none; border: none; color: var(--svi-ink-soft); font-family: var(--font-mono); font-size: 0.7rem; cursor: pointer; padding: 0.3rem 0.4rem; }
.svi-form__error { margin: -0.3rem 0 0; font-size: 0.8rem; color: var(--svi-red); background: var(--svi-red-bg); border: 1px solid rgba(227,30,36,0.22); border-radius: 7px; padding: 0.5rem 0.65rem; }
.svi-form__row { display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; }
.svi-checkbox { display: inline-flex; align-items: center; gap: 0.45rem; color: var(--svi-ink-soft); cursor: pointer; }
.svi-checkbox input { accent-color: var(--svi-navy); }
.svi-link { color: var(--svi-navy); text-decoration: none; font-weight: 500; }
.svi-link:hover { text-decoration: underline; }
.svi-submit { margin-top: 0.3rem; border: none; border-radius: 8px; padding: 0.75rem 1rem; background: var(--svi-navy); color: #fff; font-weight: 600; font-size: 0.92rem; cursor: pointer; }
.svi-submit:hover:not(:disabled) { background: var(--svi-navy-strong); }
.svi-submit:disabled { opacity: 0.75; cursor: progress; }
.svi-form-card__footer { margin: 0; font-size: 0.84rem; color: var(--svi-ink-soft); text-align: center; }

/* ---------- Mentee ---------- */
.svi-mentee { min-height: 640px; background: var(--svi-paper); }
.svi-mentee__header, .svi-mentor-page__header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 2rem; background: #fff; border-bottom: 1px solid var(--svi-line); }
.svi-mentee__avatar, .svi-mentor-page__avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--svi-navy); color: #fff; font-family: var(--font-display); font-weight: 600; font-size: 0.86rem; display: inline-flex; align-items: center; justify-content: center; }
.svi-mentee__main, .svi-mentor-page__main { max-width: 1080px; margin: 0 auto; padding: 2.5rem 2rem 3.5rem; }
.svi-mentee__intro, .svi-mentor-page__intro { max-width: 600px; margin-bottom: 2.2rem; }
.svi-eyebrow { display: inline-block; font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--svi-red); margin-bottom: 0.65rem; }
.svi-mentee__intro h1, .svi-mentor-page__intro h1 { font-family: var(--font-display); font-weight: 600; font-size: 1.9rem; margin: 0 0 0.55rem; }
.svi-mentee__intro p, .svi-mentor-page__intro p { margin: 0; color: var(--svi-ink-soft); font-size: 0.94rem; line-height: 1.6; }
.svi-mentor-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 1.1rem; }
.svi-mentor-card { display: flex; flex-direction: column; gap: 1.1rem; background: #fff; border: 1px solid var(--svi-line); border-radius: 14px; padding: 1.3rem; }
.svi-mentor-card:hover { border-color: #cfd8e2; box-shadow: 0 12px 24px -18px rgba(11,32,51,0.35); }
.svi-mentor-card__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.6rem; }
.svi-mentor-card__person { display: flex; align-items: flex-start; gap: 0.7rem; min-width: 0; }
.svi-mentor-card__initials, .svi-request-card__initials { flex: none; width: 40px; height: 40px; border-radius: 50%; background: var(--svi-navy-deep); color: #fff; font-family: var(--font-display); font-weight: 600; font-size: 0.8rem; display: inline-flex; align-items: center; justify-content: center; }
.svi-mentor-card__person h2, .svi-request-card__person-info h2 { font-family: var(--font-display); font-weight: 600; font-size: 0.98rem; margin: 0 0 0.15rem; }
.svi-mentor-card__title, .svi-request-card__role { margin: 0; font-size: 0.8rem; color: var(--svi-ink-soft); }
.svi-mentor-card__location, .svi-request-card__location { margin: 0.2rem 0 0; font-family: var(--font-mono); font-size: 0.7rem; color: #92a0ae; }
.svi-match-ring { position: relative; flex: none; width: 60px; height: 60px; display: grid; place-items: center; }
.svi-match-ring svg { position: absolute; inset: 0; }
.svi-match-ring__track { stroke: var(--svi-line); }
.svi-match-ring__value { stroke: var(--svi-red); }
.svi-match-ring__label { position: relative; font-family: var(--font-mono); font-size: 0.64rem; }
.svi-match-ring__label strong { font-size: 0.92rem; font-weight: 600; }
.svi-mentor-card__tags, .svi-request-card__tags { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.4rem; }
.svi-mentor-card__tags li, .svi-request-card__tags li { font-family: var(--font-mono); font-size: 0.68rem; color: var(--svi-navy-strong); background: rgba(11,76,140,0.08); border-radius: 999px; padding: 0.28rem 0.58rem; }
.svi-mentor-card__select { margin-top: auto; border: 1px solid var(--svi-navy); background: var(--svi-navy); color: #fff; font-weight: 600; font-size: 0.84rem; border-radius: 8px; padding: 0.62rem 1rem; cursor: pointer; }
.svi-mentor-card__select:hover:not(:disabled) { background: var(--svi-navy-strong); }
.svi-mentor-card__select.is-selected { background: #fff; color: var(--svi-green); border-color: var(--svi-green); }
.svi-mentor-card__select:disabled { cursor: default; }

/* ---------- Mentor ---------- */
.svi-mentor-page { min-height: 640px; background: var(--svi-paper); }
.svi-request-list { display: flex; flex-direction: column; gap: 1rem; }
.svi-request-card { display: grid; grid-template-columns: 1fr 180px; gap: 1.5rem; background: #fff; border: 1px solid var(--svi-line); border-radius: 14px; padding: 1.4rem; }
.svi-request-card:hover { border-color: #cfd8e2; box-shadow: 0 12px 24px -18px rgba(11,32,51,0.35); }
.svi-request-card.is-accepted { border-color: rgba(31,157,85,0.35); }
.svi-request-card.is-declined { opacity: 0.72; }
.svi-request-card__body { display: flex; flex-direction: column; gap: 0.9rem; min-width: 0; }
.svi-request-card__person { display: flex; align-items: flex-start; gap: 0.7rem; }
.svi-request-card__description { margin: 0; font-size: 0.87rem; line-height: 1.6; }
.svi-match-detail { border-top: 1px solid var(--svi-line); padding-top: 0.8rem; display: flex; flex-direction: column; gap: 0.5rem; }
.svi-match-detail__header { display: flex; align-items: baseline; justify-content: space-between; font-size: 0.76rem; color: var(--svi-ink-soft); }
.svi-match-detail__header strong { font-family: var(--font-mono); color: var(--svi-ink); font-weight: 600; }
.svi-match-bar__label { display: flex; justify-content: space-between; font-size: 0.74rem; color: var(--svi-ink-soft); margin-bottom: 0.28rem; }
.svi-match-bar__value { font-family: var(--font-mono); color: var(--svi-ink); }
.svi-match-bar__track { height: 6px; border-radius: 999px; background: var(--svi-line); overflow: hidden; }
.svi-match-bar__fill { height: 100%; border-radius: 999px; background: var(--svi-red); }
.svi-request-card__actions { border-left: 1px solid var(--svi-line); padding-left: 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; text-align: center; }
.svi-request-card__score-value { font-family: var(--font-display); font-weight: 700; font-size: 1.75rem; line-height: 1; }
.svi-request-card__score-label { font-family: var(--font-mono); font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--svi-ink-soft); margin-top: 0.25rem; display: block; text-align: center; }
.svi-request-card__buttons { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; }
.svi-btn { width: 100%; border-radius: 8px; padding: 0.58rem 0.85rem; font-weight: 600; font-size: 0.82rem; cursor: pointer; }
.svi-btn:disabled { cursor: default; opacity: 0.65; }
.svi-btn--accept { border: 1px solid var(--svi-navy); background: var(--svi-navy); color: #fff; }
.svi-btn--accept:hover:not(:disabled) { background: var(--svi-navy-strong); }
.svi-btn--reject { border: 1px solid var(--svi-line); background: #fff; color: var(--svi-red-strong); }
.svi-btn--reject:hover:not(:disabled) { border-color: var(--svi-red); background: var(--svi-red-bg); }
.svi-status-pill { font-family: var(--font-mono); font-size: 0.72rem; border-radius: 999px; padding: 0.38rem 0.85rem; }
.svi-status-pill.is-accepted { background: var(--svi-green-bg); color: var(--svi-green); }
.svi-status-pill.is-declined { background: var(--svi-red-bg); color: var(--svi-red-strong); }

@media (max-width: 860px) {
  .svi-shell { grid-template-columns: 1fr; }
  .svi-mentor-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .svi-request-card { grid-template-columns: 1fr; }
  .svi-request-card__actions { border-left: none; border-top: 1px solid var(--svi-line); padding-left: 0; padding-top: 1rem; flex-direction: row; justify-content: space-between; }
  .svi-request-card__buttons { flex-direction: row; width: auto; flex: 1; margin-left: 1rem; }
}
@media (max-width: 520px) {
  .svi-mentor-grid { grid-template-columns: 1fr; }
}

/* ---------- Task workspace (page 4) ---------- */
.svi-task { min-height: 640px; background: var(--svi-paper); }
.svi-task__header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 2rem; background: #fff; border-bottom: 1px solid var(--svi-line); flex-wrap: wrap; gap: 0.75rem; }
.svi-task__pair { display: flex; align-items: center; gap: 0.7rem; }
.svi-task__pair-people { display: flex; align-items: center; gap: 0.35rem; }
.svi-task__pair-avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--svi-navy-deep); color: #fff; font-family: var(--font-display); font-weight: 600; font-size: 0.7rem; display: inline-flex; align-items: center; justify-content: center; }
.svi-task__pair-avatar--mentor { background: var(--svi-red); }
.svi-task__pair-link { color: var(--svi-ink-soft); font-size: 0.8rem; }
.svi-task__pair-text { display: flex; flex-direction: column; font-size: 0.78rem; line-height: 1.4; }
.svi-task__pair-text strong { font-family: var(--font-display); font-weight: 600; font-size: 0.85rem; color: var(--svi-ink); }
.svi-task__pair-text span { color: var(--svi-ink-soft); font-family: var(--font-mono); font-size: 0.7rem; }

.svi-task__main { max-width: 1080px; margin: 0 auto; padding: 2.2rem 2rem 3.5rem; }
.svi-task__toolbar { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.75rem; }
.svi-task__intro h1 { font-family: var(--font-display); font-weight: 600; font-size: 1.55rem; margin: 0; }
.svi-task__toolbar-right { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }

.svi-role-toggle { display: inline-flex; background: #fff; border: 1px solid var(--svi-line); border-radius: 999px; padding: 0.2rem; }
.svi-role-toggle button { border: none; background: transparent; font-family: var(--font-mono); font-size: 0.72rem; padding: 0.45rem 0.85rem; border-radius: 999px; cursor: pointer; color: var(--svi-ink-soft); }
.svi-role-toggle button.is-active { background: var(--svi-navy); color: #fff; }

.svi-task__assign-btn { width: auto; padding: 0.55rem 1rem; font-size: 0.82rem; }

.svi-task__board { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 1rem; align-items: start; }
.svi-task__column { background: rgba(11,32,51,0.03); border: 1px solid var(--svi-line); border-radius: 12px; padding: 0.9rem; display: flex; flex-direction: column; gap: 0.7rem; }
.svi-task__column-header { display: flex; align-items: center; justify-content: space-between; font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.04em; text-transform: uppercase; color: var(--svi-ink-soft); padding: 0 0.15rem; }
.svi-task__column-count { background: #fff; border: 1px solid var(--svi-line); border-radius: 999px; padding: 0.05rem 0.5rem; }
.svi-task__column-list { display: flex; flex-direction: column; gap: 0.6rem; min-height: 40px; }
.svi-task__column-empty { margin: 0.2rem 0.15rem; font-size: 0.76rem; color: #9aa6b2; }

.svi-task-card { text-align: left; width: 100%; background: #fff; border: 1px solid var(--svi-line); border-radius: 10px; padding: 0.75rem 0.85rem; cursor: pointer; display: flex; flex-direction: column; gap: 0.35rem; }
.svi-task-card:hover { border-color: #cfd8e2; box-shadow: 0 10px 20px -16px rgba(11,32,51,0.4); }
.svi-task-card h3 { margin: 0; font-family: var(--font-body); font-weight: 600; font-size: 0.86rem; color: var(--svi-ink); }
.svi-task-card__due { font-family: var(--font-mono); font-size: 0.68rem; color: var(--svi-ink-soft); }
.svi-task-card__updates { font-family: var(--font-mono); font-size: 0.66rem; color: var(--svi-navy); }

/* ---------- Modal ---------- */
.svi-modal-overlay { position: fixed; inset: 0; background: rgba(7,27,48,0.5); display: flex; align-items: center; justify-content: center; padding: 1.5rem; z-index: 20; }
.svi-modal { background: #fff; border-radius: 14px; width: 100%; max-width: 460px; max-height: 85vh; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.svi-modal__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.svi-modal__header h2 { margin: 0; font-family: var(--font-display); font-weight: 600; font-size: 1.15rem; }
.svi-modal__close { border: none; background: none; font-size: 1.4rem; line-height: 1; color: var(--svi-ink-soft); cursor: pointer; padding: 0; }
.svi-modal__description { margin: 0; font-size: 0.88rem; color: var(--svi-ink); line-height: 1.55; }
.svi-modal__due { margin: -0.5rem 0 0; font-family: var(--font-mono); font-size: 0.72rem; color: var(--svi-ink-soft); }

.svi-modal__status-row { display: flex; flex-direction: column; gap: 0.5rem; }
.svi-modal__status-row > span { font-size: 0.78rem; font-weight: 600; color: var(--svi-ink); }
.svi-status-switch { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.svi-status-switch button { border: 1px solid var(--svi-line); background: #fff; color: var(--svi-ink-soft); font-family: var(--font-mono); font-size: 0.7rem; padding: 0.4rem 0.7rem; border-radius: 999px; cursor: pointer; }
.svi-status-switch button.is-active { background: var(--svi-navy); border-color: var(--svi-navy); color: #fff; }

.svi-modal__updates h3 { margin: 0 0 0.6rem; font-size: 0.82rem; font-family: var(--font-display); font-weight: 600; }
.svi-modal__updates ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.6rem; }
.svi-modal__no-updates { margin: 0; font-size: 0.8rem; color: var(--svi-ink-soft); }
.svi-update { border-radius: 10px; padding: 0.6rem 0.75rem; background: rgba(11,76,140,0.06); }
.svi-update--mentee { background: rgba(227,30,36,0.06); }
.svi-update__meta { display: flex; justify-content: space-between; font-size: 0.72rem; margin-bottom: 0.25rem; }
.svi-update__meta strong { font-family: var(--font-display); font-weight: 600; color: var(--svi-ink); }
.svi-update__meta span { font-family: var(--font-mono); color: var(--svi-ink-soft); }
.svi-update p { margin: 0; font-size: 0.84rem; color: var(--svi-ink); line-height: 1.5; }

.svi-modal__note-form { display: flex; flex-direction: column; gap: 0.5rem; border-top: 1px solid var(--svi-line); padding-top: 0.9rem; }
.svi-modal__note-form textarea { width: 100%; border: 1px solid var(--svi-line); border-radius: 8px; padding: 0.6rem 0.7rem; font-family: var(--font-body); font-size: 0.85rem; resize: vertical; }
.svi-modal__note-form .svi-btn { width: auto; align-self: flex-end; padding: 0.5rem 1rem; }

@media (max-width: 760px) {
  .svi-task__board { grid-template-columns: 1fr; }
}
`;
