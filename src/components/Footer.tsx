const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © 2025 KMUTT University Request Assistant
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ระบบผู้ช่วยคำร้องอัจฉริยะของมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี
            </p>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              เกี่ยวกับ
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              ติดต่อเรา
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              นโยบายความเป็นส่วนตัว
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
