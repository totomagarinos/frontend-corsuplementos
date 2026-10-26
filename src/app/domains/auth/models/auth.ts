export interface User {
  id: number;
  first_name: string;
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

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  email: string;
  password: string;
}
