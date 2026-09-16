import { request } from "./client";

export function login(email, password) {
  return request("/auth/login/", { method: "POST", body: { email, password }, auth: false });
}

export function logout() {
  return request("/auth/logout/", { method: "POST" });
}

export function fetchMe() {
  return request("/auth/me/");
}
