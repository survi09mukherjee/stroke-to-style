import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TrainData {
  id: string;
  label: string;
  color: string;
  fixedPosition: number;
  speed: number;
  direction: "up" | "down";
}

interface TrackProps {
  name: string;
  train?: TrainData;
  trackOffset: number;
  collisionWarning?: boolean;
  oncomingTrains?: Array<{ position: number; color: string }>;
  stations?: Array<{ position: number; name: string }>;
}

export const RailwayTrack = ({ name, train, trackOffset, collisionWarning = false, oncomingTrains = [], stations = [] }: TrackProps) => {
  // Signals move with track
  const [signals, setSignals] = useState<Array<{ position: number; type: "safe" | "caution" | "danger" }>>([
    { position: 20, type: "safe" },
    { position: 80, type: "caution" }
  ]);

  useEffect(() => {
    setSignals(prev => prev.map(sig => ({
      ...sig,
      position: (sig.position + trackOffset) % 100
    })));
  }, [trackOffset]);

  return (
    <div className="relative py-6">
      {/* Track Label */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <span className="text-xs font-semibold text-foreground bg-background px-2 py-1 rounded">{name}</span>
      </div>

      {/* Track Line - moves dynamically */}
      <div className="ml-24 mr-12 relative overflow-hidden">
        <div className={cn(
          "h-4 bg-track rounded-full relative",
          collisionWarning && "animate-pulse"
        )}>
          {/* Moving track pattern */}
          <div 
            className="absolute inset-0 flex"
            style={{ 
              transform: `translateX(-${trackOffset % 100}%)`,
              width: '200%'
            }}
          >
            <div className="w-full h-full bg-track rounded-full" />
            <div className="w-full h-full bg-track rounded-full" />
          </div>

          {/* Collision Warning Overlay */}
          {collisionWarning && (
            <div className="absolute inset-0 bg-signal-stop/20 rounded-full animate-pulse" />
          )}

          {/* Stations - move with track */}
          {stations.map((station, idx) => {
            const stationPos = (station.position - trackOffset + 1000) % 100;
            if (stationPos < 10 || stationPos > 90) return null;
            
            return (
              <div
                key={idx}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${stationPos}%` }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-1 h-6 bg-accent" />
                  <div className="text-[8px] font-semibold text-accent whitespace-nowrap mt-1">
                    {station.name}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Moving Signals */}
          {signals.map((signal, idx) => {
            if (signal.position < 10 || signal.position > 90) return null;
            
            return (
              <div
                key={idx}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${signal.position}%` }}
              >
                <div className="flex flex-col gap-1 bg-secondary/80 p-1.5 rounded-lg border border-border">
                  <div className={cn(
                    "w-3 h-3 rounded-full border-2 transition-all",
                    signal.type === "danger" && "bg-signal-stop border-signal-stop shadow-lg shadow-signal-stop/50",
                    signal.type === "caution" && "bg-accent border-accent shadow-lg shadow-accent/50 animate-pulse",
                    signal.type === "safe" && "bg-signal-safe border-signal-safe shadow-lg shadow-signal-safe/50"
                  )} />
                </div>
              </div>
            );
          })}

          {/* Oncoming Trains - move with track */}
          {oncomingTrains.map((oncoming, idx) => {
            const oncomingPos = (oncoming.position - trackOffset + 1000) % 100;
            if (oncomingPos < 10 || oncomingPos > 90) return null;
            
            return (
              <div
                key={idx}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${oncomingPos}%` }}
              >
                <div 
                  className="w-8 h-6 rounded flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: oncoming.color }}
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c-4 0-8 0.5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v0.5h2l2-2h4l2 2h2v-0.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-0.83 0-1.5-0.67-1.5-1.5S6.67 14 7.5 14s1.5 0.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-0.83 0-1.5-0.67-1.5-1.5s0.67-1.5 1.5-1.5 1.5 0.67 1.5 1.5-0.67 1.5-1.5 1.5z"/>
                  </svg>
                </div>
              </div>
            );
          })}
          
          {/* Static Train at fixed position */}
          {train && (
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-20"
              style={{ left: `${train.fixedPosition}%` }}
            >
              <div className="px-3 py-1 bg-card/90 rounded border border-border mb-2">
                <span className="font-bold text-foreground text-sm">{train.label}</span>
              </div>
              <div 
                className="w-14 h-12 rounded-lg flex items-center justify-center shadow-xl"
                style={{ backgroundColor: train.color }}
              >
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c-4 0-8 0.5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v0.5h2l2-2h4l2 2h2v-0.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-0.83 0-1.5-0.67-1.5-1.5S6.67 14 7.5 14s1.5 0.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-0.83 0-1.5-0.67-1.5-1.5s0.67-1.5 1.5-1.5 1.5 0.67 1.5 1.5-0.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
