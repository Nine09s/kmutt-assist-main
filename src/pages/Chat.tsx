import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, FileText, ChevronDown, ChevronUp, ExternalLink, Trash2, MessageSquare, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// --- Inline Components (เพื่อแก้ปัญหา Import Error) ---

const Navbar = () => (
  <nav className="bg-white border-b border-slate-200 py-3 px-4 shadow-sm sticky top-0 z-50">
    <div className="container mx-auto max-w-4xl flex justify-between items-center">
      <div className="flex items-center gap-2 font-bold text-xl text-orange-600">
        <GraduationCap className="w-8 h-8" />
        <span>KMUTT Assistant</span>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-slate-100 border-t border-slate-200 py-4 mt-auto">
    <div className="container mx-auto text-center text-slate-500 text-xs">
      <p>© {new Date().getFullYear()} KMUTT Student Assistant. Created for educational purpose.</p>
    </div>
  </footer>
);

// --- Main Chat Component ---

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

  // ✅ CORRECT: Pointing to your live Railway Server
  const API_URL = "https://kmutt-backend-production.up.railway.app"; 

  const quickQuestions = [
    "ขอลาป่วยทำยังไง",
    "ขอลาพักการศึกษา",
    "ถอนวิชาทำยังไง",
    "ขอใบเกรด (Transcript)",
  ];

  // ✅ 1. Remember Chat History (Persistence)
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("chat_history");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // ✅ Save history whenever messages change
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

  // ✅ 2. Convert Text URLs to Clickable Links
  const renderMessageContent = (text: string) => {
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
      // 📡 Fetching from the Cloud (Railway)
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
        description: "ไม่สามารถติดต่อ Server ได้ (ลองรีเฟรชหรือเช็คอินเทอร์เน็ต)",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col h-[calc(100vh-130px)]">
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
          
          {/* Header Area inside Chat */}
          <div className="flex justify-between items-center mb-4 shrink-0 px-2">
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-orange-500" /> น้องผู้ช่วย มจธ.
              </h1>
              <p className="text-xs text-slate-500">ถามเรื่องทะเบียน เอกสาร คำร้อง ได้ตลอด 24 ชม.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClearChat} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-1" /> ล้างแชท
            </Button>
          </div>

          {/* Chat Card */}
          <Card className="flex-1 flex flex-col shadow-lg border border-slate-200 overflow-hidden rounded-xl bg-white">
            
            {/* Messages List */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 space-y-6 overflow-y-auto bg-slate-50/50 scroll-smooth"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-60 space-y-4">
                  <div className="bg-orange-100 p-6 rounded-full animate-pulse">
                    <FileText className="h-12 w-12 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-700">สวัสดีครับ! มีอะไรให้ช่วยไหม?</p>
                    <p className="text-sm text-slate-500">ลองเลือกคำถามแนะนำด้านล่าง หรือพิมพ์ถามได้เลย</p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[85%] md:max-w-[75%] space-y-2 ${message.role === "user" ? "items-end flex flex-col" : ""}`}>
                      
                      {/* Message Bubble */}
                      <div className={`rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed whitespace-pre-wrap break-words ${
                          message.role === "user"
                            ? "bg-orange-500 text-white rounded-br-sm"
                            : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                        }`}
                      >
                        {renderMessageContent(message.content)}
                      </div>

                      {/* Sources (Assistant Only) */}
                      {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                        <div className="ml-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedSources(expandedSources === index ? null : index)}
                            className="text-xs h-7 bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                          >
                            📚 เอกสารอ้างอิง ({message.sources.length})
                            {expandedSources === index ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
                          </Button>
                          
                          {expandedSources === index && (
                            <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200 shadow-sm space-y-1 w-full max-w-sm">
                              {message.sources.map((source, i) => (
                                <a 
                                  key={i} 
                                  href={source.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-xs p-2 hover:bg-orange-50 rounded-md transition-colors group"
                                >
                                  <FileText className="w-4 h-4 text-slate-400 group-hover:text-orange-500 shrink-0" />
                                  <span className="text-slate-600 group-hover:text-orange-700 font-medium truncate flex-1">
                                    {source.doc}
                                  </span>
                                  <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-orange-400 shrink-0" />
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
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              {/* Quick Questions */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-hide">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={loading}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-50 text-xs text-slate-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all border border-slate-200 font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="พิมพ์คำถามของคุณที่นี่..."
                  className="rounded-full bg-slate-50 border-slate-200 focus-visible:ring-orange-500 h-12 pl-5 pr-14"
                  disabled={loading}
                />
                <Button 
                  onClick={() => handleSend()} 
                  disabled={!input.trim() || loading} 
                  className="absolute right-1 top-1 rounded-full w-10 h-10 p-0 shadow-sm bg-orange-500 hover:bg-orange-600 text-white"
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