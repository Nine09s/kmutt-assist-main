import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, FileText, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-light">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">KMUTT Assistant</span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            <Link to="/chat">
              <Button
                variant={isActive("/chat") ? "default" : "ghost"}
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                ค้นหาข้อมูลคำร้อง
              </Button>
            </Link>
            <Link to="/form-guide">
              <Button
                variant={isActive("/form-guide") ? "default" : "ghost"}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                สร้างคำร้อง
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            <Link to="/chat" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={isActive("/chat") ? "default" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                ค้นหาข้อมูลคำร้อง
              </Button>
            </Link>
            <Link to="/form-guide" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={isActive("/form-guide") ? "default" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <FileText className="h-4 w-4" />
                สร้างคำร้อง
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
