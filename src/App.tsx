import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext"; // Import AuthProvider
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import FormGuide from "./pages/FormGuide";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      
      {/* ครอบ AuthProvider ไว้ในระดับสูง เพื่อให้ทุก Route เข้าถึงข้อมูล User ได้ */}
      <AuthProvider>
        <HashRouter>
          <Routes>
            {/* Route สาธารณะ */}
            <Route path="/" element={<Login />} />
            
            {/* Route ที่ต้องล็อกอิน (Protected Routes) */}
            <Route 
              path="/home" 
              element={
                <PrivateRoute>
                  <Index />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/chat" 
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              } 
            />
            
            <Route path="/form-guide" element={
              <PrivateRoute>
                <FormGuide />
              </PrivateRoute>
            } />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
      
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;