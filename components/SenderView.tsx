import React, { useState, useEffect } from 'react';
import { AlertOctagon, Mic, Send, RefreshCw, ShieldAlert, Battery, MapPin } from 'lucide-react';
import { analyzeSOSContext } from '../services/geminiService';
import { EmergencyType, GeoLocation } from '../types';

const SenderView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emergencyStatus, setEmergencyStatus] = useState<{type: EmergencyType, priority: string} | null>(null);
  const [battery, setBattery] = useState(100);

  // Mock Battery drain
  useEffect(() => {
    const interval = setInterval(() => {
        setBattery(b => Math.max(0, b - 1));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp
          });
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleBroadcast = async () => {
    if (!location) {
        alert("Waiting for GPS lock...");
        return;
    }
    
    if (isBroadcasting) {
        setIsBroadcasting(false);
        return;
    }

    setIsAnalyzing(true);
    
    // Use Gemini to analyze the message if provided, otherwise default
    const context = messageInput.trim() ? await analyzeSOSContext(messageInput) : {
        type: EmergencyType.OTHER,
        priority: 'HIGH',
        summary: 'Emergency Beacon Active'
    };

    setEmergencyStatus({ type: context.type, priority: context.priority });
    setIsAnalyzing(false);
    setIsBroadcasting(true);
  };

  return (
    <div className={`flex flex-col h-[100dvh] transition-colors duration-1000 ${isBroadcasting ? 'bg-red-950' : 'bg-slate-900'} text-white overflow-hidden relative`}>
      
      {/* Header */}
      <header className="p-6 flex justify-between items-start z-10 shrink-0">
        <div>
             <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                <ShieldAlert className="text-red-500" /> 
                SIGNAL_LINK
             </h1>
             <div className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-4">
                <span className="flex items-center gap-1"><Battery className="w-3 h-3"/> {battery}%</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {location ? 'GPS LOCKED' : 'ACQUIRING...'}</span>
             </div>
        </div>
        <button onClick={onBack} className="px-4 py-2 text-xs font-bold bg-black/30 backdrop-blur border border-slate-600 rounded-lg hover:bg-slate-800 active:bg-slate-700">
            ABORT
        </button>
      </header>

      {/* Main Interaction Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative w-full">
         
         {/* Visual Pulse Effect for Broadcasting */}
         {isBroadcasting && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                 <div className="w-64 h-64 bg-red-600 rounded-full opacity-20 animate-ping"></div>
                 <div className="w-96 h-96 bg-red-600 rounded-full opacity-10 animate-ping delay-75"></div>
                 <div className="w-[150%] h-[150%] bg-red-600 rounded-full opacity-5 animate-ping delay-150"></div>
             </div>
         )}

         {/* Status Display */}
         {emergencyStatus && isBroadcasting && (
             <div className="absolute top-10 bg-black/60 backdrop-blur px-6 py-3 rounded-full border border-red-500/50 text-center animate-pulse z-20 shadow-xl">
                 <div className="text-[10px] text-red-300 font-bold tracking-[0.2em] uppercase">Status: Active</div>
                 <div className="text-lg font-mono font-bold text-white">{emergencyStatus.priority} • {emergencyStatus.type}</div>
             </div>
         )}

         {/* Big Button */}
         <button
            onClick={handleBroadcast}
            disabled={isAnalyzing || !location}
            className={`relative z-20 w-64 h-64 sm:w-72 sm:h-72 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 active:scale-95 touch-manipulation ${
                isBroadcasting 
                 ? 'bg-white text-red-600 shadow-[0_0_100px_rgba(255,0,0,0.6)]'
                 : 'bg-gradient-to-b from-red-600 to-red-800 text-white hover:scale-105 hover:shadow-[0_0_50px_rgba(220,38,38,0.4)]'
            } ${(!location || isAnalyzing) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
         >
             {isAnalyzing ? (
                 <RefreshCw className="w-16 h-16 animate-spin" />
             ) : (
                 <>
                    <AlertOctagon className={`w-20 h-20 mb-2 ${isBroadcasting ? 'animate-pulse' : ''}`} />
                    <span className="text-3xl font-black tracking-widest">
                        {isBroadcasting ? 'STOP' : 'SOS'}
                    </span>
                 </>
             )}
         </button>
         
         <p className="mt-8 text-center text-slate-400 max-w-xs text-sm font-medium">
             {isBroadcasting 
               ? "Transmitting location and status. Keep app active."
               : "Press and hold to activate emergency beacon."}
         </p>
      </div>

      {/* Input Area - only visible when not broadcasting */}
      <div className={`p-6 bg-slate-900 border-t border-slate-800 transition-all duration-500 z-30 shrink-0 pb-8 ${isBroadcasting ? 'translate-y-full opacity-0 hidden' : 'translate-y-0 opacity-100 block'}`}>
         <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Emergency Context</label>
         <div className="flex gap-2">
            <div className="relative flex-1">
                <input 
                    type="text" 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Nature of emergency..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-base text-white focus:border-red-500 focus:outline-none pl-11 placeholder:text-slate-600"
                />
                <Mic className="w-5 h-5 text-slate-500 absolute left-4 top-4" />
            </div>
            <button 
                className="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white p-4 rounded-xl border border-slate-700 transition-colors"
                onClick={() => setMessageInput("Medical Emergency. Cannot move.")}
                aria-label="Quick preset"
            >
                <Send className="w-5 h-5" />
            </button>
         </div>
      </div>
    </div>
  );
};

export default SenderView;