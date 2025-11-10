import { Card } from "./ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface Train {
  id: string;
  label: string;
  color: string;
  speed: number;
  direction: "up" | "down";
  distance: number;
}

interface SpeedDisplayProps {
  trains: Train[];
  onStopTrain?: (trainId: string) => void;
  stoppingTrains?: Set<string>;
}

export const SpeedDisplay = ({ trains, onStopTrain, stoppingTrains = new Set() }: SpeedDisplayProps) => {
  return (
    <Card className="p-4 bg-card border-border">
      <h3 className="text-sm font-medium text-muted-foreground tracking-wider mb-3">TRAIN SPEEDS</h3>
      
      <div className="space-y-2">
        {trains.map((train) => (
          <div 
            key={train.id} 
            className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: train.color }}
              />
              <div className="flex items-center gap-2">
                {train.direction === "up" ? (
                  <ArrowUp className="w-4 h-4 text-signal-safe" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-signal-warning" />
                )}
                <span className="text-xs font-semibold text-muted-foreground">
                  {train.direction.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xl font-bold text-foreground">{Math.round(train.speed)} km/h</div>
                <div className="text-xs text-muted-foreground">{train.distance.toFixed(1)} km away</div>
              </div>
              
              {onStopTrain && (
                <button
                  onClick={() => onStopTrain(train.id)}
                  disabled={stoppingTrains.has(train.id) || train.speed === 0}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                    stoppingTrains.has(train.id) || train.speed === 0
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  }`}
                >
                  {stoppingTrains.has(train.id) ? "STOPPING..." : train.speed === 0 ? "STOPPED" : "STOP"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
