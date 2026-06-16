import { ImproxModelId } from "./models";

export type DemoUser = {
  id: string;
  name: string;
  role: "admin" | "enterprise" | "creator" | "basic";
  credits: number;
  modelsAllowed: ImproxModelId[];
};

// DEMO ONLY. Replace with Clerk/Supabase/Firebase before production.
export const demoUsers: DemoUser[] = [
  {
    id: "admin",
    name: "IMPROX Admin",
    role: "admin",
    credits: 999999,
    modelsAllowed: ["improx-genius-pro", "improx-vision-studio", "improx-video-studio"]
  },
  {
    id: "enterprise-user",
    name: "Enterprise User",
    role: "enterprise",
    credits: 5000,
    modelsAllowed: ["improx-genius-pro", "improx-vision-studio", "improx-video-studio"]
  },
  {
    id: "creator-user",
    name: "Creator User",
    role: "creator",
    credits: 1000,
    modelsAllowed: ["improx-genius-pro", "improx-vision-studio"]
  }
];

export function getDemoUser(userId?: string | null) {
  return demoUsers.find((u) => u.id === userId) || demoUsers[1];
}

export function assertModelAccess(user: DemoUser, model: string) {
  if (!user.modelsAllowed.includes(model as ImproxModelId)) {
    throw new Error("This user does not have access to the selected IMPROX model.");
  }
}
