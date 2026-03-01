import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Smartphone, 
  Settings, 
  Zap, 
  Download, 
  History, 
  CheckCircle2, 
  Terminal, 
  Copy, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft,
  Shield,
  Cpu,
  Code,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface APKConfig {
  id: string;
  url: string;
  appName: string;
  packageName: string;
  version: string;
  orientation: 'portrait' | 'landscape' | 'auto';
  androidVersion: string;
  themeColor: string;
  splashColor: string;
  features: {
    offlineMode: boolean;
    gps: boolean;
    camera: boolean;
    biometric: boolean;
    pushNotifications: boolean;
    jsInjection: boolean;
    zoom: boolean;
    pullToRefresh: boolean;
  };
  customJS: string;
  createdAt: number;
}

// --- Constants ---

const STORAGE_KEY = 'web2apk_jobs';

const INITIAL_CONFIG: APKConfig = {
  id: '',
  url: '',
  appName: '',
  packageName: 'com.myapp.web',
  version: '1.0.0',
  orientation: 'portrait',
  androidVersion: '13.0',
  themeColor: '#00ff41',
  splashColor: '#0a0a0a',
  features: {
    offlineMode: true,
    gps: false,
    camera: false,
    biometric: false,
    pushNotifications: true,
    jsInjection: false,
    zoom: true,
    pullToRefresh: true,
  },
  customJS: '',
  createdAt: 0,
};

// --- Components ---

export default function App() {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<APKConfig>(INITIAL_CONFIG);
  const [jobs, setJobs] = useState<APKConfig[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setJobs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const saveJob = (newJob: APKConfig) => {
    const updated = [newJob, ...jobs].slice(0, 10);
    setJobs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteJob = (id: string) => {
    const updated = jobs.filter(j => j.id !== id);
    setJobs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const startBuild = () => {
    setIsBuilding(true);
    setBuildProgress(0);
    setLogs(['[SYSTEM] Initializing build pipeline...', '[SYSTEM] Validating URL connectivity...']);
    
    const buildSteps = [
      { progress: 10, log: 'Fetching assets from ' + config.url },
      { progress: 25, log: 'Generating Android Manifest...' },
      { progress: 40, log: 'Injecting custom CSS/JS bridges...' },
      { progress: 55, log: 'Compiling Java/Kotlin wrappers...' },
      { progress: 70, log: 'Optimizing resource bundles...' },
      { progress: 85, log: 'Signing APK with release key...' },
      { progress: 100, log: 'Build successful! APK ready for download.' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < buildSteps.length) {
        const s = buildSteps[currentStep];
        setBuildProgress(s.progress);
        setLogs(prev => [...prev, `[BUILD] ${s.log}`]);
        currentStep++;
      } else {
        clearInterval(interval);
        const finalJob = { ...config, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() };
        saveJob(finalJob);
      }
    }, 1200);
  };

  const handleCopyConfig = (job: APKConfig) => {
    navigator.clipboard.writeText(JSON.stringify(job, null, 2));
    alert('Configuration copied to clipboard!');
  };

  const handleDownloadJSON = (job: APKConfig) => {
    const blob = new Blob([JSON.stringify(job, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${job.appName.toLowerCase().replace(/\s+/g, '_')}_config.json`;
    a.click();
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-electric-green/30 selection:text-electric-green">
      <div className="scanline" />
      
      {/* Header */}
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-electric-green rounded flex items-center justify-center shadow-[0_0_15px_rgba(0,255,65,0.4)]">
              <Smartphone className="text-black w-5 h-5" />
            </div>
            <span className="font-mono font-bold text-xl tracking-tighter text-white">
              WEB2<span className="text-electric-green">APK</span>
              <span className="text-[10px] ml-1 px-1 bg-electric-green/10 text-electric-green border border-electric-green/20 rounded">FREE</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <button onClick={() => setStep(1)} className="hover:text-electric-green transition-colors">Converter</button>
            <a href="#features" className="hover:text-electric-green transition-colors">Features</a>
            <button onClick={() => setShowHistory(true)} className="flex items-center gap-2 hover:text-electric-green transition-colors">
              <History className="w-4 h-4" /> History
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <a 
              href="https://web2apk.online" 
              target="_blank" 
              className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
            >
              web2apk.online <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-mono font-bold tracking-tight mb-6"
          >
            PREMIUM <span className="text-electric-green glow-text">FREE</span><br />
            APK CONVERSION
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto text-lg"
          >
            Stop paying for basic features. Get full control over your web-to-app conversion with JS injection, 
            offline support, and zero watermarks.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Wizard */}
          <div className="lg:col-span-8">
            <div className="bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
              {/* Wizard Steps Indicator */}
              <div className="flex border-b border-white/10">
                {[
                  { id: 1, icon: Globe, label: 'URL' },
                  { id: 2, icon: Smartphone, label: 'App Info' },
                  { id: 3, icon: Settings, label: 'Advanced' },
                  { id: 4, icon: Zap, label: 'Build' }
                ].map((s) => (
                  <div 
                    key={s.id}
                    className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors relative ${
                      step === s.id ? 'text-electric-green' : 'text-zinc-500'
                    }`}
                  >
                    <s.icon className="w-5 h-5" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">{s.label}</span>
                    {step === s.id && (
                      <motion.div 
                        layoutId="activeStep"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-green shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="p-8 min-h-[400px]">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-mono text-zinc-500 uppercase tracking-tighter">Website URL</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                          <input 
                            type="url" 
                            placeholder="https://your-website.com"
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-electric-green/50 focus:ring-1 focus:ring-electric-green/50 outline-none transition-all font-mono text-electric-green"
                            value={config.url}
                            onChange={(e) => setConfig({ ...config, url: e.target.value })}
                          />
                        </div>
                        {!config.url.startsWith('https://') && config.url.length > 0 && (
                          <p className="text-xs text-amber-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> HTTPS is highly recommended for APK builds.
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-mono text-zinc-500 uppercase tracking-tighter">Orientation</label>
                          <select 
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 focus:border-electric-green/50 outline-none transition-all font-mono"
                            value={config.orientation}
                            onChange={(e) => setConfig({ ...config, orientation: e.target.value as any })}
                          >
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                            <option value="auto">Auto-Rotate</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-mono text-zinc-500 uppercase tracking-tighter">Target Android</label>
                          <select 
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 focus:border-electric-green/50 outline-none transition-all font-mono"
                            value={config.androidVersion}
                            onChange={(e) => setConfig({ ...config, androidVersion: e.target.value })}
                          >
                            <option value="14.0">Android 14 (API 34)</option>
                            <option value="13.0">Android 13 (API 33)</option>
                            <option value="12.0">Android 12 (API 31)</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-mono text-zinc-500 uppercase tracking-tighter">App Name</label>
                          <input 
                            type="text" 
                            placeholder="My Awesome App"
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 focus:border-electric-green/50 outline-none transition-all font-mono"
                            value={config.appName}
                            onChange={(e) => setConfig({ ...config, appName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-mono text-zinc-500 uppercase tracking-tighter">Package Name</label>
                          <input 
                            type="text" 
                            placeholder="com.company.app"
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 focus:border-electric-green/50 outline-none transition-all font-mono"
                            value={config.packageName}
                            onChange={(e) => setConfig({ ...config, packageName: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-mono text-zinc-500 uppercase tracking-tighter">App Icon (512x512)</label>
                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-electric-green/30 transition-colors cursor-pointer group">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Download className="text-zinc-500 group-hover:text-electric-green" />
                          </div>
                          <p className="text-sm text-zinc-400">Drag and drop or <span className="text-electric-green">browse</span></p>
                          <p className="text-[10px] text-zinc-600 mt-1">PNG, JPG or WEBP (Max 2MB)</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(config.features).map(([key, value]) => (
                          <button
                            key={key}
                            onClick={() => setConfig({
                              ...config,
                              features: { ...config.features, [key]: !value }
                            })}
                            className={`p-4 rounded-xl border transition-all text-left flex flex-col gap-2 ${
                              value 
                                ? 'bg-electric-green/10 border-electric-green/30 text-electric-green' 
                                : 'bg-black/30 border-white/5 text-zinc-500 hover:border-white/20'
                            }`}
                          >
                            <CheckCircle2 className={`w-4 h-4 ${value ? 'opacity-100' : 'opacity-20'}`} />
                            <span className="text-[10px] font-mono uppercase tracking-tighter leading-tight">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-mono text-zinc-500 uppercase tracking-tighter flex items-center gap-2">
                          <Code className="w-4 h-4" /> Custom JS Injection
                        </label>
                        <textarea 
                          placeholder="// Add custom JavaScript to run on app launch..."
                          className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 h-32 focus:border-electric-green/50 outline-none transition-all font-mono text-xs text-electric-green"
                          value={config.customJS}
                          onChange={(e) => setConfig({ ...config, customJS: e.target.value })}
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div 
                      key="step4"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12"
                    >
                      {!isBuilding ? (
                        <div className="text-center space-y-8 max-w-md">
                          <div className="w-20 h-20 bg-electric-green/10 rounded-full flex items-center justify-center mx-auto border border-electric-green/20">
                            <Shield className="text-electric-green w-10 h-10" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-2xl font-mono font-bold">Ready to Build?</h3>
                            <p className="text-zinc-400 text-sm">
                              Your configuration is validated. We'll generate a signed release APK for <b>{config.appName || 'Your App'}</b>.
                            </p>
                          </div>
                          <button 
                            onClick={startBuild}
                            className="w-full bg-electric-green text-black font-mono font-bold py-4 rounded-xl hover:shadow-[0_0_25px_rgba(0,255,65,0.4)] transition-all flex items-center justify-center gap-2"
                          >
                            <Cpu className="w-5 h-5" /> INITIALIZE COMPILER
                          </button>
                        </div>
                      ) : (
                        <div className="w-full space-y-8">
                          <div className="space-y-4">
                            <div className="flex justify-between items-end font-mono text-xs">
                              <span className="text-electric-green animate-pulse">BUILDING_IN_PROGRESS...</span>
                              <span className="text-zinc-500">{buildProgress}%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                              <motion.div 
                                className="h-full bg-electric-green rounded-full shadow-[0_0_15px_rgba(0,255,65,0.5)] relative"
                                initial={{ width: 0 }}
                                animate={{ width: `${buildProgress}%` }}
                              >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-sm" />
                              </motion.div>
                            </div>
                          </div>

                          <div className="bg-black rounded-xl border border-white/10 p-4 font-mono text-[10px] h-48 overflow-y-auto terminal-scrollbar space-y-1">
                            {logs.map((log, i) => (
                              <div key={i} className={log.startsWith('[SYSTEM]') ? 'text-cyan-glow' : 'text-zinc-400'}>
                                <span className="text-zinc-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                {log}
                              </div>
                            ))}
                            <div ref={logEndRef} />
                          </div>

                          {buildProgress === 100 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex gap-4"
                            >
                              <button className="flex-1 bg-white text-black font-mono font-bold py-4 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                                <Download className="w-5 h-5" /> DOWNLOAD APK
                              </button>
                              <button 
                                onClick={() => handleDownloadJSON(config)}
                                className="px-6 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
                              >
                                <Copy className="w-5 h-5" />
                              </button>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              {step < 4 && (
                <div className="p-6 border-t border-white/10 bg-black/20 flex justify-between">
                  <button 
                    onClick={prevStep}
                    disabled={step === 1}
                    className="px-6 py-3 rounded-xl font-mono text-sm text-zinc-500 hover:text-white disabled:opacity-0 transition-all flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> PREVIOUS
                  </button>
                  <button 
                    onClick={nextStep}
                    className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-mono text-sm text-white hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    NEXT STEP <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Live Preview Card */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
              <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-tighter mb-6 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Config Preview
              </h3>
              <div className="bg-black/50 rounded-2xl p-4 font-mono text-[10px] text-electric-green/80 space-y-2 border border-white/5">
                <div className="flex justify-between">
                  <span className="text-zinc-600">APP_NAME:</span>
                  <span>"{config.appName || 'Untitled'}"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">PACKAGE:</span>
                  <span>"{config.packageName}"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">URL:</span>
                  <span className="truncate ml-4">"{config.url || 'null'}"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">ORIENTATION:</span>
                  <span>"{config.orientation}"</span>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <span className="text-zinc-600">FEATURES:</span>
                  <div className="grid grid-cols-2 gap-x-4 mt-1">
                    {Object.entries(config.features).map(([k, v]) => (
                      <div key={k} className={v ? 'text-electric-green' : 'text-zinc-800'}>
                        • {k}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <button 
                  onClick={() => handleCopyConfig(config)}
                  className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-3 h-3" /> COPY JSON
                </button>
                <button 
                  onClick={() => handleDownloadJSON(config)}
                  className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-3 h-3" /> EXPORT
                </button>
              </div>
            </div>

            {/* Premium Comparison */}
            <div className="bg-electric-green/5 border border-electric-green/20 rounded-3xl p-6">
              <h3 className="text-sm font-mono text-electric-green uppercase tracking-tighter mb-4">Why it's Free</h3>
              <div className="space-y-3">
                {[
                  'No Watermarks',
                  'Custom JS Injection',
                  'Offline Mode Support',
                  'Full Permission Control',
                  'Zero Build Limits'
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3 h-3 text-electric-green" /> {f}
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-electric-green/10">
                <p className="text-[10px] text-zinc-500 italic">
                  "We believe developers shouldn't pay for simple wrappers. Use this tool to build your PWA into a native experience."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <section id="history" className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-mono font-bold flex items-center gap-3">
              <History className="text-electric-green" /> RECENT JOBS
            </h2>
            <button 
              onClick={() => { localStorage.removeItem(STORAGE_KEY); setJobs([]); }}
              className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Clear History
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="border border-dashed border-white/10 rounded-3xl py-20 text-center text-zinc-600 font-mono text-sm">
              NO RECENT BUILDS FOUND
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={job.id}
                  className="bg-zinc-900/30 border border-white/10 rounded-2xl p-5 hover:border-electric-green/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-zinc-500 group-hover:text-electric-green transition-colors" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-mono font-bold text-white mb-1">{job.appName}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono truncate mb-4">{job.url}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCopyConfig(job)}
                      className="flex-1 py-2 rounded-lg bg-white/5 text-[10px] font-mono hover:bg-white/10 transition-colors"
                    >
                      CONFIG
                    </button>
                    <button 
                      onClick={() => handleDownloadJSON(job)}
                      className="flex-1 py-2 rounded-lg bg-electric-green/10 text-electric-green text-[10px] font-mono hover:bg-electric-green/20 transition-colors"
                    >
                      RE-DOWNLOAD
                    </button>
                    <button 
                      onClick={() => deleteJob(job.id)}
                      className="px-3 py-2 rounded-lg bg-red-500/5 text-red-500/50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Features Comparison */}
        <section id="features" className="mt-32 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-mono font-bold mb-4">PREMIUM COMPARISON</h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-sm">See how our open-source tool stacks up against paid alternatives like web2apk.online</p>
          </div>

          <div className="max-w-4xl mx-auto bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left p-6 text-zinc-500 uppercase tracking-widest text-[10px]">Feature</th>
                  <th className="p-6 text-zinc-500 uppercase tracking-widest text-[10px]">Web2APK.online</th>
                  <th className="p-6 text-electric-green uppercase tracking-widest text-[10px]">Our Tool</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { name: 'No Watermarks', paid: 'Paid Only', free: 'Always Free' },
                  { name: 'Custom JS Injection', paid: 'Enterprise', free: 'Included' },
                  { name: 'Biometric Auth', paid: 'Add-on', free: 'Included' },
                  { name: 'Offline Mode', paid: 'Premium', free: 'Included' },
                  { name: 'Push Notifications', paid: 'Subscription', free: 'Free Setup' },
                  { name: 'Icon Customization', paid: 'Included', free: 'Included' }
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-white/5 transition-colors">
                    <td className="p-6 text-zinc-300">{row.name}</td>
                    <td className="p-6 text-center text-zinc-600">{row.paid}</td>
                    <td className="p-6 text-center text-electric-green font-bold">{row.free}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* History Modal Overlay */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowHistory(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-mono font-bold text-xl flex items-center gap-2">
                  <History className="text-electric-green" /> BUILD HISTORY
                </h3>
                <button onClick={() => setShowHistory(false)} className="text-zinc-500 hover:text-white">
                  <AlertCircle className="rotate-45" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 terminal-scrollbar">
                {jobs.map(job => (
                  <div key={job.id} className="bg-black/40 border border-white/5 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <div className="font-mono text-sm text-white">{job.appName}</div>
                      <div className="font-mono text-[10px] text-zinc-600">{job.packageName}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleDownloadJSON(job)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <Download className="w-4 h-4 text-zinc-400" />
                      </button>
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <div className="text-center py-12 text-zinc-600 font-mono">NO HISTORY FOUND</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-white/5 py-12 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-electric-green/20 rounded flex items-center justify-center">
              <Smartphone className="text-electric-green w-4 h-4" />
            </div>
            <span className="font-mono font-bold text-sm tracking-tighter text-zinc-400">
              WEB2APK <span className="text-electric-green">FREE</span>
            </span>
          </div>
          <div className="flex gap-8 text-xs font-mono text-zinc-600">
            <a href="#" className="hover:text-electric-green transition-colors">Privacy</a>
            <a href="#" className="hover:text-electric-green transition-colors">Terms</a>
            <a href="#" className="hover:text-electric-green transition-colors">GitHub</a>
            <a href="https://web2apk.online" target="_blank" className="hover:text-electric-green transition-colors">Paid Alternative</a>
          </div>
          <p className="text-[10px] font-mono text-zinc-700">
            © {new Date().getFullYear()} WEB2APK. BUILT FOR THE COMMUNITY.
          </p>
        </div>
      </footer>
    </div>
  );
}
