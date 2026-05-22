export const USER_ROLE = {
    ADMIN: "admin",
    AGENT: "agent",
    USER: "user",
} as const;

export type ROLES = "admin" | "agent" | "user";