export interface User {
  id: string;
  email: string;
  role: "admin" | "teacher" | "accountant";
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: User;
  accessToken: string;
}

// For create user response
export interface CreateUserResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    role: "admin" | "teacher" | "accountant";
  };
  accessToken: string;
}
