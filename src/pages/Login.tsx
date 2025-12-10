import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "../AuthContext"; // ถอยกลับไป 1 ชั้นเพื่อเรียกใช้ Context
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth(); // ดึง user มาเช็คด้วย
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ 1. เพิ่ม Effect: ถ้าล็อกอินอยู่แล้ว ให้ดีดไปหน้า Home อัตโนมัติ (กันคนเข้าหน้า Login ซ้ำ)
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // ตัวอย่าง Check ง่ายๆ (ของจริงอาจจะเป็น API)
    if (username.trim() !== "" && password.trim() !== "") {
      
      // สร้าง Mock User Data
      const userData = {
        id: "1",
        name: username,
        role: "student"
      };

      // ✅ 2. เรียกฟังก์ชัน login จาก Context
      login(userData);

      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: `ยินดีต้อนรับคุณ ${username}`,
      });

      // ✅ 3. สำคัญมาก! สั่งเปลี่ยนหน้าไปที่ /home
      navigate("/home");
      
    } else {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">KMUTT Assistant</CardTitle>
          <CardDescription className="text-center">
            เข้าสู่ระบบเพื่อใช้งานระบบแนะนำการเขียนคำร้อง
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">ชื่อผู้ใช้ / รหัสนักศึกษา</Label>
              <Input 
                id="username" 
                placeholder="Ex. 63000000000" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">เข้าสู่ระบบ</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;