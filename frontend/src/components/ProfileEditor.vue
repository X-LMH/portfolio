<script setup lang="ts">
import { reactive, watch } from "vue";
import type { Profile } from "../types/site";
import BaseDialog from "./BaseDialog.vue";
const props = defineProps<{ open: boolean; profile: Profile; busy: boolean }>();
const emit = defineEmits<{ close: []; save: [profile: Profile]; reset: [] }>();
const draft = reactive({ ...props.profile });
watch(
  () => props.open,
  (open) => {
    if (open) Object.assign(draft, props.profile);
  },
);
const fields: {
  key: keyof Profile;
  label: string;
  type: string;
  max: number;
  required?: boolean;
}[] = [
  { key: "name", label: "姓名 / 昵称", type: "text", max: 24, required: true },
  { key: "role", label: "一句话描述", type: "text", max: 80, required: true },
  { key: "location", label: "所在城市", type: "text", max: 60 },
  { key: "email", label: "联系邮箱", type: "email", max: 100 },
  { key: "bio", label: "个人简介", type: "textarea", max: 300 },
  { key: "about", label: "更多关于你", type: "textarea", max: 400 },
  { key: "now", label: "最近在做什么", type: "text", max: 120 },
];
function submit() {
  const profile = { ...draft };
  for (const key of Object.keys(profile) as (keyof Profile)[])
    profile[key] = profile[key].trim();
  if (!profile.name || !profile.role) return;
  emit("save", profile);
}
</script>
<template>
  <BaseDialog
    class="ps-dialog"
    :open="open"
    labelledby="ps-editor-title"
    @close="$emit('close')"
    ><form class="ps-form" @submit.prevent="submit">
      <div class="ps-dialog-head">
        <div>
          <small>PERSONAL FILE</small>
          <h2 id="ps-editor-title">编辑个人资料</h2>
        </div>
        <button
          type="button"
          class="ps-close"
          aria-label="关闭资料编辑"
          @click="$emit('close')"
        >
          ×
        </button>
      </div>
      <p class="ps-hint">
        更改只保存在当前浏览器。恢复示例可以重新使用小站的初始资料。
      </p>
      <div class="ps-form-grid">
        <label
          v-for="field in fields"
          :key="field.key"
          :class="{ 'ps-wide': field.type === 'textarea' }"
          ><span>{{ field.label }}</span
          ><textarea
            v-if="field.type === 'textarea'"
            v-model="draft[field.key]"
            :name="field.key"
            :maxlength="field.max"
            :aria-label="field.label"
            rows="3"
            :disabled="busy"
          ></textarea
          ><input
            v-else
            v-model="draft[field.key]"
            :name="field.key"
            :type="field.type"
            :maxlength="field.max"
            :aria-label="field.label"
            :required="field.required"
            :disabled="busy"
            :pattern="field.required ? '.*\\S.*' : undefined"
        /></label>
      </div>
      <div class="ps-form-actions">
        <button
          type="button"
          class="ps-text-button"
          :disabled="busy"
          @click="$emit('reset')"
        >
          恢复示例</button
        ><button class="ps-save" type="submit" :disabled="busy">
          {{ busy ? "保存中…" : "保存资料" }}
        </button>
      </div>
    </form></BaseDialog
  >
</template>
