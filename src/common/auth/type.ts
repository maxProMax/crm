export type AuthenticatedUser = {
  id: string;
  tenantId: string;
  email: string;
  isSuperAdmin: boolean;
};
