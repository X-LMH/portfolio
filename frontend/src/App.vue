<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import SiteNavigation from "./components/SiteNavigation.vue";
import HomeSection from "./components/HomeSection.vue";
import ArticlesSection from "./components/ArticlesSection.vue";
import MomentsSection from "./components/MomentsSection.vue";
import AboutSection from "./components/AboutSection.vue";
import ArticleReader from "./components/ArticleReader.vue";
import ProfileEditor from "./components/ProfileEditor.vue";
import ToastMessage from "./components/ToastMessage.vue";
import { useProfile } from "./composables/useProfile";
import { useTheme } from "./composables/useTheme";
import { useSectionNavigation } from "./composables/useSectionNavigation";
import { siteService } from "./services/site";
import type { Article, Moment, Profile } from "./types/site";

const { profile, loadProfile, saveProfile, resetProfile } = useProfile();
const { dark, toggleTheme } = useTheme();
const ready = ref(false);
const { current } = useSectionNavigation(ready);
const articles = ref<Article[]>([]);
const moments = ref<Moment[]>([]);
const selectedArticle = ref<Article | null>(null);
const editing = ref(false);
const busy = ref(false);
const error = ref(false);
const message = ref("");
let toastTimer: ReturnType<typeof setTimeout>;
function notify(value: string) {
  message.value = value;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (message.value = ""), 3200);
}
async function load() {
  error.value = false;
  try {
    const [, nextArticles, nextMoments] = await Promise.all([
      loadProfile(),
      siteService.getArticles(),
      siteService.getMoments(),
    ]);
    articles.value = nextArticles;
    moments.value = nextMoments;
    ready.value = true;
  } catch {
    error.value = true;
  }
}
async function read(id: string) {
  try {
    selectedArticle.value = await siteService.getArticle(id);
    if (!selectedArticle.value) notify("这篇文字暂时找不到了。");
  } catch {
    notify("文章暂时无法打开，请稍后再试。");
  }
}
function contact() {
  if (!profile.value?.email) {
    editing.value = true;
    notify("先填写你的邮箱");
  } else location.href = "mailto:" + encodeURIComponent(profile.value.email);
}
async function save(value: Profile) {
  busy.value = true;
  try {
    const persisted = await saveProfile(value);
    editing.value = false;
    notify(
      persisted
        ? "资料已保存在当前浏览器"
        : "本次预览已更新，浏览器未允许长期保存",
    );
  } catch {
    notify("资料暂时无法保存，请稍后再试。");
  } finally {
    busy.value = false;
  }
}
async function reset() {
  busy.value = true;
  try {
    const persisted = await resetProfile();
    editing.value = false;
    notify(
      persisted ? "已恢复示例资料" : "本次预览已恢复，浏览器未允许长期保存",
    );
  } catch {
    notify("暂时无法恢复资料，请稍后再试。");
  } finally {
    busy.value = false;
  }
}
function toggle() {
  if (!toggleTheme()) notify("主题已切换，浏览器未允许长期保存");
}
onMounted(load);
onBeforeUnmount(() => clearTimeout(toastTimer));
</script>

<template>
  <template v-if="ready && profile">
    <SiteNavigation
      :name="profile.name"
      :current="current"
      :dark="dark"
      @theme="toggle"
    />
    <main>
      <HomeSection :name="profile.name" @contact="contact" /><ArticlesSection
        :articles="articles"
        @read="read"
      /><MomentsSection :moments="moments" /><AboutSection
        :profile="profile"
        @contact="contact"
        @edit="editing = true"
      />
    </main>
    <ArticleReader :article="selectedArticle" @close="selectedArticle = null" />
    <ProfileEditor
      :open="editing"
      :profile="profile"
      :busy="busy"
      @close="editing = false"
      @save="save"
      @reset="reset"
    />
  </template>
  <main v-else class="load-state" role="status">
    <template v-if="error"
      ><p>小站暂时没有准备好。</p>
      <button class="text-link" @click="load">再试一次</button></template
    >
    <p v-else>小站正在展开…</p>
  </main>
  <ToastMessage :message="message" />
</template>
