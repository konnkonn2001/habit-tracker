const base = import.meta.env.VITE_API_BASE_URL as string;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

export type Habit = {
  id: string;
  name: string;
  note?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Checkin = {
  id: string;
  habitId: string;
  date: string; // ISO
  createdAt: string;
};

export function listHabits() {
  return http<Habit[]>('/habits');
}

export function createHabit(input: { name: string; note?: string }) {
  return http<Habit>('/habits', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function deleteHabit(id: string) {
  return http<Habit>(`/habits/${id}`, { method: 'DELETE' });
}

export function patchHabit(id: string, input: { name?: string; note?: string; isActive?: boolean }) {
  return http<Habit>(`/habits/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function listCheckins(habitId: string) {
  return http<Checkin[]>(`/habits/${habitId}/checkins`);
}

// "今日" を YYYY-MM-DD で送る（API側がUTCの00:00で保存する想定）
export function checkinToday(habitId: string) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const date = `${yyyy}-${mm}-${dd}`;

  return http<Checkin>(`/habits/${habitId}/checkins`, {
    method: 'POST',
    body: JSON.stringify({ date }),
  });
}