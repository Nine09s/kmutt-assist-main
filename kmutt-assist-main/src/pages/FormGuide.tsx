import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FileText,
  Download,
  Copy,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FormGuide = () => {
  const { toast } = useToast();
  const [selectedForm, setSelectedForm] = useState("");
  const [studentData, setStudentData] = useState({
    studentId: "",
    name: "",
    faculty: "",
    year: "",
  });
  const [showGuidance, setShowGuidance] = useState(false);

  const forms = [
    { id: "RO.01", name: "แบบคำร้องขอลาพักการศึกษา" },
    { id: "RO.12", name: "แบบคำร้องขอถอนรายวิชา" },
    { id: "RO.16", name: "แบบคำร้องขอลาป่วย/ลากิจ" },
    { id: "RO.18", name: "แบบคำร้องขอเพิ่มรายวิชา" },
    { id: "RO.19", name: "แบบคำร้องขอโอนย้ายคณะ" },
    { id: "RO.22", name: "แบบคำร้องขอผ่อนผันการชำระเงิน" },
  ];

  const guidance = {
    fields: [
      {
        label: "เลขประจำตัวนักศึกษา",
        instruction: "กรอกเลขประจำตัวนักศึกษา 10 หลัก",
        example: "6501234567",
        warning: "ตรวจสอบให้แน่ใจว่าเลขถูกต้อง",
      },
      {
        label: "ชื่อ-นามสกุล",
        instruction: "กรอกชื่อและนามสกุลภาษาไทยตามบัตรประชาชน",
        example: "นายสมชาย ใจดี",
        warning: "ห้ามใช้ชื่อเล่นหรือชื่อย่อ",
      },
      {
        label: "คณะ/สาขา",
        instruction: "ระบุคณะและสาขาที่กำลังศึกษา",
        example: "วิศวกรรมศาสตร์ / วิศวกรรมคอมพิวเตอร์",
        warning: "ต้องตรงกับทะเบียนนักศึกษา",
      },
      {
        label: "ชั้นปี",
        instruction: "ระบุชั้นปีที่กำลังศึกษา",
        example: "ปี 2",
        warning: "",
      },
    ],
    checklist: [
      "สำเนาบัตรประจำตัวนักศึกษา",
      "สำเนาใบรายงานผลการศึกษา",
      "หนังสือรับรองจากอาจารย์ที่ปรึกษา",
      "เอกสารแสดงเหตุผลประกอบ (ถ้ามี)",
    ],
    steps: [
      "กรอกข้อมูลในแบบฟอร์มให้ครบถ้วน",
      "ขอลายเซ็นอาจารย์ที่ปรึกษา",
      "แนบเอกสารประกอบตาม Checklist",
      "ยื่นที่งานทะเบียนและวัดผล",
      "รอการอนุมัติ (3-5 วันทำการ)",
      "ตรวจสอบผลการพิจารณาที่ระบบ",
    ],
  };

  const handleGenerate = () => {
    if (!selectedForm || !studentData.studentId || !studentData.name) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive",
      });
      return;
    }
    setShowGuidance(true);
  };

  const handleExportPDF = () => {
    toast({
      title: "กำลัง Export เป็น PDF",
      description: "กรุณารอสักครู่...",
    });
  };

  const handleCopy = () => {
    toast({
      title: "คัดลอกคำแนะนำแล้ว",
      description: "นำไปใช้งานได้เลย",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              สร้างคำแนะนำการกรอกฟอร์ม
            </h1>
            <p className="text-muted-foreground">
              เลือกฟอร์มและกรอกข้อมูล เพื่อรับคำแนะนำการกรอกอัตโนมัติ
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Step 1: เลือกฟอร์ม
                </h2>
                <Select value={selectedForm} onValueChange={setSelectedForm}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="เลือกฟอร์มที่ต้องการ" />
                  </SelectTrigger>
                  <SelectContent>
                    {forms.map((form) => (
                      <SelectItem key={form.id} value={form.id}>
                        {form.id} - {form.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  Step 2: กรอกข้อมูลนักศึกษา
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="studentId">เลขประจำตัวนักศึกษา</Label>
                    <Input
                      id="studentId"
                      value={studentData.studentId}
                      onChange={(e) =>
                        setStudentData({ ...studentData, studentId: e.target.value })
                      }
                      placeholder="6501234567"
                      className="rounded-xl mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                    <Input
                      id="name"
                      value={studentData.name}
                      onChange={(e) =>
                        setStudentData({ ...studentData, name: e.target.value })
                      }
                      placeholder="นายสมชาย ใจดี"
                      className="rounded-xl mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="faculty">คณะ/สาขา</Label>
                    <Input
                      id="faculty"
                      value={studentData.faculty}
                      onChange={(e) =>
                        setStudentData({ ...studentData, faculty: e.target.value })
                      }
                      placeholder="วิศวกรรมศาสตร์ / คอมพิวเตอร์"
                      className="rounded-xl mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">ชั้นปี</Label>
                    <Select
                      value={studentData.year}
                      onValueChange={(value) =>
                        setStudentData({ ...studentData, year: value })
                      }
                    >
                      <SelectTrigger className="rounded-xl mt-1">
                        <SelectValue placeholder="เลือกชั้นปี" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">ปี 1</SelectItem>
                        <SelectItem value="2">ปี 2</SelectItem>
                        <SelectItem value="3">ปี 3</SelectItem>
                        <SelectItem value="4">ปี 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  className="w-full mt-6 rounded-xl"
                  size="lg"
                >
                  สร้างคำแนะนำ
                </Button>
              </Card>
            </div>

            <div className="space-y-6">
              {showGuidance ? (
                <>
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">คำแนะนำการกรอกฟอร์ม</h2>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopy}
                          className="rounded-xl gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExportPDF}
                          className="rounded-xl gap-2"
                        >
                          <Download className="h-4 w-4" />
                          PDF
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {guidance.fields.map((field, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl bg-muted/50 border border-border"
                        >
                          <h3 className="font-semibold text-sm mb-2">
                            {field.label}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {field.instruction}
                          </p>
                          <p className="text-sm text-primary mb-2">
                            ตัวอย่าง: {field.example}
                          </p>
                          {field.warning && (
                            <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400">
                              <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              <span>{field.warning}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">
                      Checklist เอกสารประกอบ
                    </h2>
                    <div className="space-y-3">
                      {guidance.checklist.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Checkbox id={`check-${index}`} />
                          <Label
                            htmlFor={`check-${index}`}
                            className="text-sm cursor-pointer"
                          >
                            {item}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">
                      ขั้นตอนการยื่นคำร้อง
                    </h2>
                    <div className="space-y-3">
                      {guidance.steps.map((step, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                            {index + 1}
                          </div>
                          <p className="text-sm text-foreground pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Button
                    variant="outline"
                    className="w-full rounded-xl gap-2"
                    onClick={() => {
                      toast({
                        title: "กำลังดาวน์โหลดฟอร์ม",
                        description: `ฟอร์ม ${selectedForm}`,
                      });
                    }}
                  >
                    <Download className="h-4 w-4" />
                    ดาวน์โหลดฟอร์ม {selectedForm}
                  </Button>
                </>
              ) : (
                <Card className="p-12 flex flex-col items-center justify-center text-center min-h-[500px]">
                  <FileText className="h-20 w-20 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    เลือกฟอร์มและกรอกข้อมูล
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    คำแนะนำการกรอกฟอร์มจะแสดงที่นี่
                  </p>
                </Card>
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
