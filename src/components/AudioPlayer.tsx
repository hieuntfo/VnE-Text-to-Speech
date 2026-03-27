import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, FastForward, Download } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  hasResult: boolean;
  error: string | null;
}

export default function AudioPlayer({
  audioUrl,
  isPlaying,
  setIsPlaying,
  togglePlay,
  audioRef,
  hasResult,
  error
}: AudioPlayerProps) {
  return (
    <div className={`bg-vne-bg border border-vne-border p-4 transition-opacity duration-500 ${hasResult && !error ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
      <audio 
        ref={audioRef} 
        src={audioUrl || undefined} 
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="hidden"
      />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={togglePlay}
            className="w-10 h-10 bg-vne-primary text-white flex items-center justify-center hover:bg-[#801b3e] transition-colors rounded-none"
          >
            {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-1" />}
          </button>
          <button className="w-8 h-8 bg-vne-bg-sec border border-vne-border text-vne-text flex items-center justify-center hover:bg-[#e5e5e5] transition-colors rounded-none">
            <FastForward size={16} />
          </button>
        </div>
        <div className="text-[14px] font-sans text-vne-text-sec">
          {isPlaying ? 'Đang phát...' : (audioUrl ? 'Sẵn sàng' : '00:00 / 00:00')}
        </div>
        <a 
          href={audioUrl || '#'} 
          download="vnexpress-audio.mp3"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 px-3 py-2 bg-vne-bg-sec border border-vne-border text-[14px] text-vne-text hover:text-vne-primary hover:border-vne-primary transition-colors rounded-none"
        >
          <Download size={16} />
          <span>Tải xuống</span>
        </a>
      </div>
      {/* Waveform visualizer mock */}
      <div className="h-8 flex items-end gap-[2px] w-full">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div 
            key={i}
            className="flex-1 bg-vne-border rounded-none"
            initial={{ height: '20%' }}
            animate={{ 
              height: isPlaying ? `${Math.random() * 80 + 20}%` : '20%',
              backgroundColor: isPlaying && i < 15 ? 'var(--color-vne-primary)' : 'var(--color-vne-border)'
            }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
