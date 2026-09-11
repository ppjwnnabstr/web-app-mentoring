import React, { useState } from "react";
import "./WorkspacePage.css";
import sviLogo from "./svi-logo.jpg";

/**
 * SVI Workspace Page
 * Shared task board for a matched mentor/mentee pair. Mentors assign
 * tasks; either side can move status and post progress updates.
 */

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
      {
        id: "u1",
        author: "Anong Suwannarat",
        role: "mentor",
        note: "Start with your top 5 cross-functional contacts — ops, finance, and demand planning first.",
        time: "3 days ago",
      },
      {
        id: "u2",
        author: "Nara Thanapat",
        role: "mentee",
        note: "Draft is in progress, sharing by Thursday for your review.",
        time: "1 day ago",
      },
    ],
  },
  {
    id: "t2",
    title: "Read: SVI Global Supply Chain Playbook",
    description: "Skim chapters 1–3 and note two ideas you'd want to bring back to your team.",
    status: "completed",
    dueDate: "2026-08-28",
    updates: [
      {
        id: "u3",
        author: "Nara Thanapat",
        role: "mentee",
        note: "Finished — the section on regional buffer stock was especially useful.",
        time: "6 days ago",
      },
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

const PAIR = {
  mentee: { name: "Nara Thanapat", initials: "NT" },
  mentor: { name: "Anong Suwannarat", initials: "AS" },
  matchScore: 94,
  startedLabel: "Started 12 Aug 2026",
};

function formatDue(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function WorkspacePage({ pair = PAIR, tasks: initialTasks = SEED_TASKS, onTasksChange }) {
  const [role, setRole] = useState("mentor"); // "mentor" | "mentee"
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });

  const activeTask = tasks.find((t) => t.id === activeTaskId) || null;
  const counts = STATUS_COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id).length;
    return acc;
  }, {});

  const updateTasks = (updater) => {
    setTasks((prev) => {
      const next = updater(prev);
      onTasksChange?.(next);
      return next;
    });
  };

  const changeStatus = (taskId, status) => {
    updateTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
  };

  const addNote = () => {
    if (!noteDraft.trim() || !activeTaskId) return;
    const author = role === "mentor" ? pair.mentor.name : pair.mentee.name;
    updateTasks((prev) =>
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
    updateTasks((prev) => [
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
        <img src={sviLogo} alt="SVI" className="svi-task__logo" />
        <div className="svi-task__pair">
          <div className="svi-task__pair-people">
            <span className="svi-task__pair-avatar">{pair.mentee.initials}</span>
            <span className="svi-task__pair-link" aria-hidden="true">
              &harr;
            </span>
            <span className="svi-task__pair-avatar svi-task__pair-avatar--mentor">
              {pair.mentor.initials}
            </span>
          </div>
          <div className="svi-task__pair-text">
            <strong>
              {pair.mentee.name} &amp; {pair.mentor.name}
            </strong>
            <span>
              {pair.matchScore}% match · {pair.startedLabel}
            </span>
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
              <button
                type="button"
                className="svi-btn svi-btn--accept svi-task__assign-btn"
                onClick={() => setShowNewTask(true)}
              >
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
              <button
                type="button"
                className="svi-modal__close"
                onClick={() => setActiveTaskId(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {activeTask.description && (
              <p className="svi-modal__description">{activeTask.description}</p>
            )}
            {activeTask.dueDate && <p className="svi-modal__due">Due {formatDue(activeTask.dueDate)}</p>}

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
              {activeTask.updates.length === 0 && <p className="svi-modal__no-updates">No updates yet.</p>}
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
              <button
                type="button"
                className="svi-btn svi-btn--accept"
                onClick={addNote}
                disabled={!noteDraft.trim()}
              >
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
              <button
                type="button"
                className="svi-modal__close"
                onClick={() => setShowNewTask(false)}
                aria-label="Close"
              >
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

              <button type="submit" className="svi-submit">
                Assign task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
