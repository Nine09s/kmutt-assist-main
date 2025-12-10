import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // ❗ ตรวจสอบ Path ว่าไฟล์ AuthContext อยู่ที่ src/AuthContext.tsx หรือไม่
import { Loader2 } from "lucide-react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuth();

  // 1. สถานะ Loading: แสดง Spinner ระหว่างรอเช็ค localStorage
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">กำลังตรวจสอบข้อมูล...</p>
        </div>
      </div>
    );
  }

  // 2. ถ้าเช็คเสร็จแล้ว แต่ไม่มี User (Unauthenticated) -> ดีดกลับไปหน้า Login (/)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3. ถ้ามี User (Authenticated) -> แสดงหน้าเนื้อหาได้เลย
  return <>{children}</>;
};

export default PrivateRoute;