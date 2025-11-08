import { Card } from "./ui/card";

interface SignalStatusProps {
  distance: number;
}

export const SignalStatus = ({ distance }: SignalStatusProps) => {
  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-sm font-medium text-muted-foreground tracking-wider mb-4">SIGNAL STATUS</h3>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-signal-safe shadow-xl shadow-signal-safe/30 animate-pulse" />
        <div>
          <p className="text-sm text-muted-foreground">Next Signal</p>
          <p className="text-3xl font-bold text-foreground">{distance} KM</p>
        </div>
      </div>
    </Card>
  );
};
