interface Role {
  id: number;
  name: string;
  users?: number;
}

interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  password:string| null;
  email: string;
  roles: Role[];
}

interface AuthUser {
  id: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  resetToken: string | null;
  emailConfirmToken: string | null;
  isEmailConfirmed: boolean;
  twoFASecret: string | null;
  isTwoFAEnabled: boolean;
  needPasswordReset: boolean;
  isVendor: boolean;
  isDeactivated: boolean;
}


interface Permission {
  id: number;
  permissionString: string;
}

interface RoleData {
  id: number;
  name: string;
  permissions: Permission[];
  users: User[];
}