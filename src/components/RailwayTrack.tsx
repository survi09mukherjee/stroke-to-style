import { Building2, Crown, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

interface RFIDModule {
  id: string;
  type: "active" | "passive" | "wireless" | "epc";
  label: string;
}

interface TrainData {
  id: string;
  label: string;
  status: string;
  color: "train-a" | "train-b" | "train-c";
  position: number;
}

interface TrackProps {
  name: string;
  train?: TrainData;
  rfidModules: RFIDModule[];
  showStation?: boolean;
  showCabin?: boolean;
  hasStopSignal?: boolean;
}

export const RailwayTrack = ({ name, train, rfidModules, showStation, showCabin, hasStopSignal }: TrackProps) => {
  return (
    <div className="relative py-6">
      {/* Track Label */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {showStation && (
          <div className="flex flex-col items-center gap-1">
            <Building2 className="w-8 h-8 text-station" />
            <span className="text-[10px] text-station font-medium">STATION</span>
          </div>
        )}
        {showCabin && (
          <div className="flex flex-col items-center gap-1">
            <Crown className="w-8 h-8 text-cabin" />
            <span className="text-[10px] text-cabin font-medium">SIGNAL</span>
            <span className="text-[10px] text-cabin font-medium">CABIN</span>
          </div>
        )}
        <span className="text-sm font-medium text-muted-foreground ml-2">{name}</span>
      </div>

      {/* Track Line */}
      <div className="ml-32 mr-8 relative">
        <div className="h-2 bg-track rounded-full relative">
          {/* Train */}
          {train && (
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
              style={{ left: `${train.position}%` }}
            >
              <div className="flex items-center gap-1 px-2 py-0.5 bg-card/80 rounded text-[10px]">
                <span className="font-semibold text-foreground">{train.label}</span>
              </div>
              <div className="text-xs px-2 py-0.5 bg-card/60 rounded">
                <span className="text-[9px] text-muted-foreground">Status: {train.status}</span>
              </div>
              <div className={cn("w-12 h-10 rounded-lg flex items-center justify-center", `bg-${train.color}`)}>
                <svg className="w-8 h-8 text-background" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c-4 0-8 0.5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v0.5h2l2-2h4l2 2h2v-0.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-0.83 0-1.5-0.67-1.5-1.5S6.67 14 7.5 14s1.5 0.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-0.83 0-1.5-0.67-1.5-1.5s0.67-1.5 1.5-1.5 1.5 0.67 1.5 1.5-0.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
            </div>
          )}
          
          {/* RFID Modules */}
          {rfidModules.map((module, idx) => (
            <div
              key={module.id}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
              style={{ left: `${15 + idx * 20}%` }}
            >
              {module.type === "wireless" ? (
                <Radio className="w-4 h-4 text-rfid-active animate-pulse" />
              ) : (
                <div
                  className={cn(
                    "w-6 h-6 rounded flex items-center justify-center text-[8px] font-bold",
                    module.type === "active" ? "bg-rfid-active text-background" :
                    module.type === "epc" ? "bg-purple-500 text-background" :
                    "bg-rfid-passive text-background"
                  )}
                >
                  {module.type === "active" ? "A" : module.type === "epc" ? "E" : "P"}
                </div>
              )}
              <span className="text-[9px] text-muted-foreground whitespace-nowrap">{module.label}</span>
              {module.type === "wireless" && (
                <span className="text-[8px] text-rfid-active">Wireless</span>
              )}
            </div>
          ))}

          {/* Signals */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-[10%]">
            <div className={cn(
              "w-3 h-3 rounded-full",
              "bg-signal-safe shadow-lg shadow-signal-safe/50"
            )} />
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-[95%]">
            <div className={cn(
              "w-3 h-3 rounded-full",
              hasStopSignal ? "bg-signal-stop shadow-lg shadow-signal-stop/50" : "bg-accent shadow-lg shadow-accent/50"
            )} />
          </div>
        </div>
        
        {/* Dashed connection lines */}
        <svg className="absolute -left-20 top-1/2 -translate-y-1/2 w-20 h-12" style={{ overflow: "visible" }}>
          <path d="M 0 6 Q 10 6 20 6" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" fill="none" className="text-muted-foreground/30" />
        </svg>
      </div>
    </div>
  );
};
