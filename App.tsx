import React, { useState } from 'react';
import SenderView from './components/SenderView';
import ReceiverView from './components/ReceiverView';
import { AppMode } from './types';
import { Radio, ShieldAlert, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.LANDING);

  const renderContent = () => {
    switch (mode) {
      case AppMode.SENDER:
        return <SenderView onBack={() => setMode(AppMode.LANDING)} />;
      case AppMode.RECEIVER:
        return <ReceiverView onBack={() => setMode(AppMode.LANDING)} />;
      default:
        return (
          <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center p-6 pb-safe">
             <div className="max-w-md w-full space-y-8">
                
                <div className="text-center space-y-2">
                    <div className="inline-block p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl mb-4">
                        <div className="flex gap-4 text-white">
                             <ShieldAlert className="w-8 h-8 text-red-500" />
                             <div className="w-px bg-slate-700 h-8"></div>
                             <Radio className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">SignalLink</h1>
                    <p className="text-slate-400">Advanced Distress Beacon & Localization System</p>
                </div>

                <div className="space-y-4">
                    <button 
                        onClick={() => setMode(AppMode.SENDER)}
                        className="group w-full bg-gradient-to-r from-red-900 to-slate-900 hover:from-red-800 hover:to-slate-800 border border-red-900/50 p-6 rounded-xl text-left transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] relative overflow-hidden active:scale-95 duration-200 touch-manipulation"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldAlert className="w-24 h-24 rotate-12 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                            Sender Mode <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </h2>
                        <p className="text-sm text-red-200/60">Broadcast emergency SOS beacon with GPS coordinates and status.</p>
                    </button>

                    <button 
                         onClick={() => setMode(AppMode.RECEIVER)}
                         className="group w-full bg-gradient-to-r from-green-900 to-slate-900 hover:from-green-800 hover:to-slate-800 border border-green-900/50 p-6 rounded-xl text-left transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] relative overflow-hidden active:scale-95 duration-200 touch-manipulation"
                    >
                         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Radio className="w-24 h-24 -rotate-12 text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                            Receiver Mode <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </h2>
                        <p className="text-sm text-green-200/60">Scan for local distress signals, visualize radar strength, and locate targets.</p>
                    </button>
                </div>

                <div className="text-center pt-8">
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest">
                        Restricted Use Only • v1.0.4-beta
                    </p>
                </div>

             </div>
          </div>
        );
    }
  };

  return (
    <div className="font-sans antialiased text-slate-200 bg-slate-950 min-h-[100dvh]">
      {renderContent()}
    </div>
  );
};

export default App;