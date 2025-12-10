import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
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
      <HashRouter>
        <Routes>
          {/* ✅ เปลี่ยนหน้าแรก (/) เป็น Login */}
          <Route path="/" element={<Login />} />
          
          {/* ✅ ย้ายหน้า Index เดิมไปที่ /home */}
          <Route path="/home" element={<Index />} />
          
          <Route path="/chat" element={<Chat />} />
          <Route path="/form-guide" element={<FormGuide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
