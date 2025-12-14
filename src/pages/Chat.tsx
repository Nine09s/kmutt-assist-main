import { useState, useEffect, useRef, useMemo } from "react";
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
  User as UserIcon,
  Bot,
  Sparkles,
  ArrowUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "../AuthContext"; // ✅ Import useAuth เข้าม

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

const normalizeFormData = (rawData: any) => {
  if (!rawData || typeof rawData !== "object") return null;
  return {
    ...rawData,
    department: rawData.department || rawData.major || "",
    student_id: rawData.student_id ? String(rawData.student_id).replace(/\s/g, "") : "",
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

  const API_URL = "https://kmutt-backend-production.up.railway.app";

  useEffect(() => {
    if (!user) {
      console.log("🚫 Access Denied: Redirecting to Login");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const quickQuestions = [
    "ขอลาป่วย",
    "ขอลาพักการศึกษา",
    "ถอนวิชาเรียน",
    "ขอใบเกรด (Transcript)",
  ];

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem("chat_history");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const savedDraft = localStorage.getItem("chat_input_draft");
    if (savedDraft) {
      setInput(savedDraft);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chat_input_draft", input);
  }, [input]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setShowScrollTop(scrollTop > 300);
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
        content: data.reply || "ขออภัยครับ ระบบประมวลผลผิดพลาด",
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง" },
      ]);
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
          {/* Main Chat Content */}
          <h1>Refactored Chat Component Here</h1>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
