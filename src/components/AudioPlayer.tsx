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
    <div className={`p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 transition-opacity duration-500 ${hasResult && !error ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
      <audio 
        ref={audioRef} 
        src={audioUrl || undefined} 
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="hidden"
      />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-md shadow-red-600/20"
          >
            {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-1" />}
          </button>
          <button className="w-8 h-8 rounded-full bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors">
            <FastForward size={16} />
          </button>
        </div>
        <div className="text-xs font-mono text-neutral-500">
          {isPlaying ? 'Playing...' : (audioUrl ? 'Ready' : '00:00 / 00:00')}
        </div>
        <a 
          href={audioUrl || '#'} 
          download="vnexpress-audio.mp3"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-700 text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
        >
          <Download size={16} />
          <span>Export</span>
        </a>
      </div>
      {/* Waveform visualizer mock */}
      <div className="h-8 flex items-end gap-1 w-full">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div 
            key={i}
            className="flex-1 bg-neutral-300 dark:bg-neutral-600 rounded-t-sm"
            initial={{ height: '20%' }}
            animate={{ 
              height: isPlaying ? `${Math.random() * 80 + 20}%` : '20%',
              backgroundColor: isPlaying && i < 15 ? '#dc2626' : '' // Red for played portion
            }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
