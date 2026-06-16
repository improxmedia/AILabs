export type MagicLinkUser = {
  token: string;
  username: string;
  role: "admin" | "enterprise" | "creator";
  displayName: string;
};

/**
 * Optional quick access links for non-technical team members.
 * Env format:
 * TEAM_MAGIC_LINKS=token:username:role:Display Name,token2:designer:creator:Designer
 */
export function getMagicLinkUsers(): MagicLinkUser[] {
  const raw = process.env.TEAM_MAGIC_LINKS || "";
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [token, username, role = "enterprise", displayName] = entry.split(":");
      return {
        token,
        username,
        role: role as MagicLinkUser["role"],
        displayName: displayName || username
      };
    })
    .filter((u) => u.token && u.username);
}

export function validateMagicToken(token?: string | null) {
  if (!token) return null;
  return getMagicLinkUsers().find((u) => u.token === token) || null;
}
