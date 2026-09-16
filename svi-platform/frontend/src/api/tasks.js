import { request } from "./client";

export function fetchTasks(mentorshipId) {
  return request(`/tasks/?mentorship=${mentorshipId}`);
}

export function createTask(mentorshipId, { task_name, task_detail, due_date }) {
  return request("/tasks/", {
    method: "POST",
    body: { mentorship: mentorshipId, task_name, task_detail, due_date: due_date || null },
  });
}

export function updateTaskStatus(taskId, status) {
  return request(`/tasks/${taskId}/`, { method: "PATCH", body: { status } });
}

export function postTaskUpdate(taskId, note) {
  return request(`/tasks/${taskId}/updates/`, { method: "POST", body: { note } });
}
