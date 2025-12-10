import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId || !password) {
      toast({
        title: "กรุณากรอกข้อมูล",
        description: "ต้องใส่รหัสนักศึกษาและรหัสผ่านให้ครบ",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // --- จำลองการโหลด (Fake Loading) เพื่อความสมจริง ---
    setTimeout(() => {
      setLoading(false);
      
      // บันทึกชื่อไว้ใช้ในหน้าแชท (Mock Data)
      const mockUserData = {
        studentId: studentId,
        name: "นักศึกษา (User)", // ในอนาคตถ้าเชื่อมระบบจริงค่อยดึงชื่อจริงมา
        faculty: "วิศวกรรมศาสตร์", // ค่าสมมติ
        year: "3"
      };
      
      // บันทึกลงเครื่อง (เพื่อให้หน้า Form ดึงไปใช้ต่อได้เลย!)
      localStorage.setItem("form_guide_data", JSON.stringify(mockUserData));

      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: "ยินดีต้อนรับเข้าสู่ KMUTT Assistant",
        className: "bg-green-50 text-green-800 border-green-200",
      });

      // ไปหน้าแรก
      navigate("/");
      
    }, 1500); // รอ 1.5 วินาทีให้ดูเหมือนกำลังเช็ค server
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-slate-200 bg-white">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">KMUTT Assistant</h1>
          <p className="text-slate-500 text-sm mt-1">ระบบผู้ช่วยอัจฉริยะสำหรับนักศึกษา</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">รหัสนักศึกษา</Label>
            <Input 
              id="studentId" 
              placeholder="6xxxxxxxxx" 
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="h-11 rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน (New ACIS)</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-lg"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-base mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> กำลังตรวจสอบ...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                เข้าสู่ระบบ <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          © 2025 Computer Engineering, KMUTT
        </div>
      </Card>
    </div>
  );
};

export default Login;