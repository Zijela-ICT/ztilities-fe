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
  twoFAMethod: string;
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
  email: string;
  phone: string | null;
  blocks: Block[];
  units: Unit[];
  assets: Asset[];
}

interface Block {
  id: number;
  blockNumber: string | null;
  code: string | null;
  facilityOfficer: string | null;
  phone: string | null;
  email: string | null;
  type: string | null;
  address: string | null;
  units: Unit[];
  assets: Asset[];
}

interface Unit {
  id: number;
  unitNumber: string | null;
  type: string | null;
  ownership: string | null;
  description: string | null;
  bookable: string | null;
  commonArea: string | null;
  address: string | null;
  assets: Asset[];
}

interface Asset {
  id: number;
  assetNumber: string;
}

//Vendor
interface Vendor {
  id: number;
  vendorCode: string;
  vendorName: string;
  vendorType: string;
  category: string;
  phoneNumber: string;
  email: string;
  address: string;
}
