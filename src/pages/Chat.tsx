import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  MessageSquare, 
  ArrowRight, 
  Sparkles, 
  ArrowUp,
  Bot
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "../AuthContext";

// --- Interfaces ---
interface Source {
  doc: string;
  page: number;
  url: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  formData?: any;
}

// Helper function to clean up form data
const normalizeFormData = (rawData: any, user: any) => {
  if (!rawData) return null;
  return {
    ...rawData,
    student_id: user?.student_id || user?.uid || "",
    name: rawData.name || user?.displayName || "",
    faculty: rawData.faculty || "",
    // รองรับทั้ง department และ major เผื่อ AI ส่งมาไม่ตรง
    department: rawData.department || rawData.major || "",
    form_id: rawData.form_id || "",
    draft_reason: rawData.draft_reason || "",
    draft_subject: rawData.draft_subject || "",
  };
};

const Chat = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const [input, setInput] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  // Load chat history from localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem("chat_history");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [expandedSources, setExpandedSources] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // API URL Configuration
  const API_URL = "https://kmutt-backend-production.up.railway.app";

  // Auth Protection
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  // Load Input Draft
  useEffect(() => {
    const savedDraft = localStorage.getItem("chat_input_draft");
    if (savedDraft) setInput(savedDraft);
  }, []);

  // Save History & Scroll
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  // Save Input Draft
  useEffect(() => {
    localStorage.setItem("chat_input_draft", input);
  }, [input]);

  // Auto-send from navigation state
  useEffect(() => {
    if (user && location.state && location.state.autoSend) {
      const messageToSend = location.state.autoSend;
      const lastMsg = messages[messages.length - 1];
      if (!lastMsg || lastMsg.content !== messageToSend) {
        handleSend(messageToSend);
      }
      // Clear state to prevent loop
      window.history.replaceState({}, document.title);
    }
  }, [user, location.state, messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    // ปรับให้ปุ่มขึ้นง่ายขึ้น (เลื่อนลงมาแค่ 100px ก็โชว์เลย)
    if (scrollTop > 100) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setInput("");
    localStorage.removeItem("chat_history");
    localStorage.removeItem("chat_input_draft");
    toast({
      description: "ล้างประวัติการสนทนาเรียบร้อย",
    });
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: "user", content: text };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setLoadingMessages(true);

    try {
      // Create history payload (last 10 messages)
      const historyPayload = newHistory.slice(-10).map(({ role, content }) => ({ role, content }));

      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            message: text,
            history: historyPayload
        }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      let aiContent = data.reply;
      let parsedFormData = null;

      // Extract JSON [[FORM_DATA]]
      const formRegex = /\[\[FORM_DATA:\s*({[\s\S]*?})\]\]/;
      const match = aiContent.match(formRegex);

      if (match) {
        try {
            const jsonStr = match[1];
            const rawData = JSON.parse(jsonStr);
            parsedFormData = normalizeFormData(rawData, user);
            // Remove JSON from display text
            aiContent = aiContent.replace(match[0], "").trim(); 
        } catch (e) {
            console.error("JSON Parse Error", e);
        }
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: aiContent,
        sources: data.sources || [],
        formData: parsedFormData,
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับน้องมดได้",
        variant: "destructive",
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const quickQuestions = [
    "ลาป่วยต้องทำยังไง?",
    "ขอลาพักการศึกษา",
    "อยากถอนรายวิชา",
    "ขอใบรับรองเกรด",
    "ติดต่อห้องทะเบียน"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col h-[calc(100vh-130px)]">
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4 shrink-0 px-2">
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-orange-500" /> น้องผู้ช่วย มจธ.
              </h1>
              <p className="text-xs text-slate-500">
                ถามเรื่องทะเบียน เอกสาร คำร้อง ได้ตลอด 24 ชม.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" /> ล้างแชท
            </Button>
          </div>

          <Card className="flex-1 flex flex-col shadow-lg border border-slate-200 overflow-hidden rounded-xl bg-white relative">
            
            {/* Chat Area */}
            <div ref={scrollRef} onScroll={handleScroll} className="flex-1 p-4 space-y-6 overflow-y-auto bg-slate-50/50 scroll-smooth">
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
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    
                    {/* Bot Avatar */}
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-2 shrink-0 self-start mt-1">
                          <Bot className="w-5 h-5 text-orange-600" />
                      </div>
                    )}

                    <div className={`max-w-[85%] space-y-2`}>
                      {/* Chat Bubble */}
                      <div className={`p-3 rounded-xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                          message.role === "user" 
                          ? "bg-orange-500 text-white rounded-tr-none" 
                          : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                      }`}>
                          {message.content}
                      </div>

                      {/* ✅ Smart Draft & Form Button */}
                      {message.formData && (
                        <div className="mt-2 p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                            {/* ส่วนแสดงเหตุผลที่ AI ร่างให้ (Smart Draft UI) */}
                            {message.formData.draft_reason && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 text-xs text-green-800 shadow-sm relative overflow-hidden">
                                    {/* Decoration bg */}
                                    <div className="absolute top-0 right-0 -mt-2 -mr-2 w-10 h-10 bg-green-200 rounded-full opacity-20 blur-xl"></div>
                                    
                                    <div className="flex items-center gap-1.5 font-semibold mb-2 text-green-700">
                                        <Sparkles className="w-3.5 h-3.5 fill-green-500 text-green-600 animate-pulse" /> 
                                        AI ร่างคำร้องให้:
                                    </div>
                                    <p className="italic font-serif leading-relaxed text-slate-700 bg-white/60 p-2 rounded border border-green-100">
                                        "{message.formData.draft_reason}"
                                    </p>
                                </div>
                            )}

                            <h4 className="font-semibold text-slate-800 mb-1 flex items-center text-sm">
                                <FileText className="w-4 h-4 mr-1 text-orange-500" />
                                พร้อมสร้างเอกสาร: {message.formData.form_id}
                            </h4>
                            <p className="text-xs text-slate-500 mb-3">
                                หัวข้อ: {message.formData.draft_subject}
                            </p>
                            <Button 
                                size="sm" 
                                className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm h-9 text-xs"
                                onClick={() => navigate("/form-guide", { 
                                  state: { 
                                    ...message.formData, 
                                    // Ensure department is populated
                                    department: message.formData.department || message.formData.major || "" 
                                  } 
                                })}
                            >
                                ตรวจสอบและดาวน์โหลดเอกสาร <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                      )}

                      {/* Sources Accordion */}
                      {message.sources && message.sources.length > 0 && (
                          <div className="mt-1">
                               <button
                                  onClick={() => setExpandedSources(expandedSources === index ? null : index)}
                                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
                              >
                                  {expandedSources === index ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                  อ้างอิงจาก {message.sources.length} เอกสาร
                              </button>
                              
                              {expandedSources === index && (
                                  <div className="mt-2 space-y-1 pl-2 border-l-2 border-slate-200 animate-in slide-in-from-top-1 duration-200">
                                      {message.sources.map((src, i) => (
                                          <a 
                                              key={i} 
                                              href={src.url} 
                                              target="_blank" 
                                              rel="noreferrer"
                                              className="block text-xs text-blue-500 hover:underline truncate"
                                          >
                                              📄 {src.doc} (หน้า {src.page})
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
              
              {/* Loading Indicator */}
              {loadingMessages && (
                 <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                    </div>
                 </div>
              )}
            </div>

            {/* ⬆️ Scroll to Top Button (ลอยอยู่มุมขวาล่างของ Card) */}
            {showScrollTop && (
              <Button
                onClick={scrollToTop}
                className="absolute bottom-28 right-6 rounded-full w-10 h-10 p-0 shadow-xl bg-slate-700 hover:bg-slate-800 text-white animate-in fade-in zoom-in duration-300 z-50 opacity-90 hover:opacity-100 border border-slate-500"
                title="เลื่อนขึ้นบนสุด"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0 z-20">
              {/* Quick Questions */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-hide">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={loadingMessages}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-50 text-xs text-slate-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all border border-slate-200 font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Field */}
              <div className="flex gap-3 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="พิมพ์คำถามของคุณที่นี่..."
                  className="rounded-full bg-slate-50 border-slate-200 focus-visible:ring-orange-500 h-12 pl-5 pr-14 shadow-inner"
                  disabled={loadingMessages}
                />
                <Button 
                  onClick={() => handleSend()} 
                  disabled={!input.trim() || loadingMessages} 
                  className="absolute right-1 top-1 rounded-full w-10 h-10 p-0 shadow-sm bg-orange-500 hover:bg-orange-600 text-white transition-all hover:scale-105 active:scale-95"
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
