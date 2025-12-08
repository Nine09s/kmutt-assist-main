import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  MessageSquare,
  FileText,
  Search,
  Sparkles,
  Clock,
  Shield,
} from "lucide-react";

const Index = () => {
  const popularRequests = [
    { title: "ลาพักการศึกษา", form: "RO.01" },
    { title: "ถอนรายวิชา", form: "RO.12" },
    { title: "ลาป่วย / ลากิจ", form: "RO.16" },
    { title: "เพิ่มรายวิชา", form: "RO.18" },
    { title: "โอนย้ายคณะ", form: "RO.19" },
    { title: "ขอผ่อนผันการชำระเงิน", form: "RO.22" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-light py-20 md:py-32">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                <span>ผู้ช่วยอัจฉริยะของ KMUTT</span>
              </div>
              <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
                ผู้ช่วยคำร้องอัจฉริยะ
                <br />
                ของ KMUTT
              </h1>
              <p className="mb-8 text-lg text-white/90 md:text-xl">
                ค้นหาข้อมูลและสร้างคำร้องได้ภายใน 3 นาที
                <br />
                ง่าย รวดเร็ว และแม่นยำ
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/chat">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 shadow-lg gap-2 h-12 px-8 rounded-xl"
                  >
                    <Search className="h-5 w-5" />
                    เริ่มค้นหา
                  </Button>
                </Link>
                <Link to="/form-guide">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-primary text-white hover:bg-white/10 h-12 px-8 rounded-xl gap-2"
                  >
                    <FileText className="h-5 w-5" />
                    สร้างคำร้อง
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
              ฟีเจอร์หลัก
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="group relative overflow-hidden border-2 p-8 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold">ค้นหาข้อมูลคำร้อง</h3>
                  <p className="mb-4 text-muted-foreground">
                    แชทบอทอัจฉริยะที่ช่วยตอบคำถามเกี่ยวกับคำร้องต่างๆ พร้อมแสดงขั้นตอนและเอกสารที่ต้องใช้
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      ค้นหาข้อมูลจากระเบียบและคู่มือของมหาวิทยาลัย
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      แสดงแหล่งอ้างอิงที่ชัดเจน
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      คำถามที่เกี่ยวข้องและฟอร์มที่ต้องใช้
                    </li>
                  </ul>
                  <Link to="/chat" className="mt-6 inline-block">
                    <Button className="rounded-xl">
                      เริ่มใช้งาน
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className="group relative overflow-hidden border-2 p-8 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold">สร้างคำแนะนำการกรอกฟอร์ม</h3>
                  <p className="mb-4 text-muted-foreground">
                    ระบบสร้างคำแนะนำการกรอกฟอร์มอัตโนมัติ พร้อมตัวอย่างและข้อควรระวัง
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      คำแนะนำทีละช่อง พร้อมตัวอย่าง
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      Checklist เอกสารประกอบ
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      Export เป็น PDF หรือ Text
                    </li>
                  </ul>
                  <Link to="/form-guide" className="mt-6 inline-block">
                    <Button className="rounded-xl">
                      เริ่มใช้งาน
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
              ทำไมต้องใช้ระบบของเรา
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">ประหยัดเวลา</h3>
                <p className="text-muted-foreground">
                  ค้นหาข้อมูลและสร้างคำร้องได้ภายใน 3 นาที ไม่ต้องเสียเวลาค้นหาเอกสาร
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10">
                  <Sparkles className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">แม่นยำ</h3>
                <p className="text-muted-foreground">
                  ข้อมูลจากระเบียบและคู่มือของมหาวิทยาลัย พร้อมแหล่งอ้างอิง
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">ง่ายต่อการใช้</h3>
                <p className="text-muted-foreground">
                  ออกแบบให้ใช้งานง่าย เหมาะกับนักศึกษาทุกคน
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Requests */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
              คำร้องยอดนิยม
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              {popularRequests.map((request) => (
                <Link key={request.form} to="/chat">
                  <Card className="p-4 transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer border-2 hover:border-primary">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{request.title}</p>
                        <p className="text-sm text-muted-foreground">{request.form}</p>
                      </div>
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
