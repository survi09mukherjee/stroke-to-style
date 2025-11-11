import { Card } from "./ui/card";
import { Gauge } from "lucide-react";

interface Train {
  id: string;
  label: string;
  color: string;
  speed: number;
}

interface SpeedDisplayProps {
  trains: Train[];
  maxSpeed?: number;
}

export const SpeedDisplay = ({ trains, maxSpeed = 120 }: SpeedDisplayProps) => {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground tracking-wider">TRAIN SPEEDS</h3>
          <Gauge className="w-4 h-4 text-muted-foreground" />
        </div>
        
        {trains.map((train) => {
          const speedPercentage = (train.speed / maxSpeed) * 100;
          return (
            <div key={train.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: train.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{train.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">{Math.round(train.speed)}</span>
                  <span className="text-sm text-muted-foreground">km/h</span>
                </div>
              </div>
              
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${speedPercentage}%`,
                    backgroundColor: train.color
                  }}
                />
              </div>
            </div>
          );
        })}
        
        <div className="flex justify-between text-xs text-muted-foreground pt-2">
          <span>0</span>
          <span>{maxSpeed} km/h</span>
        </div>
      </div>
    </Card>
  );
};
