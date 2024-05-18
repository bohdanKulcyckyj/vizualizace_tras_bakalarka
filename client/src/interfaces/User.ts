export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export const UserRoleMapper: { [key: string]: UserRole } = {
  Admin: UserRole.ADMIN,
  User: UserRole.USER,
}

export interface ILoggedUser {
  id: string,
  role: UserRole,
  name: string,
  email: string
}
