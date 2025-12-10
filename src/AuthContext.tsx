import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. กำหนด Type ของข้อมูล User (ปรับ field ตามจริงได้เลยครับ)
interface User {
  id: string | number;
  name: string;
  email?: string;
  token?: string;
  // field อื่นๆ ที่คุณอาจจะมี
  [key: string]: any; 
}

// 2. กำหนด Type ของสิ่งที่จะส่งออกไปให้ Component อื่นใช้
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

// สร้าง Context พร้อมระบุ Type
const AuthContext = createContext<AuthContextType | null>(null);

// กำหนด Type ให้กับ Props ของ Provider (รับ children เข้ามา)
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // ระบุ Type ให้ useState
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Check Login
  useEffect(() => {
    const checkLogin = () => {
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) {
        try {
          // Parse และกำหนด Type
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          localStorage.removeItem('user_data');
        }
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  // 2. Login
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  // 3. Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_data');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook พร้อม Type Safety
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};