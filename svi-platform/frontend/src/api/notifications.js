import { request } from "./client";

export function fetchNotifications() {
  return request("/notifications/");
}

export function markNotificationRead(id) {
  return request(`/notifications/${id}/read/`, { method: "POST" });
}

export function markAllNotificationsRead() {
  return request("/notifications/read-all/", { method: "POST" });
}
