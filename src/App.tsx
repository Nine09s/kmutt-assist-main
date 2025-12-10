import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import FormGuide from "./pages/FormGuide";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

// 2. (Optional) สร้าง Component สำหรับป้องกัน Route ที่ต้องล็อกอินก่อน
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>; // รอเช็ค Login
  }

  if (!user) {
    return <Navigate to="/" replace />; // ถ้าไม่ล็อกอิน ดีดกลับไปหน้า Login (/)
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      
      {/* 3. ครอบ AuthProvider ไว้ในระดับสูง เพื่อให้ทุก Route เข้าถึงข้อมูล User ได้ */}
      <AuthProvider>
        <HashRouter>
          <Routes>
            {/* หน้า Login (Public) */}
            <Route path="/" element={<Login />} />
            
            {/* หน้าที่ต้องการการล็อกอิน (Protected) */}
            <Route path="/home" element={
              <PrivateRoute>
                <Index />
              </PrivateRoute>
            } />
            
            <Route path="/chat" element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            } />
            
            <Route path="/form-guide" element={
              <PrivateRoute>
                <FormGuide />
              </PrivateRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
      
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;