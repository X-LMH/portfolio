import { ref } from "vue";
import { siteService } from "../services/site";
import type { Profile } from "../types/site";
export function useProfile() {
  const profile = ref<Profile | null>(null);
  return {
    profile,
    async loadProfile() {
      profile.value = await siteService.getProfile();
    },
    async saveProfile(value: Profile) {
      const result = await siteService.saveProfile(value);
      profile.value = result.profile;
      return result.persisted;
    },
    async resetProfile() {
      const result = await siteService.resetProfile();
      profile.value = result.profile;
      return result.persisted;
    },
  };
}
