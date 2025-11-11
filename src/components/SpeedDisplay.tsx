import { Card } from "./ui/card";
import { Gauge } from "lucide-react";

interface SpeedDisplayProps {
  speed: number;
  maxSpeed?: number;
}

export const SpeedDisplay = ({ speed, maxSpeed = 120 }: SpeedDisplayProps) => {
  const speedPercentage = (speed / maxSpeed) * 100;
  
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground tracking-wider">SPEED</h3>
          <Gauge className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-bold text-foreground">{speed}</span>
          <span className="text-2xl text-muted-foreground">km/h</span>
        </div>
        
        {/* Speed Indicator Bar */}
        <div className="space-y-2">
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-signal-safe via-accent to-signal-stop rounded-full transition-all duration-500"
              style={{ width: `${speedPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>{maxSpeed} km/h</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
