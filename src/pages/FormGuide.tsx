import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, FileText, Download, User, Hash, School, Calendar, 
  ArrowLeft, CheckCircle2, MapPin, Phone, Mail, FileType
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar"; // ✅ Import กลับมาแล้ว
import Footer from "@/components/Footer"; // ✅ Import กลับมาแล้ว

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </span>
);

// --- CONFIGURATION ---
type FieldConfig = {
  label: string;
  key: string;
  type: "text" | "date" | "textarea" | "number";
  placeholder?: string;
  width?: "full" | "half" | "third";
  icon?: any;
};

const FORM_CONFIG: Record<string, FieldConfig[]> = {
  "RO.01": [
    { label: "เรื่องที่ต้องการร้องขอ", key: "request_subject", type: "text", placeholder: "เช่น ขอลงทะเบียนเรียนข้ามหลักสูตร", width: "full" },
    { label: "เรียน (ผู้รับเรื่อง)", key: "recipient", type: "text", placeholder: "เช่น คณบดีคณะ...", width: "full" },
    { label: "สาขาวิชา/ภาควิชา", key: "department", type: "text", placeholder: "เช่น วิศวกรรมคอมพิวเตอร์", width: "half" },
    { label: "อาจารย์ที่ปรึกษา", key: "advisor_name", type: "text", placeholder: "เช่น อ.สมชาย ใจดี", width: "half" },
    { label: "เกรดเฉลี่ยสะสม (GPAX)", key: "cumulative_gpa", type: "text", placeholder: "3.xx", width: "half" },
    { label: "เกรดเฉลี่ยภาคล่าสุด (GPS)", key: "semester_gpa", type: "text", placeholder: "3.xx", width: "half" },
    { label: "เบอร์โทรศัพท์", key: "student_tel", type: "text", placeholder: "08x-xxx-xxxx", width: "half", icon: Phone },
    { label: "อีเมล", key: "student_email", type: "text", placeholder: "name.sur@mail.kmutt.ac.th", width: "half", icon: Mail },
    { label: "รายละเอียดคำร้อง", key: "request_details", type: "textarea", placeholder: "อธิบายความประสงค์และเหตุผล...", width: "full" },
  ],
  "RO.03": [
    { label: "คำรับรอง (เรื่อง)", key: "request_subject", type: "text", placeholder: "เช่น ขอลาพักการศึกษา", width: "full" },
    { label: "บ้านเลขที่", key: "address_no", type: "text", width: "third", icon: MapPin },
    { label: "หมู่ที่", key: "address_moo", type: "text", width: "third" },
    { label: "ซอย", key: "address_soi", type: "text", width: "third" },
    { label: "ถนน", key: "address_road", type: "text", width: "half" },
    { label: "แขวง/ตำบล", key: "address_subdistrict", type: "text", width: "half" },
    { label: "เขต/อำเภอ", key: "address_district", type: "text", width: "half" },
    { label: "จังหวัด", key: "address_province", type: "text", width: "half" },
    { label: "รหัสไปรษณีย์", key: "address_postal_code", type: "text", width: "half" },
    { label: "เบอร์โทรบ้าน", key: "phone_home", type: "text", width: "half", icon: Phone },
    { label: "เบอร์มือถือ", key: "phone_mobile", type: "text", width: "half", icon: Phone },
    { label: "ข้อความรับรอง", key: "Parental_certification", type: "textarea", placeholder: "ข้าพเจ้ายินยอมให้...", width: "full" },
  ],
  "RO.12": [
    { label: "รหัสวิชา", key: "course_code", type: "text", placeholder: "CSC102", width: "half" },
    { label: "ชื่อวิชา", key: "course_name", type: "text", placeholder: "Computer Programming", width: "half" },
    { label: "กลุ่มเรียน (Section)", key: "section", type: "text", placeholder: "A", width: "half" },
    { label: "เหตุผลที่ถอน", key: "reason", type: "textarea", placeholder: "ระบุเหตุผล...", width: "full" },
  ],
  "RO.16": [
    { label: "ประเภทการลา", key: "leave_type", type: "text", placeholder: "ลาป่วย หรือ ลากิจ", width: "full" },
    { label: "ตั้งแต่วันที่", key: "start_date", type: "text", placeholder: "10 มกราคม 2568", width: "half" },
    { label: "ถึงวันที่", key: "end_date", type: "text", placeholder: "12 มกราคม 2568", width: "half" },
    { label: "เนื่องจากสาเหตุ", key: "reason", type: "textarea", placeholder: "ระบุอาการป่วย หรือธุระ...", width: "full" },
  ],
};

const FormGuide = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isAiFilled, setIsAiFilled] = useState(false);
  const [loading, setLoading] = useState(false);

  // URL Backend ของคุณ
  const API_URL = "https://kmutt-backend-production.up.railway.app"; 

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    faculty: "",
    year: "",
    formType: "",
  });

  const [dynamicData, setDynamicData] = useState<Record<string, string>>({});

  const forms = [
    { id: "RO.01", name: "คำร้องทั่วไป (General Request)" },
    { id: "RO.03", name: "หนังสือรับรองของผู้ปกครอง" },
    { id: "RO.04", name: "ใบมอบฉันทะ" },
    { id: "RO.08", "name": "คำร้องขอคืนเงินค่าลงทะเบียน" },
    { id: "RO.12", "name": "คำร้องขอลาพักการศึกษา / ถอน" },
    { id: "RO.16", "name": "คำร้องขอลาป่วย/ลากิจ" },
    { id: "RO.18", "name": "คำร้องลงทะเบียนหน่วยกิต ต่ำ/เกิน" },
    { id: "RO.22", "name": "คำร้องขอผ่อนผันค่าเทอม" },
  ];

  useEffect(() => {
    if (location.state) {
      const data = location.state;
      console.log("📦 Received Data from AI:", data);

      setFormData(prev => ({
        ...prev,
        studentId: data.student_id || "",
        name: data.name || "",
        faculty: data.faculty || "",
        year: data.year || "",
        formType: data.form_id || "" 
      }));

      const aiDraft: Record<string, string> = {};
      if (data.draft_reason) aiDraft["reason"] = data.draft_reason;
      if (data.draft_reason) aiDraft["request_details"] = data.draft_reason;
      if (data.draft_reason) aiDraft["Parental_certification"] = data.draft_reason;
      if (data.draft_subject) aiDraft["request_subject"] = data.draft_subject;
      
      setDynamicData(prev => ({ ...prev, ...aiDraft }));
      setIsAiFilled(true);
      
      toast({
        title: "✨ AI ช่วยกรอกข้อมูลให้แล้ว!",
        description: "กรุณาตรวจสอบรายละเอียดเพิ่มเติมด้านล่าง",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    }
  }, [location, toast]);

  const handleGenerateDoc = async () => {
    if (!formData.studentId || !formData.name || !formData.formType) {
      toast({ title: "ข้อมูลไม่ครบ", description: "กรุณากรอกข้อมูลพื้นฐานให้ครบถ้วน", variant: "destructive" });
      return;
    }

    setLoading(true);
    const finalPayload = { ...formData, ...dynamicData };

    try {
        const response = await fetch(`${API_URL}/generate-form`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalPayload),
        });

        if (!response.ok) throw new Error("Server response was not ok");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Filled_${formData.formType}_${formData.studentId}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast({
            title: "สร้างเอกสารสำเร็จ! 🎉",
            description: "ดาวน์โหลดไฟล์เรียบร้อยแล้ว",
        });

    } catch (error) {
        console.error("Error:", error);
        toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถสร้างเอกสารได้",
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Button 
                variant="ghost" 
                className="pl-0 text-slate-500 hover:text-orange-600 -ml-2 mb-2" 
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> กลับไปแชท
              </Button>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="h-8 w-8 text-orange-500" />
                ระบบสร้างคำร้องอัตโนมัติ
              </h1>
            </div>
          </div>

          {isAiFilled && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 shadow-sm animate-in slide-in-from-top-2">
              <div className="bg-green-100 p-2 rounded-full">
                <Sparkles className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">ข้อมูลถูกเติมให้อัตโนมัติโดย AI</h3>
                <p className="text-sm text-green-700 mt-1">
                  ระบบได้ดึงข้อมูลจากการสนทนามาใส่ให้แล้ว กรุณาตรวจสอบความถูกต้องก่อนกดดาวน์โหลด
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-12 lg:col-span-5 space-y-6">
              <Card className="p-6 border-slate-200 shadow-md">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-700">
                  <span className="bg-orange-100 w-7 h-7 flex items-center justify-center rounded-full text-orange-600 text-sm">1</span>
                  เลือกประเภทเอกสาร
                </h2>
                <div className="space-y-2">
                  <Label>แบบฟอร์มที่ต้องการยื่น</Label>
                  <Select 
                    value={formData.formType} 
                    onValueChange={(val) => {
                      setFormData({...formData, formType: val});
                      setDynamicData({});
                    }}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-orange-500 bg-white">
                      <SelectValue placeholder="-- เลือกแบบฟอร์ม --" />
                    </SelectTrigger>
                    <SelectContent>
                      {forms.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          <span className="font-medium text-orange-600 mr-2">{f.id}</span>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              <Card className="p-6 border-slate-200 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2 text-slate-700">
                    <span className="bg-orange-100 w-7 h-7 flex items-center justify-center rounded-full text-orange-600 text-sm">2</span>
                    ข้อมูลนักศึกษา
                  </h2>
                  {isAiFilled && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Auto-filled</Badge>}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="flex items-center gap-2 text-slate-600 mb-1"><Hash className="w-4 h-4" /> รหัสนักศึกษา</Label>
                    <Input value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} className="h-11 rounded-xl" placeholder="6xxxxxxxxxx" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 text-slate-600 mb-1"><User className="w-4 h-4" /> ชื่อ-นามสกุล</Label>
                    <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="h-11 rounded-xl" placeholder="นายรักเรียน..." />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 text-slate-600 mb-1"><School className="w-4 h-4" /> คณะ/ภาควิชา</Label>
                    <Input value={formData.faculty} onChange={(e) => setFormData({...formData, faculty: e.target.value})} className="h-11 rounded-xl" placeholder="วิศวกรรมศาสตร์" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 text-slate-600 mb-1"><Calendar className="w-4 h-4" /> ชั้นปี</Label>
                    <Select value={formData.year} onValueChange={(val) => setFormData({...formData, year: val})}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="เลือกชั้นปี" /></SelectTrigger>
                      <SelectContent>{[1, 2, 3, 4, 5, 6].map(y => (<SelectItem key={y} value={y.toString()}>ปี {y}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </div>

            <div className="md:col-span-12 lg:col-span-7 space-y-6">
              {formData.formType && FORM_CONFIG[formData.formType] ? (
                <Card className="p-6 border-slate-200 shadow-md animate-in fade-in zoom-in duration-300 min-h-[400px] flex flex-col">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                      <span className="bg-orange-100 w-8 h-8 flex items-center justify-center rounded-full text-orange-600 text-lg">3</span>
                      รายละเอียด ({formData.formType})
                    </h2>
                    <span className="text-xs text-slate-400">กรอกข้อมูลให้ครบถ้วน</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-5 flex-1 content-start">
                    {FORM_CONFIG[formData.formType].map((field) => (
                      <div key={field.key} className={`space-y-2 ${field.width === "full" ? "col-span-2" : field.width === "third" ? "col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1" : "col-span-2 md:col-span-1"}`}>
                        <Label className="text-slate-700 font-medium flex items-center gap-2">
                          {field.icon && <field.icon className="w-4 h-4 text-slate-400" />}
                          {field.label}
                        </Label>
                        
                        {field.type === "textarea" ? (
                          <Textarea 
                            placeholder={field.placeholder}
                            value={dynamicData[field.key] || ""}
                            onChange={(e) => setDynamicData({...dynamicData, [field.key]: e.target.value})}
                            className="rounded-xl min-h-[120px] bg-slate-50/50 border-slate-200 focus-visible:ring-orange-500"
                          />
                        ) : (
                          <Input 
                            type={field.type}
                            placeholder={field.placeholder}
                            value={dynamicData[field.key] || ""}
                            onChange={(e) => setDynamicData({...dynamicData, [field.key]: e.target.value})}
                            className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-orange-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100">
                    <Button 
                      onClick={handleGenerateDoc}
                      disabled={loading}
                      className="w-full h-14 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-lg shadow-lg shadow-orange-200 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                          กำลังสร้างเอกสาร...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Download className="w-5 h-5" />
                          สร้างและดาวน์โหลดไฟล์ Word
                        </span>
                      )}
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-400 flex-col gap-4 min-h-[400px]">
                  <div className="bg-white p-6 rounded-full shadow-sm">
                    <FileType className="w-12 h-12 text-slate-300" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-slate-600">ยังไม่ได้เลือกแบบฟอร์ม</h3>
                    <p className="text-sm">กรุณาเลือกประเภทฟอร์มทางซ้าย เพื่อกรอกรายละเอียด</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FormGuide;