export interface UserRegisterResponse {
  message: string;
  user?: {
    email: string;
    name: string;
  };
}

export interface LoginResponse {
  message: string;
  payload?: { sub: string; email: string; name: string; role: string };
  access_token?: string;
}
