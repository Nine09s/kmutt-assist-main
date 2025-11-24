import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send, FileText, ChevronDown, ChevronUp, ExternalLink, Trash2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Source {
  doc: string;
  page: number;
  url: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

const Chat = () => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 👇 แก้ URL ngrok ของคุณที่นี่ (สำคัญ!)
  const API_URL = "https://unthwarted-zoe-supermodestly.ngrok-free.dev"; 

  const quickQuestions = [
    "ขอลาป่วยทำยังไง",
    "ขอลาพักการศึกษา",
    "ถอนวิชาทำยังไง",
    "ขอใบเกรด (Transcript)",
  ];

  // ✅ 1. จำประวัติแชท (Persistence)
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem("chat_history");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ บันทึกทุกครั้งที่แชทเปลี่ยน
  useEffect(() => {
    sessionStorage.setItem("chat_history", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    sessionStorage.removeItem("chat_history");
  };

  // ✅ 2. แปลง Text เป็น Link ที่กดได้
  const renderMessageContent = (text: string) => {
    // Regex จับ URL
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all hover:text-blue-800 font-medium"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
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
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col h-[calc(100vh-60px)]">
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4 shrink-0">
            <div>
              <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                <MessageSquare className="w-8 h-8" /> น้องผู้ช่วย มจธ.
              </h1>
              <p className="text-sm text-muted-foreground">ถามเรื่องทะเบียน เอกสาร คำร้อง ได้ตลอด 24 ชม.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClearChat} className="text-muted-foreground hover:text-red-500">
              <Trash2 className="w-4 h-4 mr-2" /> ล้างแชท
            </Button>
          </div>

          {/* Chat Area */}
          <Card className="flex-1 flex flex-col shadow-md border border-slate-200 overflow-hidden rounded-xl bg-white">
            
            {/* Messages List */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 space-y-6 overflow-y-auto bg-slate-50/50 scroll-smooth"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-40 space-y-4">
                  <div className="bg-slate-100 p-6 rounded-full">
                    <FileText className="h-16 w-16 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">สวัสดีครับ! มีอะไรให้ช่วยไหม?</p>
                    <p className="text-sm">ลองเลือกคำถามแนะนำด้านล่าง หรือพิมพ์ถามได้เลย</p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] space-y-2 ${message.role === "user" ? "items-end flex flex-col" : ""}`}>
                      
                      {/* Bubble ข้อความ */}
                      <div className={`rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-white border border-slate-100 text-slate-800 rounded-bl-sm"
                        }`}
                      >
                        {renderMessageContent(message.content)}
                      </div>

                      {/* ส่วนแสดง Sources (เฉพาะ Assistant) */}
                      {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                        <div className="ml-1 animate-in fade-in zoom-in duration-300">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedSources(expandedSources === index ? null : index)}
                            className="text-xs h-7 bg-white border-slate-200 hover:bg-slate-50"
                          >
                            📚 เอกสารอ้างอิง ({message.sources.length})
                            {expandedSources === index ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
                          </Button>
                          
                          {expandedSources === index && (
                            <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200 shadow-sm space-y-1">
                              {message.sources.map((source, i) => (
                                <a 
                                  key={i} 
                                  href={source.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-xs p-2 hover:bg-blue-50 rounded-md transition-colors group"
                                >
                                  <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                                  <span className="text-slate-600 group-hover:text-blue-700 font-medium truncate flex-1">
                                    {source.doc}
                                  </span>
                                  <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-400" />
                                </a>
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
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area + Quick Questions */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              {/* ✅ 3. คำถามยอดนิยม (อยู่เหนือช่องพิมพ์ตลอด) */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-hide">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={loading}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 text-xs text-slate-600 hover:bg-primary hover:text-white transition-colors border border-slate-200 font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="พิมพ์คำถามของคุณที่นี่..."
                  className="rounded-full bg-slate-50 border-slate-200 focus-visible:ring-primary h-11"
                  disabled={loading}
                />
                <Button 
                  onClick={() => handleSend()} 
                  disabled={!input.trim() || loading} 
                  className="rounded-full w-11 h-11 p-0 shadow-md bg-primary hover:bg-primary/90"
                >
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