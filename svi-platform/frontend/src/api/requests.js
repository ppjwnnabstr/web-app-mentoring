import { request } from "./client";

export function sendMentorRequest(mentorId, message = "") {
  return request("/requests/", { method: "POST", body: { mentor_id: mentorId, message } });
}

export function fetchMyMentorRequests(status = "p") {
  const q = status ? `?status=${status}` : "";
  return request(`/requests/mine/${q}`);
}

export function acceptRequest(requestId) {
  return request(`/requests/${requestId}/accept/`, { method: "POST" });
}

export function rejectRequest(requestId) {
  return request(`/requests/${requestId}/reject/`, { method: "POST" });
}

export function fetchMyMentorships() {
  return request("/mentorships/mine/");
}
