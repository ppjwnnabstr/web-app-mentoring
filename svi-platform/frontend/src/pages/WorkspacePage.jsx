import React, { useEffect, useState } from "react";
import "./WorkspacePage.css";
import sviLogo from "../assets/svi-logo.jpg";
import { useAuth } from "../context/AuthContext";
import { fetchMyMentorships } from "../api/requests";
import { fetchTasks, createTask, updateTaskStatus, postTaskUpdate } from "../api/tasks";

const STATUS_COLUMNS = [
  { id: "not_started", label: "Not started" },
  { id: "in_progress", label: "In progress" },
  { id: "completed", label: "Completed" },
];

function formatDue(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function WorkspacePage() {
  const { user } = useAuth();

  const [mentorships, setMentorships] = useState([]);
  const [mentorshipId, setMentorshipId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [activeTaskId, setActiveTaskId] = useState(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });

  useEffect(() => {
    fetchMyMentorships()
      .then((ships) => {
        setMentorships(ships);
        if (ships.length > 0) setMentorshipId(ships[0].id);
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!mentorshipId) return;
    fetchTasks(mentorshipId).then(setTasks).catch((err) => setLoadError(err.message));
  }, [mentorshipId]);

  const activeMentorship = mentorships.find((m) => m.id === mentorshipId);
  const activeTask = tasks.find((t) => t.id === activeTaskId) || null;
  const counts = STATUS_COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id).length;
    return acc;
  }, {});

  const changeStatus = async (taskId, status) => {
    const updated = await updateTaskStatus(taskId, status);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
  };

  const addNote = async () => {
    if (!noteDraft.trim() || !activeTaskId) return;
    const update = await postTaskUpdate(activeTaskId, noteDraft.trim());
    setTasks((prev) =>
      prev.map((t) => (t.id === activeTaskId ? { ...t, updates: [...t.updates, update] } : t))
    );
    setNoteDraft("");
  };

  const submitNewTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !mentorshipId) return;
    const created = await createTask(mentorshipId, {
      task_name: newTask.title.trim(),
      task_detail: newTask.description.trim(),
      due_date: newTask.dueDate,
    });
    setTasks((prev) => [created, ...prev]);
    setNewTask({ title: "", description: "", dueDate: "" });
    setShowNewTask(false);
  };

  if (loading) return <div className="svi-task"><p style={{ padding: "2rem" }}>Loading workspace…</p></div>;
  if (loadError) return <div className="svi-task"><p className="svi-form__error" style={{ margin: "2rem" }}>{loadError}</p></div>;
  if (mentorships.length === 0) {
    return (
      <div className="svi-task">
        <p style={{ padding: "2rem" }}>
          No active mentorship yet — once a request is accepted, its workspace will show up here.
        </p>
      </div>
    );
  }

  const mentorName = activeMentorship?.mentor?.user?.full_name || "Mentor";
  const menteeName = activeMentorship?.mentee?.user?.full_name || "Mentee";
  const mentorInitials = mentorName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const menteeInitials = menteeName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="svi-task">
      <header className="svi-task__header">
        <img src={sviLogo} alt="SVI" className="svi-task__logo" />
        <div className="svi-task__pair">
          <div className="svi-task__pair-people">
            <span className="svi-task__pair-avatar">{menteeInitials}</span>
            <span className="svi-task__pair-link" aria-hidden="true">&harr;</span>
            <span className="svi-task__pair-avatar svi-task__pair-avatar--mentor">{mentorInitials}</span>
          </div>
          <div className="svi-task__pair-text">
            <strong>{menteeName} &amp; {mentorName}</strong>
            <span>Active mentorship</span>
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
            {mentorships.length > 1 && (
              <select value={mentorshipId} onChange={(e) => setMentorshipId(Number(e.target.value))}>
                {mentorships.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.mentee.user.full_name} &harr; {m.mentor.user.full_name}
                  </option>
                ))}
              </select>
            )}

            {user?.role === "mentor" && (
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
                <span className="svi-task__column-count">{counts[col.id] || 0}</span>
              </div>

              <div className="svi-task__column-list">
                {tasks
                  .filter((t) => t.status === col.id)
                  .map((task) => (
                    <button type="button" key={task.id} className="svi-task-card" onClick={() => setActiveTaskId(task.id)}>
                      <h3>{task.task_name}</h3>
                      {task.due_date && <span className="svi-task-card__due">Due {formatDue(task.due_date)}</span>}
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
              <h2>{activeTask.task_name}</h2>
              <button type="button" className="svi-modal__close" onClick={() => setActiveTaskId(null)} aria-label="Close">
                &times;
              </button>
            </div>

            {activeTask.task_detail && <p className="svi-modal__description">{activeTask.task_detail}</p>}
            {activeTask.due_date && <p className="svi-modal__due">Due {formatDue(activeTask.due_date)}</p>}

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
                  <li key={u.id} className={`svi-update svi-update--${u.author_role}`}>
                    <div className="svi-update__meta">
                      <strong>{u.author_name}</strong>
                      <span>{new Date(u.created_at).toLocaleString()}</span>
                    </div>
                    <p>{u.note}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="svi-modal__note-form">
              <textarea
                placeholder={user?.role === "mentor" ? "Leave feedback or guidance…" : "Post a progress update…"}
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
