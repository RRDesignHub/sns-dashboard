import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext"; // Import from the other file
import axios from "axios";
import type {
  LoginCredentials,
  LoginResponse,
  User,
} from "../types/loginTypes/userTypes";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem("sns-user");
      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        return JSON.parse(savedUser);
      }
      return null;
    } catch (error) {
      console.error("Error parsing saved user:", error);
      localStorage.removeItem("sns-user");
      return null;
    }
  });
  const [loader, setLoader] = useState(false);

  // Login function
  const login = async (
    credentials: LoginCredentials,
  ): Promise<LoginResponse> => {
    setLoader(true);
    try {
      const { data } = await axios.post<LoginResponse>(
        `${import.meta.env.VITE_SERVER_API}/api/users/login`,
        credentials,
      );

      if (data.success && data.data) {
        // ✅ Access user through 'data.data'
        const userData: User = {
          id: data.data.id,
          email: data.data.email,
          role: data.data.role,
          name: data.data.name,
        };
        setUser(userData);
        localStorage.setItem("sns-user", JSON.stringify(userData));
        localStorage.setItem("accessToken", data.accessToken);

        return data;
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoader(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("sns-user");
    setUser(null);
  };

  const authInfo = {
    user,
    setUser,
    loader,
    setLoader,
    logout,
    login,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};
