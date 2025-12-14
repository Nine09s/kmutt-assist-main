import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Trash2, 
  MessageSquare, 
  ArrowRight, 
  Menu, 
  User as UserIcon, 
  Bot, 
  Sparkles, 
  ArrowUp 
} from "lucide-react";

import Navbar from "@/components/Navbar"; 
import Footer from "@/components/Footer"; 
import { useAuth } from "../AuthContext"; // ✅ Import useAuth เข้ามา-----

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

// ✅ Helper: Data Normalizer
const normalizeFormData = (rawData: any) => {
  if (!rawData || typeof rawData !== 'object') return null;
  return {
    ...rawData,
    department: rawData.department || rawData.major || "",
    student_id: rawData.student_id ? String(rawData.student_id).replace(/\s/g, '') : "",
    name: rawData.name || "",
    faculty: rawData.faculty || "",
    form_id: rawData.form_id || "",
    draft_reason: rawData.draft_reason || "",
    draft_subject: rawData.draft_subject || "",
  };
};

const Chat = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user } = useAuth(); 
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // ใช้ URL ตรงๆ เพื่อป้องกันปัญหา import.meta.env ในบาง Environment
  const API_URL = "https://kmutt-backend-production.up.railway.app"; 

  const quickQuestions = [
    "ขอลาป่วย",
    "ขอลาพักการศึกษา",
    "ถอนวิชาเรียน",
    "ขอใบเกรด (Transcript)",
  ];

  // Load Messages
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem("chat_history");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Load Draft
  useEffect(() => {
    const savedDraft = localStorage.getItem("chat_input_draft");
    if (savedDraft) {
      setInput(savedDraft);
    }
  }, []);

  // Save Messages & Scroll
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  // Save Draft
  useEffect(() => {
    localStorage.setItem("chat_input_draft", input);
  }, [input]);

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
    if (scrollTop > 300) {
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

  // Auto-send logic
  useEffect(() => {
    if (location.state && location.state.autoSend) {
      const messageToSend = location.state.autoSend;
      const lastMsg = messages[messages.length - 1];
      if (!lastMsg || lastMsg.content !== messageToSend) {
         handleSend(messageToSend);
      }
      window.history.replaceState({}, document.title);
    }
  }, []);

  const parseBotMessage = (content: string) => {
    if (!content) return { cleanContent: "", formData: null };

    const regex = /\[\[FORM_DATA:\s*([\s\S]*?)\]\]/; 
    const match = content.match(regex);
    
    if (match) {
      try {
        let jsonStr = match[1].trim();
        jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "");
        if (jsonStr.startsWith("{{") && jsonStr.endsWith("}}")) {
             jsonStr = jsonStr.slice(1, -1);
        }
        
        const rawData = JSON.parse(jsonStr);
        const formData = normalizeFormData(rawData);
        const cleanContent = content.replace(regex, "").trim(); 
        return { cleanContent, formData };
      } catch (e) {
        console.error("JSON Parse Error:", e);
        return { cleanContent: content, formData: null };
      }
    }
    return { cleanContent: content, formData: null };
  };

  const renderMessageContent = (text: string) => {
    if (!text) return null;
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
            className="text-orange-600 underline break-all hover:text-orange-800 font-medium"
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
    localStorage.removeItem("chat_input_draft");
    
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
        content: data.reply || "ขออภัยครับ ระบบประมวลผลผิดพลาด (No Reply Data)",
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "⚠️ เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้งครับ" 
      }]);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ติดต่อ Server ไม่ได้",
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
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full relative">
          
          <div className="flex justify-between items-center mb-4 shrink-0 px-2">
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-orange-500" /> น้องผู้ช่วย มจธ.
              </h1>
              <p className="text-xs text-slate-500">ที่ปรึกษางานทะเบียนและช่วยร่างเอกสาร 24 ชม.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClearChat} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-1" /> ล้างแชท
            </Button>
          </div>

          <Card className="flex-1 flex flex-col shadow-lg border border-slate-200 overflow-hidden rounded-xl bg-white relative">
            
            <div 
              ref={scrollRef} 
              onScroll={handleScroll}
              className="flex-1 p-4 space-y-6 overflow-y-auto bg-slate-50/50 scroll-smooth"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-60 space-y-4">
                  <div className="bg-orange-100 p-6 rounded-full animate-pulse">
                    <FileText className="h-12 w-12 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-700">สวัสดีครับ! ให้ผมช่วยอะไรดี?</p>
                    <p className="text-sm text-slate-500">พิมพ์เรื่องที่ต้องการยื่นคำร้อง เดี๋ยวผมช่วยร่างภาษาทางการให้ครับ</p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => {
                  const { cleanContent, formData } = message.role === "assistant" 
                    ? parseBotMessage(message.content)
                    : { cleanContent: message.content, formData: null };

                  return (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-2 ${
                        message.role === "user" ? "hidden" : "bg-orange-100
