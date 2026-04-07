"use client";

export type AssignmentGrade = "A" | "B" | "C" | "D";

export interface GradeHistoryItem {
  assignmentId: string;
  assignmentTitle: string;
  grade: AssignmentGrade;
  expAwarded: number;
  teacherName: string;
  timestamp: string;
}

export interface StudentProgressionProfile {
  id: string;
  name: string;
  level: number;
  exp: number;
  title: string;
  latestGrade: AssignmentGrade | null;
  gradeHistory: GradeHistoryItem[];
  friends: string[];
  pendingLevelUpMessage?: string | null;
}

interface ProgressionStore {
  profiles: Record<string, StudentProgressionProfile>;
}

const STORE_KEY = "rocky_student_progression_store";

const TITLE_TIERS: Array<{ min: number; max: number; title: string }> = [
  { min: 1, max: 4, title: "Star Sprout" },
  { min: 5, max: 9, title: "Idea Builder" },
  { min: 10, max: 14, title: "Dream Explorer" },
  { min: 15, max: 19, title: "Wonder Designer" },
  { min: 20, max: 24, title: "Magic Maker" },
  { min: 25, max: 29, title: "Sky Architect" },
  { min: 30, max: 34, title: "Castle Crafter" },
  { min: 35, max: 39, title: "Legendary Creator" },
  { min: 40, max: 44, title: "World Guardian" },
  { min: 45, max: 50, title: "Eternal Dreammaster" },
];

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

export function buildStudentIdFromName(name: string) {
  return `student_${normalizeName(name).replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "unknown"}`;
}

function safeParseStore(): ProgressionStore {
  if (typeof window === "undefined") return { profiles: {} };
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || "{}") as ProgressionStore;
    if (!parsed || typeof parsed !== "object" || !parsed.profiles) {
      return { profiles: {} };
    }
    return parsed;
  } catch {
    return { profiles: {} };
  }
}

function saveStore(store: ProgressionStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function getExpForGrade(grade: AssignmentGrade) {
  if (grade === "A") return 120;
  if (grade === "B") return 90;
  if (grade === "C") return 60;
  return 30;
}

export function getRequiredExpForLevel(level: number) {
  return 100 + 20 * Math.max(0, level - 1);
}

export function getTitleForLevel(level: number) {
  const tier = TITLE_TIERS.find((item) => level >= item.min && level <= item.max);
  return tier?.title || "Eternal Dreammaster";
}

export function recalculateLevelAndTitle(totalExp: number) {
  let level = 1;
  let remaining = Math.max(0, totalExp);
  let required = getRequiredExpForLevel(level);
  while (remaining >= required) {
    remaining -= required;
    level += 1;
    required = getRequiredExpForLevel(level);
  }
  return {
    level,
    title: getTitleForLevel(level),
    expIntoCurrentLevel: remaining,
    requiredExp: required,
  };
}

export function getExpProgress(profile: StudentProgressionProfile) {
  const state = recalculateLevelAndTitle(profile.exp);
  return {
    currentExp: state.expIntoCurrentLevel,
    requiredExp: state.requiredExp,
    ratio: state.requiredExp > 0 ? state.expIntoCurrentLevel / state.requiredExp : 0,
  };
}

export function createDefaultProfile(id: string, name: string): StudentProgressionProfile {
  return {
    id,
    name: name.trim() || "Student",
    level: 1,
    exp: 0,
    title: "Star Sprout",
    latestGrade: null,
    gradeHistory: [],
    friends: [],
    pendingLevelUpMessage: null,
  };
}

export function getStudentProfile(studentId: string, name: string) {
  const store = safeParseStore();
  const existing = store.profiles[studentId];
  if (existing) return existing;
  const created = createDefaultProfile(studentId, name);
  store.profiles[studentId] = created;
  saveStore(store);
  return created;
}

export function getStudentProfileByName(name: string) {
  const id = buildStudentIdFromName(name);
  return getStudentProfile(id, name);
}

export function getAllStudentProfiles() {
  const store = safeParseStore();
  return Object.values(store.profiles);
}

export function saveStudentProfile(profile: StudentProgressionProfile) {
  const store = safeParseStore();
  store.profiles[profile.id] = profile;
  saveStore(store);
  return profile;
}

export function applyGradeToStudent(
  profile: StudentProgressionProfile,
  input: {
    assignmentId: string;
    assignmentTitle: string;
    grade: AssignmentGrade;
    teacherName: string;
  },
) {
  const expAwarded = getExpForGrade(input.grade);
  const oldLevel = profile.level;
  const withoutTarget = profile.gradeHistory.filter(
    (item) => item.assignmentId !== input.assignmentId,
  );
  const nextHistory: GradeHistoryItem[] = [
    {
      assignmentId: input.assignmentId,
      assignmentTitle: input.assignmentTitle,
      grade: input.grade,
      expAwarded,
      teacherName: input.teacherName,
      timestamp: new Date().toISOString(),
    },
    ...withoutTarget,
  ].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));

  const nextExp = nextHistory.reduce((sum, item) => sum + item.expAwarded, 0);
  const nextState = recalculateLevelAndTitle(nextExp);
  const levelUp = nextState.level > oldLevel;
  const pendingLevelUpMessage = levelUp
    ? `Level Up! You reached Lv. ${nextState.level}: ${nextState.title}`
    : profile.pendingLevelUpMessage || null;

  return {
    ...profile,
    exp: nextExp,
    level: nextState.level,
    title: nextState.title,
    latestGrade: input.grade,
    gradeHistory: nextHistory,
    pendingLevelUpMessage,
  };
}

export function gradeStudentAssignment(input: {
  studentId: string;
  studentName: string;
  assignmentId: string;
  assignmentTitle: string;
  grade: AssignmentGrade;
  teacherName: string;
}) {
  const current = getStudentProfile(input.studentId, input.studentName);
  const next = applyGradeToStudent(current, {
    assignmentId: input.assignmentId,
    assignmentTitle: input.assignmentTitle,
    grade: input.grade,
    teacherName: input.teacherName,
  });
  saveStudentProfile(next);
  return next;
}

export function consumeLevelUpNotification(studentId: string) {
  const profile = safeParseStore().profiles[studentId];
  if (!profile?.pendingLevelUpMessage) return null;
  const message = profile.pendingLevelUpMessage;
  saveStudentProfile({ ...profile, pendingLevelUpMessage: null });
  return message;
}
