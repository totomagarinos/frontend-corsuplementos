export interface TokenContainer {
  access: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface Auth extends LoginResponse {}

export interface AuthData {
  email: string;
  password: string;
}
