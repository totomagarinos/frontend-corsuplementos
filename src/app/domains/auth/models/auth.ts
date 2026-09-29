export interface User {
  id: number;
  email: string;
  is_vip: boolean;
}

export interface TokenContainer {
  access: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface Auth extends LoginResponse {}

export interface AuthData {
  email: string;
  password: string;
}
