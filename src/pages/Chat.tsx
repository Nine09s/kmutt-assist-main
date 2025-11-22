import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send, FileText, ChevronDown, ChevronUp, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ doc: string; page: number }>;
  relatedForms?: string[];
  suggestions?: string[];
}

const Chat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<number | null>(null);

  const quickQuestions = [
    "ขั้นตอนการลาพักการศึกษา",
    "วิธีถอนรายวิชา",
    "การขอผ่อนผันค่าเทอม",
    "เอกสารที่ต้องใช้สำหรับโอนย้าย",
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate API response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: `ขั้นตอนการ${input}:\n\n1. เตรียมเอกสารที่จำเป็น\n2. กรอกแบบฟอร์มให้ครบถ้วน\n3. ยื่นคำร้องที่งานทะเบียน\n4. รอการอนุมัติ (ประมาณ 3-5 วันทำการ)\n\nสำหรับข้อมูลเพิ่มเติม สามารถดาวน์โหลดแบบฟอร์มด้านล่างได้เลยครับ`,
        sources: [
          { doc: "ระเบียบการศึกษา KMUTT 2566", page: 15 },
          { doc: "คู่มือนักศึกษา", page: 42 },
        ],
        relatedForms: ["RO.01", "RO.12"],
        suggestions: [
          "เอกสารที่ต้องใช้มีอะไรบ้าง",
          "ระยะเวลาในการพิจารณา",
          "สามารถยื่นคำร้องออนไลน์ได้ไหม",
        ],
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              ค้นหาข้อมูลคำร้อง
            </h1>
            <p className="text-muted-foreground">
              ถามคำถามเกี่ยวกับคำร้องต่างๆ ของ KMUTT
            </p>
          </div>

          {messages.length === 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-foreground mb-3">
                คำถามยอดนิยม:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                    className="rounded-full"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Card className="mb-6 min-h-[500px] flex flex-col">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      เริ่มต้นสนทนาด้วยการถามคำถามเกี่ยวกับคำร้อง
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index}>
                    <div
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-sm ml-auto"
                            : "bg-muted text-foreground rounded-bl-sm mr-auto"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>

                    {message.role === "assistant" && message.sources && (
                      <div className="mt-2 ml-0 mr-auto max-w-[80%]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedSources(
                              expandedSources === index ? null : index
                            )
                          }
                          className="text-xs text-muted-foreground"
                        >
                          แหล่งอ้างอิง ({message.sources.length})
                          {expandedSources === index ? (
                            <ChevronUp className="ml-1 h-3 w-3" />
                          ) : (
                            <ChevronDown className="ml-1 h-3 w-3" />
                          )}
                        </Button>
                        {expandedSources === index && (
                          <div className="mt-2 space-y-1">
                            {message.sources.map((source, i) => (
                              <p key={i} className="text-xs text-muted-foreground">
                                • {source.doc} (หน้า {source.page})
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {message.role === "assistant" && message.relatedForms && (
                      <div className="mt-3 ml-0 mr-auto max-w-[80%] flex flex-wrap gap-2">
                        {message.relatedForms.map((form) => (
                          <Button
                            key={form}
                            variant="outline"
                            size="sm"
                            className="gap-2 rounded-full"
                            onClick={() => {
                              toast({
                                title: "กำลังดาวน์โหลด",
                                description: `ฟอร์ม ${form}`,
                              });
                            }}
                          >
                            <Download className="h-3 w-3" />
                            {form}
                          </Button>
                        ))}
                      </div>
                    )}

                    {message.role === "assistant" && message.suggestions && (
                      <div className="mt-3 ml-0 mr-auto max-w-[80%]">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          คำถามที่เกี่ยวข้อง:
                        </p>
                        <div className="space-y-1">
                          {message.suggestions.map((suggestion) => (
                            <Button
                              key={suggestion}
                              variant="ghost"
                              size="sm"
                              onClick={() => setInput(suggestion)}
                              className="w-full justify-start text-xs h-auto py-2 px-3 text-left whitespace-normal"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground rounded-2xl rounded-bl-sm px-4 py-3 mr-auto">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="พิมพ์คำถามของคุณ..."
                  className="rounded-xl"
                  disabled={loading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="rounded-xl"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chat;
