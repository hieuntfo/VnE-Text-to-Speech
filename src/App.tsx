/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  Mic, 
  Globe, 
  Play, 
  Pause, 
  FastForward, 
  Download, 
  Wand2,
  FileText,
  Activity,
  Volume2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

// Mock Data
const chartData = [
  { name: 'Mon', audios: 12 },
  { name: 'Tue', audios: 19 },
  { name: 'Wed', audios: 15 },
  { name: 'Thu', audios: 22 },
  { name: 'Fri', audios: 28 },
  { name: 'Sat', audios: 10 },
  { name: 'Sun', audios: 5 },
];

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
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-20 flex-shrink-0 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col items-center py-8 gap-8 z-10">
        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-red-600/20">
          V
        </div>
        <nav className="flex flex-col gap-6 mt-4">
          <button className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-red-600 dark:text-red-500 transition-colors">
            <LayoutDashboard size={24} />
          </button>
          <button className="p-3 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <History size={24} />
          </button>
          <button className="p-3 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <Settings size={24} />
          </button>
        </nav>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm z-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Social Audio Converter</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">VnExpress AI Editorial Tools</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 border-2 border-white dark:border-neutral-950 shadow-sm overflow-hidden">
              <img src="https://picsum.photos/seed/avatar/100/100" alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Conversion Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Input */}
              <div className="flex flex-col gap-6 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="text-red-600" size={20} />
                  <h2 className="text-lg font-semibold">Original Article</h2>
                </div>
                
                <textarea 
                  className="flex-1 min-h-[300px] w-full resize-none rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-shadow"
                  placeholder="Paste the VnExpress article content here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                      <Globe size={14} /> Target Country
                    </label>
                    <select className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 appearance-none">
                      <option>United States (US)</option>
                      <option>Australia (AU)</option>
                      <option>Canada (CA)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                      <Mic size={14} /> Voice Tone
                    </label>
                    <select 
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 appearance-none"
                    >
                      <option value="Zephyr">Deep Male (Authoritative)</option>
                      <option value="Kore">Storytelling Female (Engaging)</option>
                      <option value="Puck">Fast News (Dynamic)</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleConvert}
                  disabled={isConverting || !inputText.trim()}
                  className="w-full py-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {isConverting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Activity size={20} />
                    </motion.div>
                  ) : (
                    <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                  )}
                  {isConverting ? 'Processing AI Script...' : 'Convert & Generate Audio'}
                  
                  {/* Loading Progress Bar Effect */}
                  {isConverting && (
                    <motion.div 
                      className="absolute bottom-0 left-0 h-1 bg-red-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                    />
                  )}
                </button>
              </div>

              {/* Right Column: Output */}
              <div className="flex flex-col gap-6 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="text-red-600" size={20} />
                    <h2 className="text-lg font-semibold">Optimized Script & Audio</h2>
                  </div>
                  {hasResult && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full uppercase tracking-wider">
                      Ready
                    </span>
                  )}
                </div>

                <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 overflow-y-auto relative">
                  {!hasResult && !isConverting && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
                      <Wand2 size={48} className="mb-4 opacity-20" />
                      <p className="text-sm">Your optimized script will appear here</p>
                    </div>
                  )}

                  {isConverting && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
                      <div className="flex gap-1 mb-4">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-red-500 rounded-full"
                            animate={{ y: ["0%", "-100%", "0%"] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                      <p className="text-sm animate-pulse">Analyzing content structure...</p>
                    </div>
                  )}

                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-red-500 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm p-6 text-center z-10"
                      >
                        <Wand2 size={48} className="mb-4 opacity-50" />
                        <p className="font-semibold mb-2">Conversion Failed</p>
                        <p className="text-sm opacity-80 max-w-sm">{error}</p>
                      </motion.div>
                    )}

                    {hasResult && !error && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 text-sm leading-relaxed"
                      >
                        {script.hook && (
                          <div>
                            <span className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-md mb-2">HOOK</span>
                            <p className="font-medium text-lg">{script.hook}</p>
                            <div className="text-xs text-neutral-400 mt-1 font-mono">&lt;prosody rate="fast" pitch="high"&gt;</div>
                          </div>
                        )}
                        
                        {script.body && (
                          <div>
                            <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-md mb-2">BODY</span>
                            <p>{script.body}</p>
                            <div className="text-xs text-neutral-400 mt-1 font-mono">&lt;break time="500ms"/&gt; &lt;emphasis level="strong"&gt;</div>
                          </div>
                        )}

                        {script.cta && (
                          <div>
                            <span className="inline-block px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-md mb-2">CTA</span>
                            <p className="font-semibold">{script.cta}</p>
                            <div className="text-xs text-neutral-400 mt-1 font-mono">&lt;prosody rate="slow"&gt;</div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Audio Player */}
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
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Activity className="text-red-600" />
                Performance Analytics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                
                {/* Compression Rate Card */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                  <div className="text-sm font-medium text-neutral-500 mb-4">Compression Rate</div>
                  <div>
                    <div className="text-3xl font-light mb-1">92<span className="text-xl text-neutral-400">%</span></div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/30 inline-block px-2 py-1 rounded-md">
                      1500 words → 120 words
                    </div>
                  </div>
                </div>

                {/* Duration Card */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                  <div className="text-sm font-medium text-neutral-500 mb-4">Est. Audio Duration</div>
                  <div>
                    <div className="text-3xl font-light mb-1 text-green-600 dark:text-green-400">45<span className="text-xl text-neutral-400">s</span></div>
                    <div className="text-xs text-neutral-500">
                      Optimal for YouTube Shorts (&lt;60s)
                    </div>
                  </div>
                </div>

                {/* Emotion Score Card */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                  <div className="text-sm font-medium text-neutral-500 mb-4">Hook Emotion Score</div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="text-3xl font-light">88<span className="text-xl text-neutral-400">/100</span></div>
                      <div className="text-xs font-medium text-amber-600 dark:text-amber-400">High Engagement</div>
                    </div>
                    <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-amber-400 to-red-500"
                        initial={{ width: 0 }}
                        animate={{ width: hasResult ? '88%' : '0%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Chart Card */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm md:col-span-3 lg:col-span-1 flex flex-col">
                  <div className="text-sm font-medium text-neutral-500 mb-4">Weekly Output</div>
                  <div className="flex-1 min-h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#888' }} 
                          dy={10}
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="audios" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 4 ? '#dc2626' : '#e5e5e5'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
