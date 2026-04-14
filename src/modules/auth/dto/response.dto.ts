export interface UserRegisterResponse {
  message: string;
  user?: {
    email: string;
    name: string;
  };
}

export interface LoginResponse {
  message: string;
  user?: {
    email: string;
    name: string;
  };
  access_token?: string;
}
