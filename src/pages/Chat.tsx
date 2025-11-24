import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Send,
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  Trash2,
  ExternalLink,  
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  // ✅ เพิ่ม url: string เข้าไปใน Type definition
  sources?: Array<{ doc: string; page: number; url: string }>;
  relatedForms?: string[];
  suggestions?: string[];
}

const Chat = () => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<number | null>(null);

  // 👇 แก้ URL ngrok ของคุณที่นี่
  const API_URL = "https://unthwarted-zoe-supermodestly.ngrok-free.dev"; 

  // ✅ โหลดประวัติแชทเก่าเมื่อเปิดหน้าเว็บ
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem("chat_history");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ บันทึกประวัติแชททุกครั้งที่มีการเปลี่ยนแปลง
  useEffect(() => {
    sessionStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

  const handleClearChat = () => {
    setMessages([]);
    sessionStorage.removeItem("chat_history");
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    
    const currentQuestion = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentQuestion }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ติดต่อ Server ไม่ได้ เช็คว่าเปิด ngrok หรือยัง?",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">น้องผู้ช่วย มจธ. 🤖</h1>
              <p className="text-muted-foreground">ถามคำถามเกี่ยวกับคำร้องและระเบียบการได้เลย</p>
            </div>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleClearChat} className="text-red-500 hover:text-red-600">
                <Trash2 className="w-4 h-4 mr-2" /> ล้างแชท
              </Button>
            )}
          </div>

          <Card className="min-h-[600px] flex flex-col shadow-lg border-0">
            <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[600px]">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                  <FileText className="h-20 w-20 mb-4 text-slate-300" />
                  <p>ยังไม่มีข้อความ... ลองพิมพ์ถามอะไรดูสิครับ</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] space-y-2 ${message.role === "user" ? "items-end flex flex-col" : ""}`}>
                      
                      {/* กล่องข้อความ */}
                      <div className={`rounded-2xl px-5 py-4 shadow-sm ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-white border border-slate-100 text-slate-800 rounded-bl-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>

                      {/* ส่วนแสดง Sources (เฉพาะ Assistant) */}
                      {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                        <div className="ml-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedSources(expandedSources === index ? null : index)}
                            className="text-xs text-slate-500 h-8"
                          >
                            📚 แหล่งอ้างอิง ({message.sources.length})
                            {expandedSources === index ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
                          </Button>
                          
                          {expandedSources === index && (
                            <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2 animate-in fade-in slide-in-from-top-2">
                              {message.sources.map((source, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs">
                                  <FileText className="w-3 h-3 text-slate-400" />
                                  <span className="text-slate-600 truncate max-w-[200px]">{source.doc}</span>
                                  {source.url && source.url !== "#" && (
                                    <a 
                                      href={source.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="ml-auto text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full"
                                    >
                                      <ExternalLink className="w-3 h-3" /> ดาวน์โหลด
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100 rounded-b-xl">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="พิมพ์คำถามของคุณ..."
                  className="rounded-full bg-slate-50 border-slate-200 focus-visible:ring-primary"
                  disabled={loading}
                />
                <Button onClick={handleSend} disabled={!input.trim() || loading} className="rounded-full w-12 h-12 p-0 shadow-md">
                  <Send className="h-5 w-5" />
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
