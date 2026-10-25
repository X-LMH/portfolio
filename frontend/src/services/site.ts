import { articles, defaultProfile, moments } from "../mocks/content";
import type { Profile, SiteService } from "../types/site";
import { readStorage, writeStorage } from "./storage";

const key = "personal-space-profile";
let sessionProfile: Profile | undefined;
function loadProfile(): Profile {
  const profile = { ...defaultProfile };
  try {
    const value: unknown = JSON.parse(readStorage(key) ?? "null");
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const field of Object.keys(profile) as (keyof Profile)[]) {
        const item = (value as Record<string, unknown>)[field];
        if (typeof item === "string") profile[field] = item.slice(0, 400);
      }
    }
  } catch {
    /* Invalid saved content uses the default profile. */
  }
  return profile;
}

// Replace this implementation with an HTTP adapter when a backend is available.
// Components and composables depend only on the SiteService contract.
export const siteService: SiteService = {
  async getProfile() {
    sessionProfile ??= loadProfile();
    return { ...sessionProfile };
  },
  async getArticles() {
    return structuredClone(articles);
  },
  async getArticle(id) {
    return structuredClone(
      articles.find((article) => article.id === id) ?? null,
    );
  },
  async getMoments() {
    return structuredClone(moments);
  },
  async saveProfile(profile) {
    sessionProfile = { ...profile };
    return {
      profile: { ...sessionProfile },
      persisted: writeStorage(key, JSON.stringify(sessionProfile)),
    };
  },
  async resetProfile() {
    sessionProfile = { ...defaultProfile };
    return {
      profile: { ...sessionProfile },
      persisted: writeStorage(key, null),
    };
  },
};
