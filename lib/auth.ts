import { ImproxModelId } from "./models";

export type DemoUser = {
  id: string;
  name: string;
  role: "admin" | "enterprise" | "creator" | "basic";
  credits: number;
  modelsAllowed: ImproxModelId[] | "all";
};

// DEMO ONLY. Replace with Clerk/Supabase/Firebase before production.
export const demoUsers: DemoUser[] = [
  { id: "admin", name: "IMPROX Admin", role: "admin", credits: 999999, modelsAllowed: "all" },
  { id: "enterprise-user", name: "Enterprise User", role: "enterprise", credits: 5000, modelsAllowed: "all" },
  {
    id: "creator-user",
    name: "Creator User",
    role: "creator",
    credits: 1000,
    modelsAllowed: ["improx-genius-pro", "improx-gemini-pro", "improx-vision-studio", "improx-flux-pro", "improx-kontext-edit", "improx-video-studio", "improx-reel-director"]
  }
];

export function getDemoUser(userId?: string | null) {
  return demoUsers.find((u) => u.id === userId) || demoUsers[1];
}

export function assertModelAccess(user: DemoUser, model: string) {
  if (user.modelsAllowed === "all") return;
  if (!user.modelsAllowed.includes(model as ImproxModelId)) {
    throw new Error("This user does not have access to the selected IMPROX model.");
  }
}
