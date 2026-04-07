export type UserRole = "student" | "teacher" | "parent";

export interface MockSession {
  role: UserRole;
  name: string;
}

const ROLE_KEY = "rocky_role";
const NAME_KEY = "rocky_name";

export const ROLE_LABELS: Record<UserRole, string> = {
  student: "Student",
  teacher: "Teacher",
  parent: "Parent",
};

export const ROLE_HOME: Record<UserRole, string> = {
  student: "/student",
  teacher: "/teacher",
  parent: "/parent",
};

export function getMockSession(): MockSession | null {
  if (typeof window === "undefined") return null;

  const role = localStorage.getItem(ROLE_KEY) as UserRole | null;
  const name = localStorage.getItem(NAME_KEY) || "";

  if (!role || !(role in ROLE_HOME)) {
    return null;
  }

  return {
    role,
    name,
  };
}

export function setMockSession(role: UserRole, name: string) {
  if (typeof window === "undefined") return;

  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(NAME_KEY, name.trim());
}

export function clearMockSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(NAME_KEY);
}
