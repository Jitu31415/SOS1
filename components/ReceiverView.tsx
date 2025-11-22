import React, { useState, useEffect, useCallback } from 'react';
import Radar from './Radar';
import { DetectedSignal, EmergencyType } from '../types';
import { Map, Radio, AlertTriangle, Navigation, Wifi, List, Radar as RadarIcon } from 'lucide-react';

const ReceiverView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [signals, setSignals] = useState<DetectedSignal[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<DetectedSignal | null>(null);
  const [activeTab, setActiveTab] = useState<'radar' | 'list'>('radar');

  // Simulate finding signals
  const scanForSignals = useCallback(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newSignal: DetectedSignal = {
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
          location: {
            latitude: 34.0522 + (Math.random() - 0.5) * 0.01,
            longitude: -118.2437 + (Math.random() - 0.5) * 0.01,
            accuracy: 10,
            timestamp: Date.now()
          },
          message: "Injured leg, need assistance immediately.",
          type: Math.random() > 0.5 ? EmergencyType.MEDICAL : EmergencyType.ENVIRONMENTAL,
          priority: Math.random() > 0.8 ? 'CRITICAL' : 'HIGH',
          batteryLevel: Math.floor(Math.random() * 100),
          signalStrength: -40 - Math.random() * 50,
          distance: Math.floor(Math.random() * 800), // meters
          lastSeen: Date.now()
        };
        
        setSignals(prev => {
            const list = [...prev, newSignal];
            return list.slice(-5);
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isScanning]);

  useEffect(() => {
    const cleanup = scanForSignals();
    return () => {
        if (cleanup) cleanup();
    }
  }, [scanForSignals]);

  const toggleScan = () => {
    setIsScanning(!isScanning);
    if (!isScanning) {
      setSignals([]);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-950 text-green-500 overflow-hidden relative">
      {/* Header */}
      <header className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center z-10 shadow-md shrink-0">
        <div className="flex items-center gap-2">
           <Radio className={`w-6 h-6 ${isScanning ? 'animate-pulse' : ''}`} />
           <h1 className="text-xl font-bold tracking-wider">RECEIVER</h1>
        </div>
        <button onClick={onBack} className="px-3 py-1 text-xs font-bold bg-slate-800 rounded hover:bg-slate-700 text-slate-300 uppercase tracking-wider">
            Exit
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col md:flex-row">
        
        {/* Radar Panel - Visible on Radar Tab or Desktop */}
        <div className={`flex-1 flex-col items-center p-4 gap-6 overflow-y-auto ${activeTab === 'radar' ? 'flex' : 'hidden md:flex'}`}>
          <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[300px]">
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              <Radar signals={signals} isScanning={isScanning} />
              <div className="absolute bottom-4 left-4 text-xs font-mono text-slate-400 pointer-events-none">
                <div>FREQ: 2.4GHz / BLE</div>
                <div>STATUS: {isScanning ? 'SCANNING...' : 'STANDBY'}</div>
              </div>
            </div>
          </div>

          <button
            onClick={toggleScan}
            className={`w-full max-w-md py-4 rounded-xl font-bold tracking-[0.2em] shadow-lg active:scale-95 transition-all duration-300 shrink-0 mb-20 md:mb-0 ${
              isScanning 
                ? 'bg-red-900/50 text-red-400 border border-red-500 hover:bg-red-900' 
                : 'bg-green-900/50 text-green-400 border border-green-500 hover:bg-green-900'
            }`}
          >
            {isScanning ? 'STOP SCAN' : 'START SCAN'}
          </button>
        </div>

        {/* List/Details Panel - Visible on List Tab or Desktop */}
        <div className={`flex-1 flex-col bg-slate-900/50 md:border-l border-slate-800 p-4 overflow-hidden ${activeTab === 'list' ? 'flex' : 'hidden md:flex'}`}>
          <h2 className="text-sm font-bold text-slate-400 mb-4 uppercase border-b border-slate-800 pb-2 flex items-center justify-between shrink-0">
            <span>Detected Signals ({signals.length})</span>
            <Wifi className="w-4 h-4" />
          </h2>

          <div className="flex-1 overflow-y-auto space-y-3 pb-20 md:pb-0">
            {signals.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                <AlertTriangle className="w-12 h-12 mb-2" />
                <p>No signals detected</p>
              </div>
            ) : (
              signals.map((sig) => (
                <div 
                  key={sig.id}
                  onClick={() => setSelectedSignal(sig)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all active:scale-98 ${
                    selectedSignal?.id === sig.id 
                      ? 'bg-green-900/30 border-green-500' 
                      : 'bg-slate-800/50 border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        sig.priority === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-600 text-black'
                    }`}>
                      {sig.priority}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{new Date(sig.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <h3 className="font-mono text-sm text-white font-bold">{sig.type} ALERT</h3>
                     <span className="text-xs font-mono text-green-400">{sig.distance}m away</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-300 line-clamp-2">"{sig.message}"</div>
                  <div className="mt-2 w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                    <div 
                        className="bg-green-500 h-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, 100 + sig.signalStrength)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {selectedSignal && activeTab === 'list' && (
             <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-700 shrink-0 mb-16 md:mb-0">
                 <div className="flex items-center gap-2 mb-2 text-green-400">
                      <Navigation className="w-4 h-4" />
                      <span className="font-bold text-sm">TARGET LOCKED</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 mb-3">
                      <div>LAT: {selectedSignal.location.latitude.toFixed(6)}</div>
                      <div>LON: {selectedSignal.location.longitude.toFixed(6)}</div>
                  </div>
                  <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold text-white uppercase">
                    Navigate to Target
                  </button>
             </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex pb-safe z-20">
        <button 
            onClick={() => setActiveTab('radar')}
            className={`flex-1 p-4 flex flex-col items-center gap-1 active:bg-slate-800 transition-colors ${activeTab === 'radar' ? 'text-green-500' : 'text-slate-500'}`}
        >
            <RadarIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Radar</span>
        </button>
        <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 p-4 flex flex-col items-center gap-1 active:bg-slate-800 transition-colors ${activeTab === 'list' ? 'text-green-500' : 'text-slate-500'}`}
        >
            <div className="relative">
                <List className="w-6 h-6" />
                {signals.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-slate-900"></span>
                )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Signals</span>
        </button>
      </div>
    </div>
  );
};

export default ReceiverView;