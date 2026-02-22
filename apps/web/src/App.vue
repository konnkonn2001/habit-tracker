<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  checkinToday,
  createHabit,
  deleteHabit,
  listCheckins,
  listHabits,
  patchHabit,
  type Habit,
} from './api';

const habits = ref<Habit[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const newName = ref('');
const newNote = ref('');

const selectedHabitId = ref<string | null>(null);
const checkins = ref<{ date: string }[]>([]);
const checkinsLoading = ref(false);

const selectedHabit = computed(() => habits.value.find(h => h.id === selectedHabitId.value) ?? null);

async function reloadHabits() {
  loading.value = true;
  error.value = null;
  try {
    habits.value = await listHabits();
    // 選択が消えていたら先頭を選ぶ
    if (selectedHabitId.value && !habits.value.some(h => h.id === selectedHabitId.value)) {
      selectedHabitId.value = null;
      checkins.value = [];
    }
  } catch (e: any) {
    error.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
  }
}

async function addHabit() {
  const name = newName.value.trim();
  if (!name) return;

  error.value = null;
  try {
    await createHabit({ name, note: newNote.value.trim() || undefined });
    newName.value = '';
    newNote.value = '';
    await reloadHabits();
  } catch (e: any) {
    error.value = e?.message ?? String(e);
  }
}

async function toggleActive(h: Habit) {
  error.value = null;
  try {
    await patchHabit(h.id, { isActive: !h.isActive });
    await reloadHabits();
  } catch (e: any) {
    error.value = e?.message ?? String(e);
  }
}

async function removeHabit(h: Habit) {
  if (!confirm(`削除しますか？: ${h.name}`)) return;
  error.value = null;
  try {
    await deleteHabit(h.id);
    await reloadHabits();
  } catch (e: any) {
    error.value = e?.message ?? String(e);
  }
}

async function loadCheckins(habitId: string) {
  checkinsLoading.value = true;
  error.value = null;
  try {
    const data = await listCheckins(habitId);
    // 表示は YYYY-MM-DD に整形
    checkins.value = data.map(c => ({ date: c.date.slice(0, 10) }));
  } catch (e: any) {
    error.value = e?.message ?? String(e);
  } finally {
    checkinsLoading.value = false;
  }
}

async function selectHabit(h: Habit) {
  selectedHabitId.value = h.id;
  await loadCheckins(h.id);
}

async function doCheckinToday(h: Habit) {
  error.value = null;
  try {
    await checkinToday(h.id);
    await loadCheckins(h.id);
  } catch (e: any) {
    // @@unique([habitId, date]) の制約で「同日2回」だとエラーになる
    error.value = e?.message ?? String(e);
  }
}

onMounted(async () => {
  await reloadHabits();
});
</script>

<template>
  <main class="wrap">
    <header class="header">
      <h1>Habit Tracker</h1>
      <p class="sub">Vue + NestJS + Prisma（認証なし / ローカル）</p>
    </header>

    <section class="card">
      <h2>新しい習慣</h2>
      <div class="row">
        <input v-model="newName" placeholder="習慣名（例：英語10分）" />
        <input v-model="newNote" placeholder="メモ（任意）" />
        <button @click="addHabit">追加</button>
      </div>
    </section>

    <p v-if="error" class="error">{{ error }}</p>

    <section class="grid">
      <section class="card">
        <div class="cardHead">
          <h2>習慣一覧</h2>
          <button class="ghost" @click="reloadHabits" :disabled="loading">再読み込み</button>
        </div>

        <p v-if="loading">読み込み中…</p>

        <ul class="list" v-else>
          <li v-for="h in habits" :key="h.id" class="item" :class="{ active: h.id === selectedHabitId }">
            <button class="select" @click="selectHabit(h)">
              <div class="title">
                <strong>{{ h.name }}</strong>
                <span class="badge" :class="{ off: !h.isActive }">
                  {{ h.isActive ? 'active' : 'inactive' }}
                </span>
              </div>
              <small v-if="h.note" class="note">{{ h.note }}</small>
            </button>

            <div class="actions">
              <button class="ghost" @click="doCheckinToday(h)" :disabled="!h.isActive">今日 ✓</button>
              <button class="ghost" @click="toggleActive(h)">{{ h.isActive ? '停止' : '再開' }}</button>
              <button class="danger" @click="removeHabit(h)">削除</button>
            </div>
          </li>
        </ul>
      </section>

      <section class="card">
        <h2>チェックイン</h2>

        <p v-if="!selectedHabit">左で習慣を選んでください。</p>

        <template v-else>
          <p class="sub2">
            選択中：<strong>{{ selectedHabit.name }}</strong>
          </p>

          <p v-if="checkinsLoading">読み込み中…</p>

          <ul v-else class="dates">
            <li v-if="checkins.length === 0" class="muted">まだチェックインがありません</li>
            <li v-for="c in checkins" :key="c.date">{{ c.date }}</li>
          </ul>
        </template>
      </section>
    </section>
  </main>
</template>

<style scoped>
.wrap { max-width: 980px; margin: 24px auto; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding: 0 16px; }
.header { margin-bottom: 16px; }
.sub { margin: 6px 0 0; color: #666; }
.sub2 { color: #444; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }

.card { border: 1px solid #ddd; border-radius: 12px; padding: 14px; background: #fff; }
.cardHead { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; }
@media (max-width: 700px) { .row { grid-template-columns: 1fr; } }

input { padding: 10px 12px; border: 1px solid #ccc; border-radius: 10px; }
button { padding: 10px 12px; border: 1px solid #bbb; border-radius: 10px; background: #f6f6f6; cursor: pointer; }
button:disabled { opacity: .6; cursor: not-allowed; }
button.ghost { background: transparent; }
button.danger { border-color: #d88; background: #ffecec; }

.error { color: #b00020; margin: 10px 0; white-space: pre-wrap; }

.list { list-style: none; padding: 0; margin: 10px 0 0; display: grid; gap: 8px; }
.item { border: 1px solid #eee; border-radius: 12px; padding: 10px; display: grid; grid-template-columns: 1fr auto; gap: 10px; }
.item.active { border-color: #bbb; }
.select { text-align: left; width: 100%; background: transparent; border: none; padding: 0; cursor: pointer; }
.title { display: flex; align-items: center; gap: 8px; }
.note { display: block; color: #666; margin-top: 3px; }
.badge { font-size: 12px; padding: 2px 8px; border-radius: 999px; border: 1px solid #bbb; color: #333; }
.badge.off { border-color: #ccc; color: #888; }

.actions { display: flex; flex-direction: column; gap: 6px; }
.dates { list-style: none; padding: 0; margin: 10px 0 0; display: grid; gap: 6px; }
.muted { color: #777; }
</style>