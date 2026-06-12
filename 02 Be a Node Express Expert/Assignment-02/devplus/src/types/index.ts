export const ROLES = {
  CONTRIBUTOR: "contributor",
  MAINTAINER: "maintainer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
