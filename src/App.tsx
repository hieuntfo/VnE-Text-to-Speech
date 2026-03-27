import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  Globe, 
  Wand2,
  FileText,
  Activity,
  Volume2,
  Menu,
  Search,
  User
} from 'lucide-react';
import AudioPlayer from './components/AudioPlayer';
import DashboardCards from './components/DashboardCards';

export default function App() {
  const [isConverting, setIsConverting] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState('Zephyr');
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState({ hook: '', body: '', cta: '' });
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleConvert = async () => {
    if (!inputText.trim()) return;
    setIsConverting(true);
    setHasResult(false);
    setAudioUrl(null);
    setError(null);
    setScript({ hook: '', body: '', cta: '' });
    
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, voice: selectedVoice })
      });
      
      const textResponse = await response.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        console.error("Non-JSON response:", textResponse);
        throw new Error(`Server returned an invalid response: ${textResponse.substring(0, 50)}...`);
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate audio');
      }
      
      if (data.audio) {
        setAudioUrl(data.audio);
      }
      if (data.script) {
        setScript(data.script);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsConverting(false);
      setHasResult(true);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <div className="min-h-screen bg-vne-bg text-vne-text font-sans">
      {/* Top Navbar mimicking VnExpress */}
      <header className="border-b border-vne-border bg-vne-bg">
        <div className="max-w-[1160px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="text-vne-text hover:text-vne-primary transition-colors">
              <Menu size={24} />
            </button>
            <div className="font-serif text-2xl font-bold text-vne-primary tracking-tighter">
              VnExpress
            </div>
            <nav className="hidden md:flex items-center gap-4 text-[14px] font-bold">
              <a href="#" className="hover:text-vne-primary transition-colors">Thời sự</a>
              <a href="#" className="hover:text-vne-primary transition-colors">Góc nhìn</a>
              <a href="#" className="hover:text-vne-primary transition-colors">Thế giới</a>
              <a href="#" className="hover:text-vne-primary transition-colors">Kinh doanh</a>
              <a href="#" className="hover:text-vne-primary transition-colors">Công nghệ</a>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-vne-text-sec">
            <button className="hover:text-vne-primary transition-colors"><Search size={20} /></button>
            <button className="hover:text-vne-primary transition-colors flex items-center gap-1 text-[14px]">
              <User size={20} /> Đăng nhập
            </button>
          </div>
        </div>
        <div className="border-t border-vne-border bg-vne-bg-sec">
          <div className="max-w-[1160px] mx-auto px-4 h-10 flex items-center text-[14px] text-vne-text-sec gap-2">
            <span>Công cụ Tòa soạn</span>
            <span>/</span>
            <span className="text-vne-primary font-bold">Social Audio Converter</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1160px] mx-auto px-4 py-6">
        <div className="mb-6 border-b border-vne-border pb-4">
          <h1 className="font-serif text-[32px] font-bold leading-[1.4] text-vne-text">
            Chuyển đổi bài viết thành Audio Social
          </h1>
          <p className="text-[14px] text-vne-text-sec mt-2">
            Hệ thống tự động tóm tắt và tạo giọng đọc AI chuẩn báo chí.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column: Input (60%) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-vne-bg border border-vne-border p-4">
              <div className="flex items-center gap-2 mb-4 border-b border-vne-border pb-2">
                <FileText className="text-vne-primary" size={20} />
                <h2 className="font-serif text-[18px] font-bold">Nội dung bài báo gốc</h2>
              </div>
              
              <textarea 
                className="w-full min-h-[400px] resize-y bg-vne-bg border border-vne-border p-4 font-serif text-[18px] leading-[1.6] text-vne-text focus:outline-none focus:border-vne-primary transition-colors"
                placeholder="Dán toàn bộ nội dung bài báo VnExpress vào đây..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <label className="text-[14px] text-vne-text-sec flex items-center gap-1">
                    <Globe size={14} /> Quốc gia mục tiêu
                  </label>
                  <select className="w-full bg-vne-bg border border-vne-border p-2 text-[14px] focus:outline-none focus:border-vne-primary appearance-none rounded-none">
                    <option>Hoa Kỳ (US)</option>
                    <option>Úc (AU)</option>
                    <option>Canada (CA)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] text-vne-text-sec flex items-center gap-1">
                    <Mic size={14} /> Giọng đọc (Voice Tone)
                  </label>
                  <select 
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full bg-vne-bg border border-vne-border p-2 text-[14px] focus:outline-none focus:border-vne-primary appearance-none rounded-none"
                  >
                    <option value="Zephyr">Nam trầm ấm (Authoritative)</option>
                    <option value="Kore">Nữ kể chuyện (Engaging)</option>
                    <option value="Puck">Bản tin nhanh (Dynamic)</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleConvert}
                disabled={isConverting || !inputText.trim()}
                className="w-full mt-6 py-3 bg-vne-primary text-white font-bold text-[16px] flex items-center justify-center gap-2 hover:bg-[#801b3e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
              >
                {isConverting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Activity size={20} />
                  </motion.div>
                ) : (
                  <Wand2 size={20} />
                )}
                {isConverting ? 'Đang xử lý AI...' : 'Chuyển đổi & Tạo Audio'}
              </button>
            </div>

            {/* Analytics moved to left column bottom to fit layout */}
            <div className="mt-2">
              <h2 className="font-serif text-[18px] font-bold mb-4 border-b border-vne-border pb-2 flex items-center gap-2">
                <Activity className="text-vne-primary" size={20} />
                Hiệu suất & Thống kê
              </h2>
              <DashboardCards hasResult={hasResult} />
            </div>
          </div>

          {/* Right Column: Output (40%) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-vne-bg-sec border border-vne-border p-4">
              <div className="flex items-center justify-between mb-4 border-b border-vne-border pb-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="text-vne-primary" size={20} />
                  <h2 className="font-serif text-[18px] font-bold">Kịch bản & Audio</h2>
                </div>
                {hasResult && (
                  <span className="text-[12px] text-vne-primary font-bold uppercase">
                    Hoàn tất
                  </span>
                )}
              </div>

              {/* Audio Player */}
              <div className="mb-6">
                <AudioPlayer 
                  audioUrl={audioUrl}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  togglePlay={togglePlay}
                  audioRef={audioRef}
                  hasResult={hasResult}
                  error={error}
                />
              </div>

              {/* Script Output */}
              <div className="bg-vne-bg border border-vne-border p-4 min-h-[300px] relative">
                {!hasResult && !isConverting && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-vne-text-sec">
                    <Wand2 size={32} className="mb-2 opacity-50" />
                    <p className="text-[14px]">Kịch bản tối ưu sẽ hiển thị tại đây</p>
                  </div>
                )}

                {isConverting && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-vne-text-sec">
                    <div className="flex gap-1 mb-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-vne-primary rounded-none"
                          animate={{ y: ["0%", "-100%", "0%"] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                    <p className="text-[14px]">Đang phân tích cấu trúc...</p>
                  </div>
                )}

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-vne-primary bg-vne-bg/90 p-4 text-center z-10"
                    >
                      <p className="font-bold mb-1">Lỗi chuyển đổi</p>
                      <p className="text-[14px]">{error}</p>
                    </motion.div>
                  )}

                  {hasResult && !error && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      {script.hook && (
                        <div className="border-b border-vne-border pb-4">
                          <span className="text-[12px] font-bold text-vne-primary uppercase mb-1 block">Phần mở đầu (Hook)</span>
                          <p className="font-serif text-[18px] leading-[1.6] text-vne-text font-bold">{script.hook}</p>
                        </div>
                      )}
                      
                      {script.body && (
                        <div className="border-b border-vne-border pb-4">
                          <span className="text-[12px] font-bold text-vne-text-sec uppercase mb-1 block">Nội dung chính (Body)</span>
                          <p className="font-serif text-[18px] leading-[1.6] text-vne-text">{script.body}</p>
                        </div>
                      )}

                      {script.cta && (
                        <div>
                          <span className="text-[12px] font-bold text-vne-text-sec uppercase mb-1 block">Kêu gọi hành động (CTA)</span>
                          <p className="font-serif text-[18px] leading-[1.6] text-vne-text font-bold">{script.cta}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
