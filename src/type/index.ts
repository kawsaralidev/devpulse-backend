export type ROLES = "contributor" | "maintainer";

export interface TJwtPayload {
  id: number;
  name: string;
  email: string;
  role: ROLES;
}
