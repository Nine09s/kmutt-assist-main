import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkLogin = () => {
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem('user_data');
        }
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  // ✅ 3. ปรับปรุงฟังก์ชัน Logout ให้กวาดล้างบาง
  const logout = () => {
    // 3.1 ล้าง State
    setUser(null);
    
    // 3.2 ล้าง LocalStorage หลัก
    localStorage.removeItem('user_data');
    
    // 3.3 ล้าง LocalStorage ของฟีเจอร์อื่นๆ (เช่น ฟอร์ม, แชท)
    // ใส่ Key ทั้งหมดที่คุณเคยใช้เก็บข้อมูลลงไปตรงนี้
    localStorage.removeItem('form_guide_data'); 
    localStorage.removeItem('chat_history'); 
    localStorage.removeItem('draft_form');

    // 3.4 ล้าง Cache ของ React Query (สำคัญ! กันข้อมูลเก่าโผล่)
    queryClient.clear(); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};