export interface User {
  id: number;
  username: string;
  password?: string;
  roleId: number;
  uuid?: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}
