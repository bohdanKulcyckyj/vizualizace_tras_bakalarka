export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

export const UserRoleMapper: { [key: string] : UserRole } = {
    'Admin': UserRole.ADMIN,
    'User': UserRole.USER,
}