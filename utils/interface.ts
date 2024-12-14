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

interface Permission {
  id: number;
  permissionString: string;
}
