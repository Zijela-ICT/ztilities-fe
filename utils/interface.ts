interface Role {
  id: number;
  name: string;
  users?: number;
}

interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  password: string | null;
  email: string;
  roles: Role[];
}

interface AuthUser {
  id: number;
  avatar: any;
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

//Fcailities
interface Facility {
  id: number;
  name: string | null;
  type: string | null;
  code: string | null;
  address: string | null;
  contactName: string | null;
  email: string;
  phone: string | null;
}

interface Block {
  id: number;
  blockNumber: string;
  code: string;
  officer: string;
  phone: string;
  email: string;
  type: string;
  address: string;
  status: string;
}
