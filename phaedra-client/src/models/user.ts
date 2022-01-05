export interface User {
  id: number;
  username: string;
  role_id: number;
  uuid: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}
