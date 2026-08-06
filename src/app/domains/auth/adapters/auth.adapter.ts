import { LoginResponse } from '../models/auth.model';

export const authAdapter = (loginData: LoginResponse) => ({
  access: loginData.access,
  refresh: loginData.refresh,
});
