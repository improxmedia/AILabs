export type TeamRole = "admin" | "enterprise" | "creator";

export type TeamUser = {
  username: string;
  password: string;
  role: TeamRole;
  displayName: string;
};

const fallbackUsers = "admin:ChangeMe123:admin:IMPROX Admin,team:Team123:enterprise:IMPROX Team";

export function getTeamUsers(): TeamUser[] {
  const raw = process.env.TEAM_USERS || fallbackUsers;
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [username, password, role = "enterprise", displayName] = entry.split(":");
      return {
        username,
        password,
        role: role as TeamRole,
        displayName: displayName || username
      };
    })
    .filter((u) => u.username && u.password);
}

export function validateTeamUser(username: string, password: string) {
  return getTeamUsers().find((u) => u.username === username && u.password === password) || null;
}

export function getTeamUser(username?: string | null) {
  if (!username) return null;
  return getTeamUsers().find((u) => u.username === username) || null;
}
