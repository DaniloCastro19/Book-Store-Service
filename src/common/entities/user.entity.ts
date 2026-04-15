export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
