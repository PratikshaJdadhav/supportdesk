
import { apiRequest } from "../../../lib/api";

export type LoginResponse = {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  token: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export async function loginUser(credentials: LoginCredentials) {
  return apiRequest<LoginResponse>("api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
};

export async function registerUser(credentials: RegisterCredentials) {
  return apiRequest<LoginResponse>("api/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
