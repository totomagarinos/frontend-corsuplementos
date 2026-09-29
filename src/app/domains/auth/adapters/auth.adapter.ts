import { LoginResponse } from '../models/auth';

export const authAdapter = (loginData: LoginResponse) => ({
  access: loginData.access,
  refresh: loginData.refresh,
  user: loginData.user,
});
