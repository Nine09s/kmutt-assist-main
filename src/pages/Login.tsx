import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { GraduationCap, ArrowRight, Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // 🛑 ป้องกันหน้าเว็บรีโหลดเอง (สำคัญมาก)
    
    // 🔒 Security Check 1: ตรวจสอบความครบถ้วน
    if (!studentId || !password) {
      toast({
        title: "กรุณากรอกข้อมูล",
        description: "ต้องใส่รหัสนักศึกษาและรหัสผ่านให้ครบถ้วน",
        variant: "destructive",
      });
      return;
    }

    // 🔒 Security Check 2: ตรวจสอบ Format รหัสนักศึกษา (ต้อง 11 หลัก และเป็นตัวเลข)
    const kmuttIdRegex = /^\d{11}$/;
    if (!kmuttIdRegex.test(studentId)) {
      toast({
        title: "รหัสนักศึกษาไม่ถูกต้อง",
        description: "รหัสนักศึกษาต้องเป็นตัวเลข 11 หลัก",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // --- จำลองการตรวจสอบกับ Server (Mock Security) ---
    setTimeout(() => {
      setLoading(false);
      
      // 🔒 Security Check 3: (Optional) ถ้าอยากล็อคให้เข้าได้เฉพาะเรา
      // if (studentId !== "64099999999") { ... แจ้งเตือนรหัสผิด ... return; }

      // ✅ ผ่านการตรวจสอบ -> บันทึก Session
      const userData = {
        studentId: studentId,
        name: "นักศึกษา มจธ.", // (ในระบบจริงจะดึงชื่อมาจาก Database)
        faculty: "วิศวกรรมศาสตร์",
        year: "3",
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem("form_guide_data", JSON.stringify(userData));

      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: "ยินดีต้อนรับเข้าสู่ KMUTT Assistant",
        className: "bg-green-50 text-green-800 border-green-200",
      });

      // 🚀 Redirect ไปหน้า Main (ต้องเป็น /home ไม่ใช่ /)
      navigate("/home");
      
    }, 1500); 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 bg-[url('https://www.kmutt.ac.th/wp-content/uploads/2020/09/KMUTT-BG.jpg')] bg-cover bg-center">
      {/* Overlay สีขาวจางๆ เพื่อให้อ่านง่าย */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />

      <Card className="w-full max-w-md p-8 shadow-2xl border-slate-200 bg-white relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <GraduationCap className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">KMUTT Assistant</h1>
          <p className="text-slate-500 text-sm mt-1">ระบบผู้ช่วยอัจฉริยะสำหรับนักศึกษา</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="studentId" className="text-slate-700 font-medium">รหัสนักศึกษา</Label>
            <Input 
              id="studentId" 
              placeholder="เช่น 6xxxxxxxxxx" 
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="h-12 rounded-xl border-slate-200 focus-visible:ring-orange-500"
              maxLength={11} // จำกัดความยาว
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">รหัสผ่าน (New ACIS)</Label>
            <div className="relative">
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl border-slate-200 focus-visible:ring-orange-500 pr-10"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-4" />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-base mt-4 shadow-lg shadow-orange-200 font-bold transition-all hover:scale-[1.01]"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> กำลังตรวจสอบ...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                เข้าสู่ระบบ <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400 border-t border-slate-100 pt-4">
          © {new Date().getFullYear()} Computer Engineering, KMUTT<br/>
          Secure Login System
        </div>
      </Card>
    </div>
  );
};

export default Login;