export const ROLES = {
  BASEUSER: "BASEUSER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
};

export const canSeeAdmin = (role) =>
  role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
export const isSuper = (role) => role === ROLES.SUPER_ADMIN;
export const isAdmin = (role) => role === ROLES.ADMIN;
export const isBaseUser = (role) => role === ROLES.BASEUSER;
