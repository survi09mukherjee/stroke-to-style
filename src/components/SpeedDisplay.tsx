import { Card } from "./ui/card";

interface SpeedDisplayProps {
  speed: number;
}

export const SpeedDisplay = ({ speed }: SpeedDisplayProps) => {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground tracking-wider">SPEED</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-bold text-foreground">{speed}</span>
          <span className="text-2xl text-muted-foreground">km/h</span>
        </div>
      </div>
    </Card>
  );
};
