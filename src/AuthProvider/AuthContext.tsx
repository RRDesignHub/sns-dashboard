import { createContext } from "react";
import type {
  LoginCredentials,
  LoginResponse,
  User,
} from "../types/loginTypes/userTypes";

// 2. The Shape of the Context Data
export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loader: boolean;
  setLoader: (loader: boolean) => void;
  logout: () => void;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>; // Added login
}

// 3. Create the Context (Exporting just the object)
export const AuthContext = createContext<AuthContextType | null>(null);
