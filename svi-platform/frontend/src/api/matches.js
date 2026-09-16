import { request } from "./client";

export function fetchMyMatches(limit = 4) {
  return request(`/matches/mine/?limit=${limit}`);
}
